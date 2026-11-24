import { firebaseConfig } from './firebase-config.js';

const KEY='snowglobe:2026:gifts:v8';
let memory={};
try{memory=JSON.parse(localStorage.getItem(KEY)||'{}');if(!memory||typeof memory!=='object')memory={};}catch{}

let cloud=null,cloudReady=false,cloudInit,cloudAuthoritative=false,hasRemoteProgress=false;
const TERMS_ACCEPTED_KEY='snowglobe:2026:terms-accepted:v1';
const iso=value=>value?.toDate?value.toDate().toISOString():typeof value==='string'?value:null;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(memory));return true;}catch{return false;}}
function announce(type,detail){window.dispatchEvent(new CustomEvent(type,{detail}));}
function mergeCloudSnapshot(snapshot){
  // Cloud state is authoritative. In particular, removing a document in the
  // Firebase console must clear its local mirror rather than resurrecting it.
  const remote={};
  for(const item of snapshot.docs){
    const day=Number(item.id);if(day<1||day>25)continue;
    const data=item.data(),next={};
    if(data.openedAt)next.openedAt=iso(data.openedAt);
    if(data.letterOpenedAt)next.letterOpenedAt=iso(data.letterOpenedAt);
    if(day===1&&data.termsAccepted===true)next.termsAccepted=true;
    if(data.fireworksActivated===true||(day===25&&data.openedAt))next.fireworksActivated=true;
    if(data.boomboxActivated===true||(day===1&&data.openedAt))next.boomboxActivated=true;
    if(day===25&&data.mariahAtticActivated===true)next.mariahAtticActivated=true;
    if(day===16&&typeof data.snowglobeImage==='string'&&data.snowglobeImageUpdatedAt) {
      next.snowglobeImage=data.snowglobeImage;
      next.snowglobeImageUpdatedAt=iso(data.snowglobeImageUpdatedAt);
    }
    if(next.openedAt||next.letterOpenedAt||next.termsAccepted||next.fireworksActivated||next.boomboxActivated||next.mariahAtticActivated||next.snowglobeImage)remote[day]=next;
  }
  memory=remote;
  hasRemoteProgress=snapshot.docs.length>0;cloudAuthoritative=true;persist();announce('gift-state-updated',{source:'firebase'});
}

function clearLegacyLocalReactions(){
  try{const request=indexedDB.deleteDatabase('snowglobe-reactions-2026');request.onerror=()=>console.warn('[Reactions] Could not clear the old browser-local photo database.');}
  catch(error){console.warn('[Reactions] Could not clear the old browser-local photo database:',error.message);}
}

// Uses Firebase's official CDN modules because this illustration is served as
// plain ES modules rather than through a bundler. If Firebase is not configured
// yet, the calendar continues with local browser storage during setup.
export function initializeGiftState(){
  return cloudInit??=(async()=>{
    clearLegacyLocalReactions();
    if(!firebaseConfig.apiKey||!firebaseConfig.projectId)return false;
    try{
      const version='13.3.0',base=`https://www.gstatic.com/firebasejs/${version}`;
      const [appSdk,authSdk,firestoreSdk]=await Promise.all([
        import(`${base}/firebase-app.js`),import(`${base}/firebase-auth.js`),import(`${base}/firebase-firestore.js`)
      ]);
      const app=appSdk.getApps().find(item=>item.name==='snowglobe')||appSdk.initializeApp(firebaseConfig,'snowglobe');
      const auth=authSdk.getAuth(app);
      await new Promise((resolve,reject)=>{
        let unsubscribe=()=>{};
        unsubscribe=authSdk.onAuthStateChanged(auth,user=>{
          unsubscribe();
          if(user)resolve(user);else authSdk.signInAnonymously(auth).then(resolve,reject);
        },reject);
      });
      const db=firestoreSdk.getFirestore(app),progress=firestoreSdk.collection(db,'giftProgress');
      const initial=await firestoreSdk.getDocs(progress);
      mergeCloudSnapshot(initial);
      cloud={...firestoreSdk,db,progress};
      cloudReady=true;
      for(const item of initial.docs){
        const day=Number(item.id),data=item.data();
        if(day===25&&data.openedAt&&data.fireworksActivated!==true)syncFields(day,{fireworksActivated:true});
        if(day===1&&data.openedAt&&data.boomboxActivated!==true)syncFields(day,{boomboxActivated:true});
      }
      firestoreSdk.onSnapshot(progress,mergeCloudSnapshot,error=>console.warn('[Firebase] Gift-state sync paused:',error.message));
      announce('gift-state-connected',{projectId:firebaseConfig.projectId});
      return true;
    }catch(error){
      console.warn('[Firebase] Using browser-local gift state until setup is complete:',error.message);
      announce('gift-state-offline',{message:error.message});
      return false;
    }
  })();
}

