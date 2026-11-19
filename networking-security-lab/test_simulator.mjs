import test from 'node:test';
import assert from 'node:assert/strict';
import {scenarios,initial,defaults,inspect,probe,verified} from './web/simulator-model.js';
test('each scenario starts with a genuine modeled failure and can be repaired',()=>{for(const s of scenarios){assert.equal(verified(initial(s.id)),false,s.id);assert.equal(verified(defaults()),true);}});
test('DNS failure preserves IP and local server connectivity',()=>{const c=initial('dns');assert.equal(probe(c,'internet').ok,true);assert.equal(probe(c,'server').ok,true);assert.equal(probe(c,'web').ok,false);});
test('DHCP exhaustion produces link-local address',()=>{assert.match(inspect(initial('dhcp')).ip,/^169\.254\./);assert.equal(probe(initial('dhcp'),'internet').ok,false);});
test('wrong gateway does not break same-subnet traffic',()=>{assert.equal(probe(initial('gateway'),'server').ok,true);assert.equal(probe(initial('gateway'),'internet').ok,false);});
test('segmentation regression is detected despite working staff website',()=>{assert.equal(probe(initial('guest'),'web').ok,true);assert.equal(probe(initial('guest'),'guest').ok,false);});
test('wrong VLAN and Wi-Fi contention have distinct observations',()=>{assert.equal(inspect(initial('vlan')).vlan,'20');assert.equal(probe(initial('vlan'),'server').ok,false);assert.match(probe(initial('wifi'),'web').text,/contention/);});
