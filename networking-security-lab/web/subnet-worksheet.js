export const subnetFields=[
 ['prefix','1. Network bits','Read the number after the slash. IPv4 has 32 bits in total.'],
 ['hostBits','2. Host bits','Subtract the prefix length from 32. Write the subtraction.'],
 ['binaryMask','3. Binary subnet mask','Write one 1 for each network bit, followed by the remaining 0s. Group into four octets.'],
 ['mask','4. Decimal subnet mask','Convert each binary octet to decimal. Octet weights: 128, 64, 32, 16, 8, 4, 2, 1.'],
 ['blockSize','5. Block size','For this /27, calculate 256 minus the final mask octet. This gives the last-octet block size.'],
 ['boundaries','6. Subnet boundaries','Count from 0 by your block size in the last octet. Identify the block containing .64.'],
 ['network','7. Network address','The first address in that block. Include the full IPv4 address and prefix.'],
 ['nextNetwork','8. Next subnet address','Add one block size to the network’s last octet.'],
 ['broadcast','9. Broadcast address','Subtract 1 from the next subnet address.'],
 ['firstHost','10. First usable host','Add 1 to the network address.'],
 ['lastHost','11. Last usable host','Subtract 1 from the broadcast address.'],
 ['usableRange','12. Usable host range','Write the first usable address through the last usable address.'],
 ['totalAddresses','13. Total addresses','Calculate 2 raised to the number of host bits. Include network and broadcast.'],
 ['usableCount','14. Usable host count','For this conventional /27 subnet, subtract 2 from the total for network and broadcast.'],
 ['working','15. Show your working','Explain your calculation and what you want to check with Python. After checking, record corrections here.']
];
const segmentFields=['segment1','segment2'];
export function cleanWorksheet(value){
 if(value===undefined)return {};
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid subnet worksheet.');
 const result={};
 for(const key of [...subnetFields.map(([key])=>key),...segmentFields]){if(value[key]===undefined)continue;if(typeof value[key]!=='string'||value[key].length>5000)throw Error('Invalid subnet worksheet answer.');result[key]=value[key];}
 return result;
}
export function segmentWorksheetHtml(value,escape){
 const data=cleanWorksheet(value);
 return `<fieldset class="subnet-worksheet"><legend>Your two /25 segments</legend><p>For each segment, record the network/prefix, mask, broadcast, usable host range, gateway, static-device range and DHCP range. Exclude network and broadcast addresses, keep the gateway out of device pools, and avoid overlapping allocations.</p>${segmentFields.map((key,i)=>`<label class="field" for="subnet-${key}">Segment ${i+1}</label><textarea id="subnet-${key}" data-subnet="${key}" maxlength="5000" rows="10" placeholder="Network / prefix:\nSubnet mask:\nBroadcast:\nUsable host range:\nGateway:\nStatic-device range:\nDHCP range:\nOverlap check:">${escape(data[key]||'')}</textarea>`).join('')}<p class="save-note">Answers save as you type and are included in Export progress.</p></fieldset>`;
}
export function worksheetHtml(value,escape){
 const data=cleanWorksheet(value);
 return `<fieldset class="subnet-worksheet"><legend>Calculate 192.168.50.64/27 by hand</legend><p>Fill in the calculation and answer slots before using the Python checker in the next step. No answers are prefilled.</p>${subnetFields.map(([key,label,hint])=>`<label class="field" for="subnet-${key}">${label}</label><p class="save-note" id="subnet-hint-${key}">${hint}</p><textarea id="subnet-${key}" data-subnet="${key}" maxlength="5000" aria-describedby="subnet-hint-${key}" rows="${key==='working'?4:2}" placeholder="Your calculation and answer…">${escape(data[key]||'')}</textarea>`).join('')}<p class="save-note" id="subnet-save-status" role="status">Worksheet answers save as you type and are included in Export progress. Your checklist stays under your control.</p></fieldset>`;
}
