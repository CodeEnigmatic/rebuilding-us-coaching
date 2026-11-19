import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeTasks,taskSummary,pathSummary} from './web/checklist.js';
const lab={id:'a',steps:[1,2,3,4],checks:[1,2,3]};
test('older records migrate to eight unchecked tasks without inferring completion',()=>{
 assert.deepEqual(normalizeTasks(undefined,lab),Array(8).fill(false));
 assert.equal(taskSummary(lab,{status:'Completed'}).done,0);
});
test('checking and unchecking updates counts and percent',()=>{
 const record={tasks:[true,true,true,true,false,false,false,false]};
 assert.deepEqual(taskSummary(lab,record),{tasks:record.tasks,done:4,total:8,percent:50});
 record.tasks[0]=false;assert.equal(taskSummary(lab,record).done,3);
});
test('malformed imported checklists are rejected',()=>{
 for(const value of [[],[true],'all',Array(8).fill(1)])assert.throws(()=>normalizeTasks(value,lab));
});
test('path total includes unsaved labs and round-tripped task flags',()=>{
 const other={id:'b',steps:[1],checks:[1]};
 const progress=JSON.parse(JSON.stringify({a:{tasks:Array(8).fill(true)}}));
 assert.deepEqual(pathSummary([lab,other],progress),{done:8,total:11});
});
