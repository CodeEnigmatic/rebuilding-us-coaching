import {cleanWorksheet,worksheetHtml,segmentWorksheetHtml} from './subnet-worksheet.js';
import {windowsLabs} from './windows-labs.js';
import {normalizeTasks,taskSummary,pathSummary} from './checklist.js';
import {mergeNetworkEvidence,mergeHttpPortAnswer,mergeHttp404Answer,mergeHttpLearningSummary} from './lesson-evidence.js';
import {meter} from './progress-model.js';
const labs = [
 {id:'map',title:'Map your laptop’s network',track:'Network',time:25,tags:['N10-009 · Operations','N10-009 · Troubleshooting'],intro:'Build a baseline you can use when a connection fails. Distinguish a physical interface, a loopback interface, a gateway, and a DNS resolver.',scope:'Read-only inspection of your Mac. VPNs can change routes and resolver order; record what you actually see.',steps:[['Identify interfaces','networksetup -listallhardwareports','Match a hardware port to its device name. Do not assume Wi-Fi is en0.'],['Inspect addressing','ifconfig','Locate the active interface, its IPv4 address and netmask; find lo0 and 127.0.0.1.'],['Find the default route','route -n get default','Record the gateway and interface. An offline Mac may have no default route.'],['Inspect resolver configuration','scutil --dns','Record a resolver and its scope. Multiple resolver blocks can be normal.']],checks:['Draw: your Mac → gateway → Internet, with DNS shown as a separate service.','Explain why 127.0.0.1 reaches your laptop instead of your Wi-Fi router.','Record which results would change after joining another network.'],question:'A website fails but the local practice target works. What has that result ruled out, and what would you check next?'},
 {id:'http',title:'Follow a real HTTP connection',track:'Network',time:20,tags:['N10-009 · Concepts','N10-009 · Troubleshooting'],intro:'Connect a real client to a real listening socket. Read the TCP connection and HTTP response as different layers of evidence.',scope:'The target is included with this dashboard. Run commands in a second Terminal window while serve.py stays running.',steps:[['Find the listening process','lsof -nP -iTCP:8766 -sTCP:LISTEN','Find Python and the bound address. 127.0.0.1 is a loopback binding.'],['Inspect a successful request','curl -v --max-time 5 http://127.0.0.1:8766/health','Find the connected port, GET request, HTTP 200 response, and JSON body.'],['Request a missing resource','curl -i --max-time 5 http://127.0.0.1:8766/not-found','Compare HTTP 404 with a connection failure. A 404 is still an HTTP response.']],checks:['Identify the client, server, destination IP, destination port and application protocol.','Explain why this HTTP service uses port 8766 instead of default port 80.','Show evidence that a 404 does not mean the TCP connection failed.'],question:'If lsof shows a listener but curl gets a 404, which layer should you investigate first and why?'},
 {id:'dns',title:'Separate DNS from connectivity',track:'Network',time:20,tags:['N10-009 · Concepts','N10-009 · Troubleshooting'],intro:'Compare the resolver configuration with a real lookup. Then use a reserved, nonresolving name as a controlled failure.',scope:'Requires an Internet connection for example.com. DNS answers can vary by network and time; do not expect a fixed IP address.',steps:[['Ask for an IPv4 answer','dig example.com A','Read the status, answer records, query time and server. dig queries DNS directly; apps may use scoped macOS resolution.'],['Create a DNS failure','dig fieldwork.invalid A','The .invalid suffix is reserved for invalid names. Expect NXDOMAIN from a normally functioning resolver.'],['Compare with local connectivity','curl -i --max-time 5 http://127.0.0.1:8766/health','This literal IP request does not require DNS.']],checks:['Distinguish NXDOMAIN from a DNS timeout.','Explain what the TTL describes.','Document why a working loopback request does not prove Internet connectivity.'],question:'What evidence would distinguish a nonexistent hostname from an unreachable DNS server?'},
 {id:'subnet',title:'Plan a small IPv4 network',track:'Network',time:30,tags:['N10-009 · Concepts','N10-009 · Implementation'],intro:'Make an address plan before configuring devices. Use Python’s standard library to check your handwritten subnet calculations.',scope:'This is address planning and calculation, not a configured router or VLAN. No network settings are changed.',steps:[['Calculate by hand',null,'For 192.168.50.64/27, write the mask, network address, broadcast, usable range and usable host count before the next step.'],['Check your calculation',`python3 -c 'import ipaddress; n=ipaddress.ip_network("192.168.50.64/27"); print("mask:",n.netmask,"network:",n.network_address,"broadcast:",n.broadcast_address,"first:",n.network_address+1,"last:",n.broadcast_address-1,"usable:",n.num_addresses-2)'`,'For this /27, expect mask 255.255.255.224, hosts .65–.94 and 30 usable addresses.'],['Design two segments',null,'Split 192.168.50.0/24 into two /25 networks. Choose a gateway, a static-device range and a DHCP range for each; avoid overlap.']],checks:['Show the binary or block-size method behind your /27 result.','Identify why a broadcast address is unsuitable as a normal host address.','Explain why two IP subnets alone do not establish enforced security isolation.'],question:'Two devices have addresses 192.168.50.70/27 and 192.168.50.100/27. Are they on the same subnet? What is needed to communicate across these subnets?'},
 {id:'auth',title:'Test an access control',track:'Security',time:25,tags:['SY0-701 · General concepts','SY0-701 · Security operations'],intro:'Exercise a bearer-token check and compare the evidence for a denied request and an accepted request.',scope:'The fixed token below is public training data. This local HTTP example demonstrates an access check; it is not a production identity system or encrypted transport.',steps:[['Request without credentials','curl -i --max-time 5 http://127.0.0.1:8766/protected','Record status 401 and the WWW-Authenticate response header.'],['Try an incorrect credential',`curl -i --max-time 5 -H 'Authorization: Bearer incorrect' http://127.0.0.1:8766/protected`,'Record the denied response.'],['Send the lab credential',`curl -i --max-time 5 -H 'Authorization: Bearer lab-student' http://127.0.0.1:8766/protected`,'Compare the 200 response with the earlier denials.']],checks:['Save evidence of 401 and 200 responses.','Explain why possession of a static bearer token does not establish a human identity.','Propose expiration, per-user identity, authorization scopes and TLS as improvements.'],question:'If a bearer token is copied from an unencrypted connection, what could another client do with it?'},
 {id:'logs',title:'Investigate an access timeline',track:'Security',time:30,tags:['SY0-701 · Security operations','N10-009 · Operations'],intro:'Generate your own events, collect the service logs, and write a short incident note based on observable evidence.',scope:'The service keeps the most recent 200 requests in memory. Restarting serve.py clears them. The /logs response lists events before the log request itself.',steps:[['Generate denied activity',`curl -s --max-time 5 -H 'Authorization: Bearer wrong' http://127.0.0.1:8766/protected\ncurl -s --max-time 5 http://127.0.0.1:8766/protected`,'Run both commands and note the time.'],['Generate an accepted request',`curl -s --max-time 5 -H 'Authorization: Bearer lab-student' http://127.0.0.1:8766/protected`,'The event records the outcome without storing the credential.'],['Collect logs','curl -s --max-time 5 http://127.0.0.1:8766/logs','Find the two denials and the success; timestamps use UTC.']],checks:['Write a timeline with timestamp, route, outcome and client address.','Separate observed facts from your hypothesis.','Explain why repeated 401s do not by themselves prove an attack.'],question:'All clients appear as 127.0.0.1 in this lab. What additional evidence would a real investigation need to attribute activity to a person?'},
 {id:'integrity',title:'Detect a file change',track:'Security',time:20,tags:['SY0-701 · General concepts','SY0-701 · Security operations'],intro:'Create a tiny training artifact, hash it, alter it, and compare hashes to distinguish integrity from confidentiality.',scope:'Run inside the networking-security-lab folder. These commands create only fieldwork-artifact.txt; do not substitute an important file.',steps:[['Create and hash a baseline',`printf 'training baseline\\n' > fieldwork-artifact.txt\nshasum -a 256 fieldwork-artifact.txt`,'Copy the baseline hash into your evidence before proceeding.'],['Modify the artifact',`printf 'training change\\n' >> fieldwork-artifact.txt\nshasum -a 256 fieldwork-artifact.txt`,'Compare the new hash with the baseline.'],['Inspect the actual content','cat fieldwork-artifact.txt','The file remains readable; hashing did not encrypt it. Keep this small artifact as evidence.']],checks:['Save both hashes and explain why they differ.','Describe why a hash alone cannot identify who changed a file.','Explain why a trusted baseline must be protected from replacement.'],question:'If an attacker changes both a file and its stored reference hash, can a simple hash comparison establish trust?'},
 {id:'triage',title:'Triage a service incident',track:'Network',time:35,tags:['N10-009 · Troubleshooting','SY0-701 · Security operations'],intro:'Use a repeatable troubleshooting method: establish scope, form a hypothesis, gather evidence, and document your conclusion.',scope:'The /incident route deliberately returns 503. There is no repair toggle: your task is to isolate the failure and write a justified escalation.',steps:[['Observe the reported failure','curl -i --max-time 5 http://127.0.0.1:8766/incident','Record the HTTP status and body before deciding on a cause.'],['Compare a known-good route','curl -i --max-time 5 http://127.0.0.1:8766/health','Check whether the same IP and port still serve other requests.'],['Verify the listener and timeline','lsof -nP -iTCP:8766 -sTCP:LISTEN\ncurl -s --max-time 5 http://127.0.0.1:8766/logs','Combine the listener evidence with both HTTP outcomes.']],checks:['Explain which evidence supports an application-route issue rather than a missing listener.','Write a ticket: symptom, scope, tests, observations, hypothesis and next owner.','Repeat your diagnosis without reading these steps before marking Demonstrated.'],question:'Why would changing DNS or disabling a firewall be unsupported fixes for these observations?'}
];
labs.push(...windowsLabs);
const difficultyLevels={
 beginner:{label:'Newbie / Beginner',className:'difficulty-beginner'},
 intermediate:{label:'Intermediate / Novice',className:'difficulty-intermediate'},
 expert:{label:'Professional / Expert',className:'difficulty-expert'}
};
const intermediateLessons=new Set(['subnet','logs','triage','desk-ssh','desk-users','desk-triage','desk-ticket']);
function difficultyBadge(lab){
 const level=difficultyLevels[intermediateLessons.has(lab.id)?'intermediate':'beginner'];
 return '<span class="difficulty '+level.className+'" title="Lesson difficulty, not a qualification or assessment of your skill">'+level.label+'</span>';
}
const KEY = 'fieldwork-progress-v1';
let progress = {}, selected = labs[0].id, filter = 'All';
const $ = s => document.querySelector(s);
const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
function notice(message){$('#notice').textContent=message;$('#notice').style.display='block';clearTimeout(notice.timer);notice.timer=setTimeout(()=>$('#notice').style.display='none',5000);}
function validate(data){
 if(!data || data.version!==1 || !data.progress || typeof data.progress!=='object' || Array.isArray(data.progress)) throw Error('Use a Fieldwork version 1 progress export.');
 const clean={};
 for(const lab of labs){const p=data.progress[lab.id];if(!p)continue;
 if(typeof p!=='object'||!['Not started','Practicing','Completed','Demonstrated'].includes(p.status)||typeof p.evidence!=='string'||p.evidence.length>50000||typeof p.review!=='string'||(p.review!==''&&!/^\d{4}-\d{2}-\d{2}$/.test(p.review)))throw Error('Progress contains an invalid lab record.');
 clean[lab.id]={worksheet:cleanWorksheet(p.worksheet),tasks:normalizeTasks(p.tasks,lab),status:p.status,evidence:p.evidence,review:p.review,updated:typeof p.updated==='string'?p.updated:''};
 }return clean;
}
try{const saved=localStorage.getItem(KEY);if(saved)progress=validate(JSON.parse(saved));}catch{notice('Saved progress could not be loaded. Import a backup or save a new record.');}
// Bring the reported learning-session observations into this lesson once.
// Preserve existing notes, review dates and higher self-assessed stages.
try{
 const response=await fetch('/local-baseline.json',{cache:'no-store'});
 if(response.ok){
  const baseline=await response.json();
  const record=mergeNetworkEvidence(progress.map,baseline);
  if(record&&record!==progress.map){
   const next={...progress,map:record};
   localStorage.setItem(KEY,JSON.stringify({version:1,progress:next}));
   progress=next;
  }
 }
}catch{notice('Session evidence could not be saved. Existing lesson notes are unchanged.');}
try{
 const record=mergeHttpLearningSummary(mergeHttp404Answer(mergeHttpPortAnswer(progress.http)));
 if(record!==progress.http){
  const next={...progress,http:record};
  localStorage.setItem(KEY,JSON.stringify({version:1,progress:next}));progress=next;
 }
}catch{notice('The HTTP answer could not be saved. Existing notes are unchanged.');}
function stats(){
 window.dispatchEvent(new Event("project-progress-updated"));
 $('#completed').textContent=`${labs.filter(l=>['Completed','Demonstrated'].includes(progress[l.id]?.status)).length} / ${labs.length}`;
 $('#evidence-count').textContent=Object.values(progress).filter(p=>p.evidence.trim()).length;
 $('#review-count').textContent=Object.values(progress).filter(p=>p.review&&p.review<=today()).length;
}
function checklistMeters(){
 const row=taskSummary(labs.find(l=>l.id===selected),progress[selected]);
 const bar=$('#detail .project-progress');
 if(bar)bar.innerHTML=meter(row.percent,'Selected lab task completion')+`<span>${esc(progress[selected]?.status||'Not started')} · ${row.percent}% tasks complete</span>`;
 const container=$('#lesson-checklist-progress');
 if(container)container.innerHTML=meter(row.percent,'Lesson task checklist progress')+`<span>${row.done} / ${row.total} tasks checked · ${row.percent}%</span>`;
 const path=pathSummary(labs,progress),percent=Math.round(path.done/path.total*100);
 $('#path-checklist-progress').innerHTML=meter(percent,'Learning path task checklist progress')+`<small>${path.done} / ${path.total} tasks checked · ${percent}%</small>`;
}
function nav(){
 $('#labs').innerHTML=labs.filter(l=>filter==='All'||l.track===filter|| (filter==='Security'&&l.tags.some(t=>t.startsWith('SY0')))).map(l=>`<button class="lab ${selected===l.id?'selected':''}" data-lab="${l.id}" ${selected===l.id?'aria-current="step"':''}><span class="number" aria-label="${taskSummary(l,progress[l.id]).done===taskSummary(l,progress[l.id]).total?'Checklist complete':'Checklist incomplete'}">${taskSummary(l,progress[l.id]).done===taskSummary(l,progress[l.id]).total?'✓':'○'} ${String(labs.indexOf(l)+1).padStart(2,'0')}</span><span>${esc(l.title)}${difficultyBadge(l)}<small>${l.time} min · ${esc(progress[l.id]?.status||'Not started')} · ${taskSummary(l,progress[l.id]).percent}% tasks complete</small>${meter(taskSummary(l,progress[l.id]).percent,'Lab task completion')}<small>${taskSummary(l,progress[l.id]).done}/${taskSummary(l,progress[l.id]).total} tasks checked</small></span></button>`).join('');
 document.querySelectorAll('[data-lab]').forEach(b=>b.onclick=()=>{if(!save(false))return;selected=b.dataset.lab;render();});
 checklistMeters();stats();
}
function save(show=true){
 const lab=labs.find(l=>l.id===selected);
 if(!$('#evidence'))return true;
 const evidence=$('#evidence').value,status=$('#status').value,review=$('#review').value;
 const tasks=[...document.querySelectorAll('[data-task]')].map(b=>b.checked);
 if(['Completed','Demonstrated'].includes(status)&&!evidence.trim()){notice('Add your observations and success-check evidence before marking this lab complete.');return false;}
 const old=progress[lab.id];
 if(!old&&status==='Not started'&&!evidence&&!review&&!tasks.some(Boolean))return true;
 const next={...progress,[lab.id]:{...old,tasks,status,evidence,review,updated:new Date().toISOString()}};
 try{localStorage.setItem(KEY,JSON.stringify({version:1,progress:next}));progress=next;}catch{notice('Browser storage is unavailable or full. Keep your notes and export a backup.');return false;}
 nav();if(show)notice('Progress saved on this browser.');return true;
}
function render(){
 const l=labs.find(l=>l.id===selected),p=progress[l.id]||{};
 $('#detail').innerHTML=`<p class="eyebrow">LAB ${String(labs.indexOf(l)+1).padStart(2,'0')} / ${l.time} MINUTES</p><div class="lesson-heading"><h2>${esc(l.title)}</h2>${difficultyBadge(l)}</div><div class="project-progress">${meter(taskSummary(l,p).percent,"Selected lab task completion")}<span>${esc(p.status||"Not started")} · ${taskSummary(l,p).percent}% tasks complete</span></div><p class="description">${esc(l.intro)}</p><div class="tags">${l.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="callout">${esc(l.scope)}</div><h3>Lesson checklist</h3><div class="project-progress" id="lesson-checklist-progress"></div><p class="save-note">Check tasks as you do them. Checkboxes save immediately; knowledge level remains your separate self-assessment.</p><h3>Run the experiment</h3><ol class="steps">${l.steps.map(([title,cmd,note],i)=>`<li><label class="task-label"><input type="checkbox" data-task="${i}" ${normalizeTasks(p.tasks,l)[i]?'checked':''}><strong>${esc(title)}</strong></label>${cmd?`<div class="command"><code>${esc(cmd)}</code><button data-copy="${i}" aria-label="Copy command for ${esc(title)}">Copy</button></div>`:''}<p>${esc(note)}</p>${l.id==='subnet'&&i===0?worksheetHtml(p.worksheet,esc):''}${l.id==='subnet'&&i===2?segmentWorksheetHtml(p.worksheet,esc):''}</li>`).join('')}</ol><h3>Success checks</h3><ul class="verify">${l.checks.map((c,i)=>`<li><label class="task-label"><input type="checkbox" data-task="${l.steps.length+i}" ${normalizeTasks(p.tasks,l)[l.steps.length+i]?'checked':''}>${esc(c)}</label></li>`).join('')}</ul><div class="reflection"><h3>Explain it without notes</h3><p class="verify">${esc(l.question)}</p><label class="task-label"><input type="checkbox" data-task="${l.steps.length+l.checks.length}" ${normalizeTasks(p.tasks,l).at(-1)?'checked':''}>I answered this question in my evidence notes.</label><label class="field" for="evidence">Your evidence & explanation</label><textarea id="evidence" maxlength="50000" placeholder="Commands used and observed results:\nSuccess checks:\nWhat failed and how I investigated:\nMy answer to the question above:">${esc(p.evidence||'')}</textarea><div class="controls"><div><label class="field" for="status">Self-assessed progress</label><select id="status">${['Not started','Practicing','Completed','Demonstrated'].map(s=>`<option ${p.status===s?'selected':''}>${s}</option>`).join('')}</select></div><div><label class="field" for="review">Next review</label><input id="review" type="date" value="${esc(p.review||'')}"></div></div><p class="save-note">Completed = met the checks. Demonstrated = repeated independently and explained the result. Neither is an exam-readiness score.</p><button class="primary" id="save">Save lab record</button><span class="save-note">Notes save when you switch labs or export.</span></div>`;
 $('#save').onclick=()=>save();
 document.querySelectorAll('[data-subnet]').forEach(input=>input.oninput=()=>{
  const old=progress[selected]||{status:'Not started',evidence:'',review:''};
  const worksheet=Object.fromEntries([...document.querySelectorAll('[data-subnet]')].map(field=>[field.dataset.subnet,field.value]));
  const next={...progress,[selected]:{...old,worksheet,updated:new Date().toISOString()}};
  try{localStorage.setItem(KEY,JSON.stringify({version:1,progress:next}));progress=next;$('#subnet-save-status').textContent='Worksheet saved in this browser. Included in Export progress.';}
  catch{$('#subnet-save-status').textContent='Could not save. Copy your worksheet answers before leaving this page.';}
 });

 document.querySelectorAll('[data-task]').forEach(box=>box.onchange=()=>{
  // Save only task flags; unsaved evidence and status edits remain in the form.
  const lab=labs.find(l=>l.id===selected),old=progress[selected]||{status:'Not started',evidence:'',review:''};
  const next={...progress,[selected]:{...old,tasks:[...document.querySelectorAll('[data-task]')].map(b=>b.checked),updated:new Date().toISOString()}};
  try{localStorage.setItem(KEY,JSON.stringify({version:1,progress:next}));progress=next;nav();}
  catch{box.checked=!box.checked;notice('Checklist could not be saved. Browser storage is unavailable or full.');}
 });
 document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(l.steps[Number(b.dataset.copy)][1]);notice('Command copied. Run it in Terminal.');}catch{notice('Clipboard unavailable. Select the command text and copy it.');}});
 nav();
}
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{if(!save(false))return;filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));nav();});
$('#export').onclick=()=>{if(!save(false))return;const blob=new Blob([JSON.stringify({version:1,exported:new Date().toISOString(),progress},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`fieldwork-progress-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('#import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error('Import must be smaller than 1 MB.');const incoming=validate(JSON.parse(await file.text()));if(!confirm('Merge this backup? Imported records replace matching labs; other labs stay unchanged.'))return;const next={...progress,...incoming};localStorage.setItem(KEY,JSON.stringify({version:1,progress:next}));progress=next;render();notice('Progress imported.');}catch(error){notice(error.message);}finally{e.target.value='';}};
window.addEventListener('beforeunload',event=>{const p=progress[selected]||{};if($('#evidence')&&($('#evidence').value!==(p.evidence||'')||$('#status').value!==(p.status||'Not started')||$('#review').value!==(p.review||''))){event.preventDefault();event.returnValue='';}});
render();

window.addEventListener('open-project-lab',event=>{
 if(!labs.some(l=>l.id===event.detail)||!save(false))return;
 selected=event.detail;filter='All';
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='All'));
 render();$('#detail').scrollIntoView({behavior:'smooth',block:'start'});
});
export {labs};
