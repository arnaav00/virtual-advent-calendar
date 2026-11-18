import test from 'node:test';
import assert from 'node:assert/strict';
import {validCallback} from '../dist/spotify-auth.js';
test('OAuth callback requires matching state and a recent, non-future request',()=>{
const pending={state:'random-state',created:1000};
assert.equal(validCallback(pending,'random-state',2000),true);
assert.equal(validCallback(pending,'wrong-state',2000),false);
assert.equal(validCallback(null,'random-state',2000),false);
assert.equal(validCallback(pending,'random-state',601001),false);
assert.equal(validCallback(pending,'random-state',999),false);
});

test('successful playback commands accept empty and opaque acknowledgements',async()=>{
 const {spotifyRequest}=await import('../dist/spotify-auth.js');
 const oldFetch=globalThis.fetch,oldStorage=globalThis.sessionStorage;
 globalThis.sessionStorage={getItem:()=>JSON.stringify({access_token:'test-only',expiresAt:Date.now()+120000})};
 try{
  for(const response of [new Response(null,{status:204}),new Response('',{status:200}),new Response('opaque-acknowledgement',{status:200})]){
   globalThis.fetch=async()=>response;
   assert.equal(await spotifyRequest('me/player/play',{method:'PUT',body:{context_uri:'test'}}),null);
  }
  globalThis.fetch=async()=>new Response('{"is_playing":true}',{status:200});
  assert.deepEqual(await spotifyRequest('me/player'),{is_playing:true});
  globalThis.fetch=async()=>new Response('not-json',{status:200});
  await assert.rejects(spotifyRequest('me/player'),/unreadable response/);
  globalThis.fetch=async()=>new Response('denied',{status:403});
  await assert.rejects(spotifyRequest('me/player/play',{method:'PUT'}),/denied playback/);
 }finally{globalThis.fetch=oldFetch;globalThis.sessionStorage=oldStorage;}
});
