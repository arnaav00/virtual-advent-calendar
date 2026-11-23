import test from 'node:test';
import assert from 'node:assert/strict';
import { missingReactionAlert, missingReactionDays, REACTION_SLIDE_MS } from '../dist/reaction-slideshow.js';

test('slideshow reports the exact days without saved photos',()=>{
  const photos=[1,2,3,5,6,8,9,10,11,13,14,15,16,17,18,19,20,21,22,24,25].map(day=>({day}));
  const missing=missingReactionDays(photos);
  assert.deepEqual(missing,[4,7,12,23]);
  assert.equal(missingReactionAlert(missing),'You forgot to take a selfie for days 4,7,12, and 23!');
});

test('slideshow is allowed only when photos cover every day from 1 to 25',()=>{
  const complete=Array.from({length:25},(_,index)=>({day:index+1}));
  assert.deepEqual(missingReactionDays(complete),[]);
  assert.equal(missingReactionDays(complete.slice(0,24)).at(-1),25);
});

test('each slideshow photo is shown for exactly 1.6 seconds',()=>{
  assert.equal(REACTION_SLIDE_MS,1600);
});
