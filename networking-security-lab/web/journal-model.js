export const fields={profile:'Network profile',date:'Date observed',interface:'Interface',ip:'IPv4 address',mask:'Subnet mask',prefix:'Prefix length',network:'Network address',broadcast:'Broadcast address',gateway:'Default gateway',dns:'DNS servers (one per line)',notes:'Evidence and uncertainties'};
export const empty=()=>({version:1,snapshots:[],incidents:[]});
export function validate(value){
 if(!value||value.version!==1||!Array.isArray(value.snapshots)||!Array.isArray(value.incidents)||value.snapshots.length>500||value.incidents.length>500)throw Error('Invalid journal format or too many records.');
 const string=(v,max=50000)=>{if(typeof v!=='string'||v.length>max)throw Error('Invalid journal field.');return v;};
 const date=v=>{string(v,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||Number.isNaN(Date.parse(v)))throw Error('Invalid date.');return v;};
 const snapshots=value.snapshots.map(row=>{if(!row||typeof row!=='object')throw Error('Invalid snapshot.');const clean={id:string(row.id,100)};for(const key of Object.keys(fields))clean[key]=key==='date'?date(row[key]):string(row[key],key==='notes'?50000:2000);return clean;});
 const incidents=value.incidents.map(row=>({id:string(row.id,100),profile:string(row.profile,2000),date:date(row.date),text:string(row.text)}));
 return {version:1,snapshots,incidents};
}
export function changes(a,b){return Object.keys(fields).filter(key=>!['date','notes'].includes(key)&&a[key]!==b[key]).map(key=>({key,before:a[key],after:b[key]}));}
export function snapshot(values){return Object.fromEntries(Object.keys(fields).map(key=>[key,String(values[key]??'')]));}
