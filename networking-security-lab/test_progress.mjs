import test from 'node:test';
import assert from 'node:assert/strict';
import {labPercent,journalMilestones,summary} from './web/progress-model.js';
test('lab stages retain distinction between completion and independent demonstration',()=>{
 assert.equal(labPercent(),0);assert.equal(labPercent('Practicing'),33);assert.equal(labPercent('Completed'),67);assert.equal(labPercent('Demonstrated'),100);
});
test('comparison milestone requires two observations of the same profile',()=>{
 assert.deepEqual(journalMilestones({snapshots:[{profile:'Home'},{profile:'Work'}],incidents:[]}),[true,false,false]);
 assert.deepEqual(journalMilestones({snapshots:[{profile:'Home'},{profile:'Home'}],incidents:[{text:'Verified service restored'}]}),[true,true,true]);
});
test('overall score is zero when empty and full only when all milestones demonstrated',()=>{
 const labs=[{id:'a'},{id:'b'}],empty={snapshots:[],incidents:[]};
 assert.equal(summary(labs,{},empty).percent,0);
 const progress={a:{status:'Demonstrated'},b:{status:'Demonstrated'}};
 const journal={snapshots:[{profile:'Home'},{profile:'Home'}],incidents:[{text:'Evidence'}]};
 assert.equal(summary(labs,progress,journal).percent,100);
 assert.equal(summary(labs,progress,journal).nextLab,undefined);
 assert.equal(summary(labs,{a:{status:'Completed'}},empty).nextLab.id,'b');
});
