import test from 'node:test';
import assert from 'node:assert/strict';
import {empty,validate,changes,snapshot} from './web/journal-model.js';
const baseline={...snapshot({profile:'Example',date:'2026-11-14',ip:'192.0.2.10',dns:'192.0.2.53'}),id:'one'};
test('backup round-trip preserves configuration and incident evidence',()=>{
 const data={...empty(),snapshots:[baseline],incidents:[{id:'case',profile:'Example',date:'2026-11-14',text:'Observed 503; healthy route still responded.'}]};
 assert.deepEqual(validate(JSON.parse(JSON.stringify(data))),data);
});
test('comparison reports changed DNS and IP, excludes date and notes',()=>{
 const next={...baseline,date:'2026-11-15',notes:'Retested',ip:'192.0.2.11',dns:'192.0.2.54'};
 assert.deepEqual(changes(baseline,next).map(r=>r.key),['ip','dns']);
 assert.deepEqual(changes(baseline,{...baseline,notes:'New evidence'}),[]);
});
test('malformed backup and missing fields are rejected',()=>{
 for(const value of [{}, {...empty(),version:2}, {...empty(),snapshots:[{id:'bad'}]}, {...empty(),incidents:[{id:'x',profile:'x',date:'no',text:'x'}]}]) assert.throws(()=>validate(value));
});
test('excessive records and field sizes are rejected',()=>{
 assert.throws(()=>validate({...empty(),snapshots:Array(501).fill(baseline)}));
 assert.throws(()=>validate({...empty(),snapshots:[{...baseline,notes:'x'.repeat(50001)}]}));
});
test('unknown backup properties are discarded',()=>{
 const result=validate({...empty(),extra:'not restored',snapshots:[{...baseline,extra:'not restored'}]});
 assert.equal(result.extra,undefined);assert.equal(result.snapshots[0].extra,undefined);
});