function syncFields(day,fields){
  if(!cloudReady||!cloud)return;
  cloud.setDoc(cloud.doc(cloud.db,'giftProgress',String(day)),fields,{merge:true})
    .catch(error=>{console.warn(`[Firebase] Could not sync day ${day}:`,error.message);announce('gift-state-sync-error',{day,fields:Object.keys(fields),message:error.message});});
}
function syncField(day,field){
  if(!cloudReady||!cloud)return;
  syncFields(day,{[field]:cloud.serverTimestamp()});
}

export const isOpened=day=>Boolean(memory[day]?.openedAt);
export const giftProgressExists=()=>cloudAuthoritative&&hasRemoteProgress;
export function termsWereAccepted(){try{return localStorage.getItem(TERMS_ACCEPTED_KEY)==='yes';}catch{return false;}}
export async function acceptTerms(){
  try{localStorage.setItem(TERMS_ACCEPTED_KEY,'yes');}catch{}
  await initializeGiftState();
  if(!cloudReady||!cloud)return false;
  await cloud.setDoc(cloud.doc(cloud.db,'giftProgress','1'),{termsAccepted:true},{merge:true});
  memory[1]={...memory[1],termsAccepted:true};hasRemoteProgress=true;persist();return true;
}
export function isFeatureActivated(feature){
  const [day,field]=feature==='fireworks'?[25,'fireworksActivated']:feature==='boombox'?[1,'boomboxActivated']:feature==='mariahAttic'?[25,'mariahAtticActivated']:[0,''];
  return Boolean(memory[day]?.[field]);
}
export function activateFeature(feature){
  const [day,field]=feature==='mariahAttic'?[25,'mariahAtticActivated']:[0,''];
  if(!day)return false;
  memory[day]={...memory[day],[field]:true};
  const persisted=persist();announce('gift-state-updated',{source:'local',feature});
  syncFields(day,{[field]:true});
  return persisted;
}
export const savedSnowglobeImage=()=>cloudAuthoritative?memory[16]?.snowglobeImage||null:null;
export async function saveSnowglobeImage(dataUrl){
  if(typeof dataUrl!=='string'||!dataUrl.startsWith('data:image/')||dataUrl.length>800000)throw new Error('The snowglobe image is too large to sync. Choose a smaller image.');
  await initializeGiftState();
  if(!cloudReady||!cloud)throw new Error('Snowglobe image sync requires Firebase. Connect to the internet and try again.');
  const fields={snowglobeImage:dataUrl,snowglobeImageUpdatedAt:cloud.serverTimestamp()};
  await cloud.setDoc(cloud.doc(cloud.db,'giftProgress','16'),fields,{merge:true});
  cloudAuthoritative=true;
  memory[16]={...memory[16],...fields,snowglobeImageUpdatedAt:new Date().toISOString()};persist();
  announce('gift-state-updated',{source:'firebase',day:16});
}
export async function clearSnowglobeImage(){
  await initializeGiftState();
  if(!cloudReady||!cloud)throw new Error('Snowglobe image sync requires Firebase. Connect to the internet and try again.');
  await cloud.updateDoc(cloud.doc(cloud.db,'giftProgress','16'),{
    snowglobeImage:cloud.deleteField(),snowglobeImageUpdatedAt:cloud.deleteField()
  });
  const next={...memory[16]};delete next.snowglobeImage;delete next.snowglobeImageUpdatedAt;
  if(Object.keys(next).length)memory[16]=next;else delete memory[16];
  persist();announce('gift-state-updated',{source:'firebase',day:16});
}
export function markOpened(day){
  const wasOpen=isOpened(day);memory[day]={...memory[day],openedAt:memory[day]?.openedAt||new Date().toISOString()};
  const fields={};
  if(!wasOpen)fields.openedAt=cloudReady&&cloud?cloud.serverTimestamp():memory[day].openedAt;
  const activationField=day===25?'fireworksActivated':day===1?'boomboxActivated':null;
  if(activationField){memory[day][activationField]=true;fields[activationField]=true;}
  const persisted=persist();announce('gift-opened',{day,persisted,alreadyOpen:wasOpen});
  if(Object.keys(fields).length)syncFields(day,fields);
  return persisted;
}
export const isLetterOpened=day=>Boolean(memory[day]?.letterOpenedAt);
export function markLetterOpened(day){
  if(isLetterOpened(day))return;
  memory[day]={...memory[day],letterOpenedAt:new Date().toISOString()};persist();syncField(day,'letterOpenedAt');
}

