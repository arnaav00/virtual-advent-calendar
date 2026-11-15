import test from 'node:test';
import assert from 'node:assert/strict';
import { skaterPose, LAP_SECONDS, santaPose, CROSSING_SECONDS, FLIGHT_SECONDS } from '../dist/motion.js';

test('Santa climbs and descends an arc, clearing the central roof and resetting offscreen',()=>{
  const start=santaPose(0),mid=santaPose(CROSSING_SECONDS/2),end=santaPose(CROSSING_SECONDS);
  assert.ok(start.x<-300 && end.x>1740);
  assert.ok(mid.y<start.y-100 && mid.y<end.y-100);
  assert.ok(start.rotation<0 && Math.abs(mid.rotation)<1e-9 && end.rotation>0);
  let previous=start;
  for(let t=.1;t<=CROSSING_SECONDS;t+=.1){
    const p=santaPose(t);
    assert.ok(p.x>previous.x);
    assert.ok(Math.hypot(p.x-previous.x,p.y-previous.y)<10,'smooth flight');
    if(p.x>=600 && p.x<=850)assert.ok(p.y+25<150,'clear of the central roof');
    previous=p;
  }
  assert.deepEqual(santaPose(FLIGHT_SECONDS-.01),end);
});

test('a complete lap stays on the pond with a grounded support blade',()=>{
  for(let t=0;t<=LAP_SECONDS;t+=1/60){
    const p=skaterPose(t);
    assert.ok(p.x>=540 && p.x<=930 && p.y>=803 && p.y<=853);
    assert.ok(p.scale>=.9-1e-9 && p.scale<=.98+1e-9, 'figure never squashes or mirrors');
    assert.ok(p.feet.some(foot=>Math.abs(foot.y)<1e-9), 'a support blade remains grounded');
    for(const foot of p.feet){
      assert.ok(foot.y>=-3 && foot.y<=0);
      assert.ok(foot.kneeY<foot.y-6 && foot.kneeY>-27+p.dip, 'knees stay between hip and blade');
      assert.ok(Number.isFinite(foot.x));
    }
  }
});

test('position, scale and stride join continuously at the loop seam',()=>{
  const start=skaterPose(0), end=skaterPose(LAP_SECONDS);
  for(const key of ['x','y','scale','lean','dip','scarf']) assert.ok(Math.abs(start[key]-end[key])<1e-8,key);
  for(let i=0;i<2;i++)for(const key of ['x','y','kneeX','kneeY'])assert.ok(Math.abs(start.feet[i][key]-end.feet[i][key])<1e-8,key);
  const before=skaterPose(LAP_SECONDS-.001),after=skaterPose(.001);
  assert.ok(Math.hypot(before.x-after.x,before.y-after.y)<.1);
});
