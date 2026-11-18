import test from 'node:test';
import assert from 'node:assert/strict';
import {adventDay,defrostStage,iceShape,isDayAvailable} from '../dist/advent-time.js';
test('the advent day changes at 06:00 IST, including the first and final day',()=>{
  assert.equal(adventDay(Date.parse('2026-12-01T05:59:59.999+05:30')),0);
  assert.equal(adventDay(Date.parse('2026-12-01T06:00:00+05:30')),1);
  assert.equal(adventDay(Date.parse('2026-12-02T05:59:59+05:30')),1);
  assert.equal(adventDay(Date.parse('2026-12-02T06:00:00+05:30')),2);
  assert.equal(adventDay(Date.parse('2026-12-25T05:59:59+05:30')),24);
  assert.equal(adventDay(Date.parse('2026-12-25T06:00:00+05:30')),25);
  assert.equal(adventDay(Date.parse('2027-01-01T00:00:00Z')),25);
});
test('preview advances each second and remains free at stage 25, without using the date',()=>{
  for(let day=0;day<=25;day++)assert.equal(defrostStage(day*1000,0),day);
  assert.equal(defrostStage(24999,0),24);assert.equal(defrostStage(60000,0),25);
  assert.equal(defrostStage(99999,Date.parse('2026-12-10T06:00:00+05:30'),{mode:'calendar',year:2026}),10);
});
test('preview leaves every door clickable while calendar mode opens one at 06:00 IST',()=>{
  assert.equal(isDayAvailable(25,Date.parse('2026-11-17T12:00:00+05:30'),{mode:'preview',year:2026}),true);
  const calendar={mode:'calendar',year:2026};
  assert.equal(isDayAvailable(1,Date.parse('2026-12-01T05:59:59+05:30'),calendar),false);
  assert.equal(isDayAvailable(1,Date.parse('2026-12-01T06:00:00+05:30'),calendar),true);
  assert.equal(isDayAvailable(2,Date.parse('2026-12-01T06:00:00+05:30'),calendar),false);
  assert.equal(isDayAvailable(2,Date.parse('2026-12-02T06:00:00+05:30'),calendar),true);
});
test('the ice recedes continuously downward and inward through all 25 stages',()=>{
  let previous=iceShape(0);
  for(let day=1;day<=25;day++){
    const shape=iceShape(day/25);
    assert.ok(shape.top>previous.top && shape.half<previous.half && shape.depth<previous.depth);
    assert.ok(!shape.d.includes('NaN'));previous=shape;
  }
  assert.equal(Math.abs(previous.top),0);assert.equal(previous.depth,0);
});
