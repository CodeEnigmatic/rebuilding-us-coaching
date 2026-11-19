export function normalizeTasks(tasks,lab){
 if(tasks===undefined)return Array(lab.steps.length+lab.checks.length+1).fill(false);
 if(!Array.isArray(tasks)||tasks.length!==lab.steps.length+lab.checks.length+1||tasks.some(v=>typeof v!=='boolean'))throw Error('Invalid lesson checklist.');
 return [...tasks];
}
export function taskSummary(lab,record){const tasks=normalizeTasks(record?.tasks,lab),done=tasks.filter(Boolean).length;return {tasks,done,total:tasks.length,percent:Math.round(done/tasks.length*100)};}
export function pathSummary(labs,progress){return labs.reduce((result,lab)=>{const row=taskSummary(lab,progress[lab.id]);return {done:result.done+row.done,total:result.total+row.total};},{done:0,total:0});}
