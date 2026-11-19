export function mergeNetworkEvidence(existing,baseline){
 if(!baseline||typeof baseline.ip!=='string'||typeof baseline.gateway!=='string')return existing;
 const marker=`[Recorded network learning session: ${baseline.date}]`;
 if(existing?.evidence?.includes(marker))return existing;
 const note=[marker,'Source: observations shared in the learning conversation; not a live scan.',
 '1. Identify interfaces — command reviewed: networksetup -listallhardwareports.',
 `Active interface recorded: ${baseline.interface}. The Hardware Port → Device output is not included in the saved evidence; confirm the hardware-port mapping.`,
 '2. Inspect addressing — observed ifconfig output:',
 `IPv4: ${baseline.ip}; mask: ${baseline.mask} (/${baseline.prefix}); broadcast: ${baseline.broadcast}; network: ${baseline.network}/${baseline.prefix}.`,
 'Original mask was reported as 0xffffff00. Loopback lo0 / 127.0.0.1 output has not yet been recorded.',
 '3. Find the default route — observed route -n get default output:',
 `Gateway: ${baseline.gateway}; interface: ${baseline.interface}.`,
 '4. Inspect resolver configuration — observed scutil --dns output:',
 `DNS servers:\n${baseline.dns}`,
 'Resolver #1; if_index 11 (en0); Request A records, Request AAAA records; Reachable.',
 'Remaining success checks: draw the topology with DNS as a separate service; explain loopback; explain changes across networks; answer the troubleshooting question without notes.'
 ].join('\n');
 const evidence=[existing?.evidence,note].filter(Boolean).join('\n\n');
 if(evidence.length>50000)return existing;
 return {...existing,status:existing?.status&&existing.status!=='Not started'?existing.status:'Practicing',evidence,review:existing?.review||'',updated:existing?.updated||new Date().toISOString()};
}

export function mergeHttpPortAnswer(existing){
 const marker='[HTTP lesson answer: service port]';
 if(existing?.evidence?.includes(marker))return existing;
 const answer='This HTTP service uses port 8766 because the server code configures the practice service to use the dashboard’s port, 8765, plus one. Port 80 is HTTP’s default, but HTTP can run on other ports. Adding :8766 to the URL tells the client which port to connect to.';
 const evidence=[existing?.evidence,marker+'\n'+answer].filter(Boolean).join('\n\n');
 if(evidence.length>50000)return existing;
 const tasks=existing?.tasks?[...existing.tasks]:Array(7).fill(false);
 tasks[4]=true; // Three experiment steps, then the second success check.
 return {...existing,tasks,evidence,status:existing?.status&&existing.status!=='Not started'?existing.status:'Practicing',review:existing?.review||'',updated:new Date().toISOString()};
}

export function mergeHttp404Answer(existing){
 const marker='[HTTP lesson answer: 404 and TCP]';
 if(existing?.evidence?.includes(marker))return existing;
 const answer='My request to /not-found returned HTTP/1.0 404 Not Found and a JSON body saying "No such route". This proves the server was reachable over TCP. The failure was that the requested application route did not exist, not that the TCP connection failed.';
 const evidence=[existing?.evidence,marker+'\n'+answer].filter(Boolean).join('\n\n');
 if(evidence.length>50000)return existing;
 const tasks=existing?.tasks?[...existing.tasks]:Array(7).fill(false);
 tasks[5]=true;
 return {...existing,tasks,evidence,status:existing?.status&&existing.status!=='Not started'?existing.status:'Practicing',review:existing?.review||'',updated:new Date().toISOString()};
}

export function mergeHttpLearningSummary(existing){
 const marker='[Lesson 02 — Follow a real HTTP connection: learning summary]';
 if(existing?.evidence?.includes(marker))return existing;
 const note=[marker,'Added November 16, 2026. Summary of the guided lesson; not an independent skills assessment.',
 'CLIENT AND SERVER: Curl initiates requests and the Python practice service listens and responds. Both run on my laptop. Client and server describe roles, not necessarily separate computers.',
 'LISTENING SOCKET: lsof showed Python listening at 127.0.0.1:8766 (LISTEN). This identifies a TCP listening endpoint. Loopback keeps these connections on my laptop.',
 'TRANSPORT EVIDENCE: “Connected to 127.0.0.1 … port 8766” confirms that curl established a TCP connection.',
 'APPLICATION EVIDENCE: Curl sent GET /health using HTTP/1.1, and the server returned HTTP/1.0 200 OK with JSON reporting a healthy practice target.',
 'MISSING RESOURCE: GET /not-found returned HTTP/1.0 404 Not Found and “No such route.” An HTTP response arrived over a working TCP connection; the route was missing.',
 'AUTHENTICATION: GET /protected without credentials returned 401 Unauthorized and WWW-Authenticate: Bearer. Reaching the service does not guarantee access to a resource.',
 'ADDRESS AND PORT: Destination IP 127.0.0.1; TCP destination port 8766; application protocol HTTP. The code assigns dashboard port 8765 and target port 8765 + 1. HTTP can run on a port other than default port 80.',
 'CURL FLAGS: -v displays connection details and request/response headers; -i includes response headers with the body; -H adds a request header; --max-time 5 limits the operation to five seconds.',
 'TROUBLESHOOTING METHOD: If the TCP connection fails, inspect the destination address, port, listener and network path. If an HTTP response arrives, interpret its status: 404 points to the requested resource; 401 indicates missing or invalid authentication credentials.',
 'FLOW: curl → TCP connection to 127.0.0.1:8766 → Python handles the HTTP request → HTTP response → curl displays it.'
 ].join('\n\n');
 const evidence=[existing?.evidence,note].filter(Boolean).join('\n\n');
 if(evidence.length>50000)return existing;
 return {...existing,evidence,status:existing?.status&&existing.status!=='Not started'?existing.status:'Practicing',review:existing?.review||'',updated:new Date().toISOString()};
}
