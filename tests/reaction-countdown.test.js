import test from 'node:test';
import assert from 'node:assert/strict';
import {startCountdown} from '../dist/reaction-countdown.js';
function clock(){let time=0,callback;return{now:()=>time,schedule:fn=>{callback=fn;return 1;},cancel:()=>{callback=null;},advance:ms=>{time+=ms;const fn=callback;callback=null;fn?.();}};}
test('photo waits five seconds and displays 5 to 1 before capturing exactly once',()=>{const c=clock(),ticks=[];let captures=0;startCountdown({...c,onTick:n=>ticks.push(n),onComplete:()=>captures++});assert.deepEqual(ticks,[5]);for(let i=0;i<4;i++)c.advance(1000);assert.equal(captures,0);assert.deepEqual(ticks,[5,4,3,2,1]);c.advance(1000);c.advance(1000);assert.equal(captures,1);});
test('closing cancels capture and delayed frames obey elapsed time',()=>{const c=clock();let captures=0;const cancel=startCountdown({...c,onTick:()=>{},onComplete:()=>captures++});c.advance(3000);cancel();c.advance(5000);assert.equal(captures,0);const ticks=[];startCountdown({...c,onTick:n=>ticks.push(n),onComplete:()=>captures++});c.advance(5500);assert.deepEqual(ticks,[5,0]);assert.equal(captures,1);});
