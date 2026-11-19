export const scenarios=[
 {id:'dns',title:'Wi-Fi connected, websites fail',topic:'DNS',brief:'Staff Wi-Fi associates successfully, but websites do not open. Find the failing layer.',fault:{dns:'192.0.2.53'}},
 {id:'dhcp',title:'A new laptop cannot get online',topic:'DHCP',brief:'A new staff laptop associates with Wi-Fi but cannot get a usable lease. Inspect the DHCP pool.',fault:{pool:false}},
 {id:'gateway',title:'Local server works, Internet fails',topic:'Routing',brief:'The staff client can reach the local server but cannot reach an external address.',fault:{gateway:'192.168.10.254'}},
 {id:'vlan',title:'The access point is on the wrong VLAN',topic:'Switching',brief:'Staff Wi-Fi clients are placed into the guest VLAN. Inspect the switch access port.',fault:{vlan:'20'}},
 {id:'guest',title:'Guests can reach the staff server',topic:'Segmentation',brief:'Internet access works for guests, but a guest can also connect to the staff server. Enforce the guest boundary.',fault:{isolate:false}},
 {id:'wifi',title:'The wireless link is unreliable',topic:'Wi-Fi',brief:'Measurements report signal -52 dBm, low noise, and heavy neighboring traffic on channel 6. Test a less congested channel.',fault:{channel:'6'}}
];
export const defaults=()=>({dns:'192.168.10.1',gateway:'192.168.10.1',pool:true,vlan:'10',isolate:true,channel:'1'});
export function initial(id){return {...defaults(),...scenarios.find(s=>s.id===id)?.fault};}
export function inspect(c){const leased=c.pool&&c.vlan==='10';return {ip:c.vlan==='20'?'192.168.20.100':leased?'192.168.10.100':'169.254.10.100',gateway:c.gateway,dns:c.dns,vlan:c.vlan,lease:c.vlan==='20'?'Guest DHCP lease':leased?'Staff lease active':'No offer: staff pool exhausted',signal:'-52 dBm (modeled)',channel:c.channel};}
export function probe(c,type){
 const hasLease=c.vlan==='20'||c.pool;
 const staff=c.vlan==='10';
 const link=c.channel!=='6';
 if(type==='guest')return {ok:c.isolate,text:c.isolate?'PASS: Guest → staff server blocked; guest → Internet allowed.':'FAIL: Guest → staff server allowed. Segmentation requirement violated.'};
 if(!link)return {ok:false,text:'FAIL: Modeled packet loss on congested channel 6. Signal is strong; contention is the indicated problem.'};
 if(!hasLease)return {ok:false,text:'FAIL: Client has a link-local address; DHCP supplied no lease. Inspect the address pool.'};
 if(type==='server')return {ok:staff,text:staff?'PASS: Staff server 192.168.10.20 responds on the local subnet.':'FAIL: Client is on guest VLAN 20; access to staff server is blocked.'};
 if(!staff)return {ok:false,text:'FAIL: This staff-client test expects VLAN 10; current lease belongs to guest VLAN 20.'};
 if(c.gateway!=='192.168.10.1')return {ok:false,text:'FAIL: Configured default gateway does not answer. Local subnet traffic may still work.'};
 if(type==='internet')return {ok:true,text:'PASS: Connection to modeled external HTTPS service 198.51.100.10 succeeds. No DNS lookup used.'};
 if(c.dns!=='192.168.10.1')return {ok:false,text:'FAIL: DNS resolver does not answer. External IP connectivity may still work.'};
 return {ok:true,text:'PASS: example.test resolves to modeled 198.51.100.10; HTTPS request returns 200.'};
}
export function verified(c){return ['server','internet','web','guest'].every(type=>probe(c,type).ok);}
