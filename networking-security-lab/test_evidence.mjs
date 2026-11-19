import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeNetworkEvidence,mergeHttpPortAnswer,mergeHttp404Answer,mergeHttpLearningSummary} from './web/lesson-evidence.js';
const baseline={date:'2026-11-13',ip:'192.0.2.10',gateway:'192.0.2.1',interface:'en0',mask:'255.255.255.0',prefix:'24',network:'192.0.2.0',broadcast:'192.0.2.255',dns:'192.0.2.53'};
test('records reported observations as practicing, without inventing completion',()=>{
 const result=mergeNetworkEvidence(undefined,baseline);
 assert.equal(result.status,'Practicing');assert.match(result.evidence,/192\.0\.2\.10/);assert.match(result.evidence,/not yet been recorded/);
});
test('keeps notes, review dates, and higher progress; repeated load is idempotent',()=>{
 const old={status:'Completed',evidence:'My explanation',review:'2026-12-01',updated:'prior'};
 const result=mergeNetworkEvidence(old,baseline);
 assert.ok(result.evidence.startsWith('My explanation'));assert.equal(result.status,'Completed');assert.equal(result.review,old.review);
 assert.equal(mergeNetworkEvidence(result,baseline),result);
});
test('missing baseline leaves existing evidence unchanged',()=>{
 const old={evidence:'Existing'};assert.equal(mergeNetworkEvidence(old,null),old);
});

test('HTTP answer appends once, preserves notes and stage, checks only its success item',()=>{
 const old={status:'Completed',evidence:'My notes',review:'2026-12-01',tasks:[true,false,true,false,false,false,false]};
 const next=mergeHttpPortAnswer(old);
 assert.ok(next.evidence.startsWith('My notes'));assert.match(next.evidence,/8765, plus one/);
 assert.equal(next.status,'Completed');assert.equal(next.review,old.review);
 assert.deepEqual(next.tasks,[true,false,true,false,true,false,false]);
 assert.equal(mergeHttpPortAnswer(next),next);
});

test('404 evidence preserves previous answer and checks only its matching item',()=>{
 const old=mergeHttpPortAnswer(undefined);
 const next=mergeHttp404Answer(old);
 assert.ok(next.evidence.startsWith(old.evidence));
 assert.match(next.evidence,/404 Not Found/);
 assert.deepEqual(next.tasks,[false,false,false,false,true,true,false]);
 assert.equal(mergeHttp404Answer(next),next);
});

test('named lesson summary appends once without changing tasks or knowledge stage',()=>{
 const old={status:'Completed',evidence:'My own evidence',tasks:Array(7).fill(true),review:'2026-12-01'};
 const next=mergeHttpLearningSummary(old);
 assert.ok(next.evidence.startsWith(old.evidence));
 assert.match(next.evidence,/Lesson 02 — Follow a real HTTP connection/);
 assert.match(next.evidence,/CURL FLAGS/);
 assert.deepEqual(next.tasks,old.tasks);assert.equal(next.status,old.status);assert.equal(next.review,old.review);
 assert.equal(mergeHttpLearningSummary(next),next);
});
