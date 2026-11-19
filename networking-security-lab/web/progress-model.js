export const levels={'Not started':0,Practicing:1,Completed:2,Demonstrated:3};
export function labPercent(status){return Math.round((levels[status]||0)/3*100);}
export function journalMilestones(journal){const rows=journal.snapshots||[];return [rows.length>0,rows.some((r,i)=>rows.some((s,k)=>k<i&&s.profile===r.profile)),(journal.incidents||[]).some(r=>r.text?.trim())];}
export function summary(labs,progress,journal){const milestones=journalMilestones(journal);const units=labs.reduce((n,l)=>n+(levels[progress[l.id]?.status]||0),0)+milestones.filter(Boolean).length;return {percent:Math.round(units/(labs.length*3+3)*100),milestones,nextLab:labs.find(l=>!['Completed','Demonstrated'].includes(progress[l.id]?.status)),independent:labs.filter(l=>progress[l.id]?.status==='Demonstrated').length};}
export function meter(value,label){return `<progress max="100" value="${value}" aria-label="${label}">${value}%</progress>`;}
