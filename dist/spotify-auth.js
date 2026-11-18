export const CLIENT_ID='d4b595fdebd641c8a3fb39ba74452eb6';
const KEY='snowglobe:spotify:session';
const PENDING='snowglobe:spotify:pkce';
export const SCOPES='streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';
let refreshPromise;
const read=key=>{try{return JSON.parse(sessionStorage.getItem(key)||'null');}catch{return null;}};
export const connected=()=>Boolean(read(KEY)?.refresh_token);
export function disconnect(){sessionStorage.removeItem(KEY);}
export function validCallback(pending,state,now=Date.now()){return Boolean(pending&&state&&pending.state===state&&now-pending.created<600000&&now>=pending.created);}
export async function authorize(){
 if(location.hostname==='localhost'){location.assign('http://127.0.0.1:4173/?connect_spotify=1');return;}
 const random=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join('');
 const verifier=random(),state=random(),redirect=location.origin+'/';
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier));
 const challenge=btoa(String.fromCharCode(...new Uint8Array(digest))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
 sessionStorage.setItem(PENDING,JSON.stringify({verifier,state,redirect,created:Date.now()}));
 const query=new URLSearchParams({client_id:CLIENT_ID,response_type:'code',redirect_uri:redirect,scope:SCOPES,state,code_challenge_method:'S256',code_challenge:challenge});
 location.assign('https://accounts.spotify.com/authorize?'+query);
}
async function exchange(params,previous){
 const response=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:CLIENT_ID,...params})});
 if(!response.ok){if(response.status===400||response.status===401)disconnect();throw Error('Spotify sign-in expired or was rejected. Please connect again.');}
 const data=await response.json();const token={...data,refresh_token:data.refresh_token||previous?.refresh_token,expiresAt:Date.now()+data.expires_in*1000};sessionStorage.setItem(KEY,JSON.stringify(token));return token.access_token;
}
export async function finishAuth(){
 const query=new URLSearchParams(location.search);
 if(query.has('connect_spotify')){history.replaceState({},'',location.pathname);await authorize();return false;}
 if(!query.has('code')&&!query.has('error'))return false;
 const pending=read(PENDING);sessionStorage.removeItem(PENDING);history.replaceState({},'',location.pathname);
 if(!validCallback(pending,query.get('state')))throw Error('Sign-in could not be verified. Please connect again in this tab.');
 if(query.has('error'))throw Error('Spotify connection was cancelled. You can connect whenever you’re ready.');
 await exchange({grant_type:'authorization_code',code:query.get('code'),redirect_uri:pending.redirect,code_verifier:pending.verifier});return true;
}
export async function accessToken(){const token=read(KEY);if(!token)throw Error('Connect your Spotify Premium account first.');if(token.expiresAt>Date.now()+60000)return token.access_token;if(!refreshPromise)refreshPromise=exchange({grant_type:'refresh_token',refresh_token:token.refresh_token},token).finally(()=>refreshPromise=null);return refreshPromise;}
export async function spotifyRequest(path,{method='GET',body}={},retry=true){
 const token=await accessToken();const response=await fetch('https://api.spotify.com/v1/'+path,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 if(response.status===401&&retry){const saved=read(KEY);if(saved){saved.expiresAt=0;sessionStorage.setItem(KEY,JSON.stringify(saved));}return spotifyRequest(path,{method,body},false);}
 if(!response.ok)throw Error(response.status===403?'Spotify denied playback. Check Premium and the app’s allowed users.':response.status===429?'Spotify needs a short break. Please try again shortly.':`Spotify could not complete that action (${response.status}). Try again.`);
 // Playback commands do not return a data model. Some successful responses
 // contain an opaque acknowledgement rather than JSON.
 if(method!=='GET'||response.status===204)return null;
 const text=await response.text();
 if(!text.trim())return null;
 try{return JSON.parse(text);}catch{throw Error('Spotify returned an unreadable response. Please try again.');}
}
