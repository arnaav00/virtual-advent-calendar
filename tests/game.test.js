import test from 'node:test';
import assert from 'node:assert/strict';
import {CHIMNEYS,createRound,advanceRound,catOffset,hitCat,snowballDuration,snowballPose} from '../dist/game-model.js';

test('one-second spawns never exceed two cats or share a chimney, and cycle all three colors',()=>{
  const round=createRound();let seed=31;const random=()=>((seed=seed*16807%2147483647)-1)/2147483646;
  const births=[],colors=[];let lastId=-1;
  for(let tick=0;tick<60*60;tick++){
    const time=tick/60;advanceRound(round,time,random);
    assert.ok(round.cats.length<=2);
    assert.equal(new Set(round.cats.map(cat=>cat.chimney)).size,round.cats.length);
    for(const cat of round.cats)if(cat.id>lastId){births.push(cat.born);colors.push(cat.color);lastId=cat.id;}
  }
  for(let i=1;i<births.length;i++)assert.ok(births[i]-births[i-1]>=1 && births[i]-births[i-1]<1.02);
  for(let i=0;i+2<colors.length;i+=3)assert.equal(new Set(colors.slice(i,i+3)).size,3);
});
test('cats hold for 1.5 seconds and reject hidden or already-hit targets',()=>{
  const round=createRound();advanceRound(round,0,()=>0);
  const cat=round.cats[0],base=CHIMNEYS[cat.chimney];
  assert.equal(catOffset(.2),0);assert.equal(catOffset(1.7),0);assert.equal(catOffset(1.9),82);
  assert.equal(hitCat(round,0,base.x,base.y-29),undefined);
  assert.equal(hitCat(round,.5,base.x,base.y-29),cat);
  assert.equal(hitCat(round,.5,base.x,base.y-67),cat,'the visible Santa cap is part of the target');
  assert.equal(hitCat(round,.5,base.x,base.y+8),undefined);
  assert.equal(hitCat(round,.5,base.x+40,base.y-29),undefined);
  cat.hitAt=.5;assert.equal(hitCat(round,.6,base.x,base.y-29),undefined);
  advanceRound(round,1,()=>.5);assert.ok(!round.cats.includes(cat));
});
test('moderate aiming allows normal reactions, but misses shots taken after the cat starts leaving',()=>{
  for(const chimney of CHIMNEYS){
    const travel=snowballDuration(Math.hypot(chimney.x-720,918-(chimney.y-29)));
    assert.ok(travel>.32 && travel<.4);
    const round=createRound();round.cats=[{id:0,chimney:CHIMNEYS.indexOf(chimney),born:0,hitAt:null}];
    // 450ms to aim after the cat is fully up, followed by physical ball travel.
    assert.ok(hitCat(round,.2+.45+travel,chimney.x,chimney.y-29));
    assert.ok(hitCat(round,.2+.95+travel,chimney.x,chimney.y-29));
    assert.equal(hitCat(round,.2+1.5+travel,chimney.x,chimney.y-29),undefined);
  }
});
test('snowballs launch at the bottom center and end precisely at the clicked point',()=>{
  const from={x:720,y:918},to={x:229,y:277};
  assert.deepEqual(snowballPose(from,to,0),{...from,r:17});
  const end=snowballPose(from,to,1);assert.ok(Math.abs(end.x-to.x)<1e-9&&Math.abs(end.y-to.y)<1e-9);
  const middle=snowballPose(from,to,.5);assert.ok(middle.y<(from.y+to.y)/2);
});
