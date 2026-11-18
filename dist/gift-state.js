import { firebaseConfig } from './firebase-config.js';

const KEY='snowglobe:2026:gifts:v8';
let memory={};
try{memory=JSON.parse(localStorage.getItem(KEY)||'{}');if(!memory||typeof memory!=='object')memory={};}catch{}

let cloud=null,cloudReady=false,cloudInit;
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
    if(next.openedAt||next.letterOpenedAt)remote[day]=next;
  }
  memory=remote;
  persist();announce('gift-state-updated',{source:'firebase'});
}

// Uses Firebase's official CDN modules because this illustration is served as
// plain ES modules rather than through a bundler. If Firebase is not configured
// yet, the calendar continues with local browser storage during setup.
export function initializeGiftState(){
  return cloudInit??=(async()=>{
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

function syncField(day,field){
  if(!cloudReady||!cloud)return;
  cloud.setDoc(cloud.doc(cloud.db,'giftProgress',String(day)),{[field]:cloud.serverTimestamp()},{merge:true})
    .catch(error=>{console.warn(`[Firebase] Could not sync day ${day}:`,error.message);announce('gift-state-sync-error',{day,field,message:error.message});});
}

export const isOpened=day=>Boolean(memory[day]?.openedAt);
export function markOpened(day){
  const wasOpen=isOpened(day);memory[day]={...memory[day],openedAt:memory[day]?.openedAt||new Date().toISOString()};
  const persisted=persist();announce('gift-opened',{day,persisted,alreadyOpen:wasOpen});
  if(!wasOpen)syncField(day,'openedAt');
  return persisted;
}
export const isLetterOpened=day=>Boolean(memory[day]?.letterOpenedAt);
export function markLetterOpened(day){
  if(isLetterOpened(day))return;
  memory[day]={...memory[day],letterOpenedAt:new Date().toISOString()};persist();syncField(day,'letterOpenedAt');
}

let database;
function db(){return database??=new Promise((resolve,reject)=>{const request=indexedDB.open('snowglobe-reactions-2026',1);request.onupgradeneeded=()=>request.result.createObjectStore('reactions',{keyPath:'day'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>{database=null;reject(request.error);};});}
export async function reaction(day){const database=await db();return new Promise((resolve,reject)=>{const req=database.transaction('reactions').objectStore('reactions').get(day);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
export async function saveReaction(day,blob){const database=await db();return new Promise((resolve,reject)=>{const tx=database.transaction('reactions','readwrite');tx.objectStore('reactions').put({day,blob,capturedAt:new Date().toISOString(),year:2026});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
// Future slideshow reads one current image per day; retakes overwrite the same key.
export async function allReactions(){const database=await db();return new Promise((resolve,reject)=>{const req=database.transaction('reactions').objectStore('reactions').getAll();req.onsuccess=()=>resolve(req.result.sort((a,b)=>a.day-b.day));req.onerror=()=>reject(req.error);});}
