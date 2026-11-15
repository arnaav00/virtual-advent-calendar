import test from 'node:test';
import assert from 'node:assert/strict';
import { skaterPose, LAP_SECONDS } from '../dist/motion.js';

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
