import test from 'node:test';
import assert from 'node:assert/strict';
const saved=new Map();
globalThis.localStorage={getItem:key=>saved.get(key),setItem:(key,value)=>saved.set(key,value)};
globalThis.window=new EventTarget();
const state=await import('../dist/gift-state.js');
test('opening persists by day and keeps the original opening time',async()=>{
 assert.equal(state.isOpened(1),false);assert.equal(state.markOpened(1),true);
 const first=saved.get('snowglobe:2026:gifts:v8');state.markOpened(1);assert.equal(saved.get('snowglobe:2026:gifts:v8'),first);
 assert.equal(state.isOpened(1),true);assert.equal(state.isOpened(2),false);
 const reloaded=await import('../dist/gift-state.js?reload');assert.equal(reloaded.isOpened(1),true);
});
test('blocked storage still unlocks this session and reports persistence failure',()=>{
 localStorage.setItem=()=>{throw Error('quota');};assert.equal(state.markOpened(2),false);assert.equal(state.isOpened(2),true);
});