async function cloudDoc(day){
  await initializeGiftState();
  if(!cloudReady||!cloud)throw new Error('Photo sync requires Firebase. Connect to the internet and try again.');
  return cloud.getDoc(cloud.doc(cloud.db,'giftProgress',String(day)));
}
function dataUrlToBlob(dataUrl){const [head,body]=dataUrl.split(',');const mime=head.match(/data:(.*?);base64/)?.[1]||'image/jpeg';const bytes=Uint8Array.from(atob(body),char=>char.charCodeAt(0));return new Blob([bytes],{type:mime});}
async function compressReaction(blob){
  const image=await createImageBitmap(blob),scale=Math.min(1,640/Math.max(image.width,image.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
  canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);image.close();
  return await new Promise((resolve,reject)=>canvas.toBlob(result=>result?resolve(result):reject(new Error('Could not compress photo.')),'image/jpeg',.68));
}
function blobToDataUrl(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);});}
export async function reaction(day){const snapshot=await cloudDoc(day),data=snapshot.data();return data?.reactionPhoto?{day,blob:dataUrlToBlob(data.reactionPhoto),capturedAt:iso(data.reactionCapturedAt)}:null;}
export async function saveReaction(day,blob){
  const dataUrl=await blobToDataUrl(await compressReaction(blob));
  if(dataUrl.length>800000)throw new Error('This photo is too large to sync. Retake it and try again.');
  await initializeGiftState();
  if(!cloudReady||!cloud)throw new Error('Photo sync requires Firebase. Connect to the internet and try again.');
  await cloud.setDoc(cloud.doc(cloud.db,'giftProgress',String(day)),{reactionPhoto:dataUrl,reactionCapturedAt:cloud.serverTimestamp()},{merge:true});
}
async function compressTreeImage(blob){
  const image=await createImageBitmap(blob),scale=Math.min(1,1200/Math.max(image.width,image.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
  canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);image.close();
  return await new Promise((resolve,reject)=>canvas.toBlob(result=>result?resolve(result):reject(new Error('Could not prepare the Christmas tree image.')),'image/jpeg',.78));
}
export async function christmasTreeImage(){
  const snapshot=await cloudDoc(23),data=snapshot.data();
  return data?.christmasTreeImage?dataUrlToBlob(data.christmasTreeImage):null;
}
export async function saveChristmasTreeImage(blob){
  const dataUrl=await blobToDataUrl(await compressTreeImage(blob));
  if(dataUrl.length>800000)throw new Error('The Christmas tree image is too large to sync. Try a smaller image.');
  await initializeGiftState();
  if(!cloudReady||!cloud)throw new Error('Christmas tree sync requires Firebase. Connect to the internet and try again.');
  await cloud.setDoc(cloud.doc(cloud.db,'giftProgress','23'),{christmasTreeImage:dataUrl,christmasTreeUpdatedAt:cloud.serverTimestamp()},{merge:true});
}
export async function allReactions(){
  await initializeGiftState();
  if(!cloudReady||!cloud)throw new Error('Photo sync requires Firebase.');
  const snapshot=await cloud.getDocs(cloud.progress);
  return snapshot.docs.flatMap(item=>{const data=item.data(),day=Number(item.id);return data.reactionPhoto&&day>=1&&day<=25?[{day,blob:dataUrlToBlob(data.reactionPhoto),capturedAt:iso(data.reactionCapturedAt)}]:[];}).sort((a,b)=>a.day-b.day);
}
