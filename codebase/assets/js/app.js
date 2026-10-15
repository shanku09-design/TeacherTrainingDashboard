
/* ================= HELPERS ================= */
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let R=rng(750);
const pick=a=>a[Math.floor(R()*a.length)], ri=(a,b)=>a+Math.floor(R()*(b-a+1));
const rr=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const hash=s=>[...s].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7);
const D=s=>new Date(s+'T00:00:00');
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const iso=d=>{const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fd=s=>{if(!s)return '–';const d=typeof s==='string'?D(s):s;return d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear()};
const mY=s=>{const d=typeof s==='string'?D(s):s;return MON[d.getMonth()]+' '+d.getFullYear()};
const pct=(a,b)=>b?Math.round(a/b*100):0;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf=n=>Number(n).toLocaleString('en-IN');

/* ================= PROGRAMME (from RFP Section IV) ================= */
const REAL_TODAY='2026-10-14'; let TODAY=D(REAL_TODAY);
const AS_OF=[['2026-10-14','14 Oct 2026 (today)'],['2027-01-15','15 Jan 2027 (sample)'],['2027-03-15','15 Mar 2027 (sample)']];
const PO='2026-09-01', INSTALL_BY='2027-01-01', DEADLINE='2027-03-01'; // PO date assumed; T+4 installation, T+6 initial training
const PER_SCHOOL={teacher:10,student:100};
const STATES=[ // name, schools (Annexure II), UDISE prefix, abbr, content language (Annexure III), sample districts
 ['Andhra Pradesh',196,'28','AP','Telugu',['Srikakulam','Vizianagaram','Bapatla','Kurnool','Anantapur','Prakasam']],
 ['Arunachal Pradesh',11,'12','AR','Hindi',['Papum Pare','Lower Subansiri','Changlang']],
 ['Assam',40,'18','AS','Assamese',['Dhubri','Goalpara','Barpeta','Karbi Anglong']],
 ['Chhattisgarh',40,'22','CG','Hindi',['Bastar','Dantewada','Korba','Surguja']],
 ['Gujarat',3,'24','GJ','Gujarati',['Dahod']],
 ['Haryana',14,'06','HR','Hindi',['Nuh','Palwal']],
 ['Jharkhand',46,'20','JH','Hindi',['Dumka','Pakur','Godda','West Singhbhum']],
 ['Karnataka',8,'29','KA','Kannada',['Raichur','Yadgir']],
 ['Manipur',1,'14','MN','Manipuri',['Churachandpur']],
 ['Rajasthan',45,'08','RJ','Hindi',['Barmer','Banswara','Dungarpur','Jaisalmer']],
 ['Sikkim',1,'11','SK','Nepali',['Gyalshing']],
 ['Telangana',165,'36','TS','Telugu',['Adilabad','Nalgonda','Khammam','Mahabubnagar','Nirmal']],
 ['Uttar Pradesh',180,'09','UP','Hindi',['Bahraich','Shravasti','Balrampur','Sonbhadra','Lalitpur','Chitrakoot']]
];
const stBy=n=>STATES.find(s=>s[0]===n);
const PROJECT={id:'P1',code:'ERN-KGBV-26',name:'Digital Classrooms in 750 KGBVs',wo:PO,start:PO,end:'2029-08-31'};
const projects=[PROJECT]; const projBy=()=>PROJECT;
const PHASES=[
 {n:1,short:'Orientation',hours:2,days:1,hpd:[2],type:'Induction',win:['2026-11-01','2026-12-31'],schedule:['Module 1: working and operational aspects of the digital classroom solution (2 h) · pre-assessment']},
 {n:2,short:'Device & content use',hours:8,days:2,hpd:[4,4],type:'Induction',win:['2026-11-15','2027-02-15'],schedule:['Module 2: using the digital teaching device and multimedia content (4 h)','Module 2: technology-enabled lessons and blended-learning practice (4 h) · assessment + feedback']},
 {n:3,short:'Digital skills',hours:5,days:1,hpd:[5],type:'Induction',joint:true,win:['2026-12-01','2027-02-28'],schedule:['Module 3, joint with students: cyber safety, digital creativity, AI awareness (5 h) · post-assessment + feedback']},
 {n:4,short:'Refresher I',hours:5,days:1,hpd:[5],type:'Refresher 1',win:['2027-11-01','2028-01-31'],schedule:['Module 4: implementation challenges and teacher queries (5 h) · feedback']},
 {n:5,short:'Refresher II',hours:5,days:1,hpd:[5],type:'Refresher 2',win:['2028-05-01','2028-07-31'],schedule:['Module 5: reinforcing adoption and resolving operational issues (5 h) · feedback']}
];
const SMODS=[{n:1,short:'Cyber safety',hours:5},{n:2,short:'Digital creativity',hours:5},{n:3,short:'AI awareness',hours:5}];
const STU={win:['2026-12-01','2027-02-28'],schedule:['Pre-assessment + Module 1: cyber safety & digital responsibility (5 h)','Module 2: digital creativity with Canva / Adobe Express (5 h)','Module 3: AI awareness (5 h) + post-assessment + feedback']};
const plans=[...PHASES.map(ph=>({id:'PH'+ph.n,code:'TP-KGBV-M'+ph.n,name:`Phase ${ph.n} · ${ph.short}`,short:ph.short,kind:'teacher',phase:ph.n,type:ph.type,days:ph.days,hours:ph.hours,hpd:ph.hpd,schedule:ph.schedule,win:ph.win,project:'P1'})),
 {id:'ST',code:'TP-KGBV-STU',name:'Student skill development',short:'Student skills',kind:'student',phase:0,type:'Other',days:3,hours:15,hpd:[5,5,5],schedule:STU.schedule,win:STU.win,project:'P1'}];

/* ================= SAMPLE DATA ================= */
const TCOUNT={AP:6,AR:1,AS:2,CG:2,GJ:1,HR:1,JH:2,KA:1,MN:1,RJ:2,SK:1,TS:5,UP:5};
const TNAMES=['Meera Iyer','Arjun Reddy','Sneha Rao','Bikash Das','Iasha Lyngdoh','Prakash Sahu','Neha Srivastava','Amit Meena','Sasmita Nayak','Farhan Qureshi','Lakshmi Naidu','Kiran Babu','Pooja Tirkey','Rahul Soren','Divya Rathore','Vivek Chauhan','Sunita Netam','Harish Gowda','Thoibi Devi','Pema Bhutia','Ramesh Goud','Swathi Reddy','Naveen Kumar','Shalini Mishra','Ajay Pal','Kavita Rajput','Manoj Yadav','Geeta Kumari','Srinivas Rao','Anjali Patel','Deepak Malik'];
const trainers=[]; let tn=0;
STATES.forEach(([st,,,ab])=>{for(let i=0;i<TCOUNT[ab];i++){const me=ab==='UP'&&i===0;trainers.push({code:'TR-'+(1001+trainers.length),name:me?'Rohan Verma':TNAMES[tn++],kind:trainers.length%3?'Employee':'Consultant',state:st,avail:[['2026-10-15','2029-08-31']],status:'Active',me})}});
trainers.filter(t=>t.state==='Assam'||t.state==='Rajasthan')[1].avail=[['2026-10-15','2026-12-15']];
trainers.filter(t=>t.state==='Rajasthan')[1].avail=[['2026-10-15','2026-12-15']];
trainers.push({code:'TR-'+(1001+trainers.length),name:'Ritu Saini',kind:'Consultant',state:'Telangana',avail:[],status:'Inactive'});
const ME=trainers.find(t=>t.me).code;
const trainerBy=c=>trainers.find(t=>t.code===c);

const schools=[];
STATES.forEach(([st,n,code,ab,lang,ds])=>{const cnt={};for(let i=0;i<n;i++){const d=ds[i%ds.length];cnt[d]=(cnt[d]||0)+1;
  let c=addDays(D('2026-09-22'),ri(0,92)); if(R()<.05)c=addDays(D('2027-01-04'),ri(0,30));
  schools.push({id:ab+String(i+1).padStart(3,'0'),name:`KGBV ${d} ${cnt[d]}`,state:st,district:d,udise:code+String(ri(100000000,999999999)),commission:iso(c),lang})}});
const schoolBy=id=>schools.find(s=>s.id===id);
const clusters=[];
STATES.forEach(([st,,,ab])=>{const ss=schools.filter(s=>s.state===st), tr=trainers.filter(t=>t.state===st&&t.status==='Active');const byD={};ss.forEach(s=>(byD[s.district]=byD[s.district]||[]).push(s));let ci=0;
  Object.values(byD).forEach(list=>{for(let k=0;k<list.length;k+=3){clusters.push({id:ab+'-C'+String(++ci).padStart(2,'0'),state:st,district:list[k].district,schools:list.slice(k,k+3),trainer:tr[(ci-1)%tr.length].code,idx:ci})}})});
const PCL=clusters.find(c=>c.trainer===ME); const PSCHOOL=PCL.schools[0]; PSCHOOL.commission='2026-10-05';
const batches=[];
function nextWork(d){d=new Date(d);while(d.getDay()===0)d=addDays(d,1);return d}
clusters.forEach(c=>{
  const cnt=clusters.filter(x=>x.state===c.state).length, frac=((c.idx-1)/cnt)*.8+R()*.04;
  const ready=addDays(D(c.schools.map(s=>s.commission).sort().pop()),2); let prev=null;
  PHASES.forEach(ph=>{const a=D(ph.win[0]),e=D(ph.win[1]),span=(e-a)/864e5;
    let st=addDays(a,Math.round(frac*span*.75)); if(ph.n<=3&&st<ready)st=new Date(ready); if(prev&&st<addDays(prev,7))st=addDays(prev,7); st=nextWork(st);
    const en=addDays(st,ph.days-1); prev=en;
    batches.push({id:`T${ph.n}-${c.id}`,kind:'teacher',plan:'PH'+ph.n,phase:ph.n,state:c.state,district:c.district,schools:c.schools.map(s=>s.id),school:c.schools[0].name+(c.schools.length>1?` +${c.schools.length-1}`:''),udise:c.schools[0].udise,trainer:c.trainer,start:iso(st),end:iso(en),cap:c.schools.length*10,cluster:c.id,openReg:ph.n<=3,persona:c===PCL});
  });
  c.schools.forEach((s,j)=>{const a=D(STU.win[0]),span=(D(STU.win[1])-a)/864e5;let st=addDays(a,Math.round(frac*span*.75)+j*4+ri(0,3));const rd=addDays(D(s.commission),5);if(st<rd)st=rd;st=nextWork(st);
    batches.push({id:`S-${s.id}`,kind:'student',plan:'ST',phase:0,state:c.state,district:c.district,schools:[s.id],school:s.name,udise:s.udise,trainer:c.trainer,start:iso(st),end:iso(addDays(st,2)),cap:100,cluster:c.id,openReg:false,persona:s===PSCHOOL});
  });
});
const resources=[
 ['R1','Digital Classroom Solution – Orientation Deck','PPT','PH1',1,'English','4.1 MB'],
 ['R2','Operations Guide: Digital Teaching Device','PDF','PH1',1,'English','3.1 MB'],
 ['R3','User Manual: Digital Teaching Device','PDF','PH1',1,'Telugu','3.3 MB'],
 ['R4','User Manual: Digital Teaching Device','PDF','PH1',1,'Hindi','3.2 MB'],
 ['R5','Using the Digital Teaching Device (video)','Video','PH2',1,'English','142 MB'],
 ['R6','Navigating the 2D/3D Multimedia Content','Video','PH2',1,'Hindi','118 MB'],
 ['R7','Designing Technology-enabled Lessons','PPT','PH2',2,'English','5.6 MB'],
 ['R8','Blended-Learning Lesson Plan Templates','PDF','PH2',2,'English','1.2 MB'],
 ['R9','Pre-training Assessment (teachers)','Form','PH1',1,'English','10 questions'],
 ['R10','Daily Feedback Form','Form','PH1',1,'English','6 questions'],
 ['R11','Facilitator Guide: Joint Digital Skills Session','PDF','PH3',1,'English','2.0 MB'],
 ['R12','Post-training Assessment (teachers)','Form','PH3',1,'English','15 questions'],
 ['R13','Refresher I – Implementation FAQ','PDF','PH4',1,'English','1.0 MB'],
 ['R14','Troubleshooting Common Device Issues (video)','Video','PH4',1,'Hindi','88 MB'],
 ['R15','Refresher II – Sustaining Adoption','PPT','PH5',1,'English','4.4 MB'],
 ['R16','Cyber Safety & Digital Responsibility – Activity Book','PDF','ST',1,'Hindi','6.2 MB'],
 ['R17','Spotting Fake News & Online Scams (video)','Video','ST',1,'English','64 MB'],
 ['R18','Digital Creativity with Canva & Adobe Express','PPT','ST',2,'English','9.8 MB'],
 ['R19','Simple Animation & Video Editing Project Pack','Other','ST',2,'English','HTML5 package'],
 ['R20','AI Around Us – Classroom Activities','PPT','ST',3,'Telugu','7.1 MB'],
 ['R21','Student Pre-assessment','Form','ST',1,'English','12 questions'],
 ['R22','Student Post-assessment','Form','ST',3,'English','12 questions'],
 ['R23','Self-paced Digital Learning Modules','Other','ST',1,'English','Online modules']
].map(([id,name,type,plan,day,lang,size],i)=>({id,name,type,plan,day,lang,size,by:i%5===3?trainers[i].name:'Platform Admin',date:iso(addDays(D('2026-09-05'),i*2)),f:.6+((i*37)%50)/100,users:0,hits:0,last:null}));
const audit=[
 {date:'2026-10-13 17:40',user:ME,field:'Availability',old:'from 1 Nov 2026',nw:'from 15 Oct 2026',by:ME},
 {date:'2026-10-12 11:05',user:'KGBV Bahraich 1 (admin)',field:'Email',old:'k••••@gmail.com',nw:'k••••@up.gov.in',by:'Platform Admin'},
 {date:'2026-10-10 15:22',user:'TR-1012',field:'Mobile Number',old:'98••••••12',nw:'97••••••48',by:'Self (OTP verified)'},
 {date:'2026-10-09 10:01',user:'TT-AP01204',field:'Name',old:'Sarita P.',nw:'Sarita Pa.',by:'Platform Admin'},
 {date:'2026-10-08 08:47',user:'ERNET-MON-01',field:'Password',old:'••••••',nw:'••••••',by:'Self'}
];
const holidays=[
 {date:'2026-11-08',name:'Diwali',scope:'National',state:'All'},{date:'2026-11-24',name:'Guru Nanak Jayanti',scope:'National',state:'All'},
 {date:'2026-12-25',name:'Christmas',scope:'National',state:'All'},{date:'2027-01-26',name:'Republic Day',scope:'National',state:'All'},
 {date:'2027-01-14',name:'Sankranti',scope:'State',state:'Andhra Pradesh'},{date:'2027-01-15',name:'Magh Bihu',scope:'State',state:'Assam'},
 {date:'2027-03-04',name:'Holi',scope:'National',state:'All'},{date:'2026-11-01',name:'Karnataka Rajyotsava',scope:'State',state:'Karnataka'}
];

/* ---- stats that depend on the "data as of" date ---- */
function statusOf(b){const s=D(b.start),e=D(b.end);if(e<TODAY)return 'Completed';if(s<=TODAY)return 'In Progress';return (s-TODAY)/864e5<=14?'Upcoming':'Not Started'}
function computeStats(){
  batches.forEach(b=>{
    const r=rng(hash(b.id)), c=b.cap, st=statusOf(b), days=(D(b.start)-TODAY)/864e5, low=r()<.09, t=trainerBy(b.trainer);
    Object.assign(b,{status:st,registered:0,approved:0,attended:0,completed:0,certified:0,attPct:0,assessPct:0,feedbackPct:0,pre:0,post:0,access:0,attUpdated:true,
      trainerConflict:!t.avail.some(([f,e])=>f<=b.start&&e>=b.end),late:b.phase<=3&&b.end>=DEADLINE});
    if(st==='Completed'){b.registered=b.kind==='teacher'?c-(r()<.3?1:0):rr(r,90,100);b.approved=b.registered;b.attPct=low?rr(r,60,74):rr(r,80,98);b.attended=Math.round(b.approved*(.9+r()*.1));b.completed=Math.round(b.attended*(low?.72:.9+r()*.1));b.certified=(TODAY-D(b.end))/864e5>10?b.completed:Math.round(b.completed*.5);b.assessPct=rr(r,80,100);b.feedbackPct=rr(r,70,100);
      if(b.kind==='student'){b.pre=rr(r,36,52);b.post=b.pre+rr(r,14,30);b.access=Math.round(b.completed*(.8+r()*.2))}}
    else if(st==='In Progress'){b.registered=b.kind==='teacher'?c:rr(r,92,100);b.approved=b.registered;b.attPct=rr(r,78,97);b.attended=Math.round(b.approved*(.88+r()*.1));b.assessPct=rr(r,50,90);b.attUpdated=r()>.3;if(b.kind==='student'){b.pre=rr(r,36,52);b.access=Math.round(b.attended*.5)}}
    else{if(days<=21)b.registered=Math.round(c*(.55+r()*.45));else if(days<=45)b.registered=Math.round(c*r()*.35);b.approved=days<=7?Math.round(b.registered*.9):0}
  });
  resources.forEach(x=>{const l=batches.filter(b=>b.plan===x.plan&&(b.status==='Completed'||b.status==='In Progress'));const base=l.reduce((a,b)=>a+b.attended,0);x.users=Math.round(base*x.f*(x.lang==='English'?1:.4));x.hits=Math.round(x.users*(1.3+x.f));x.last=l.length?iso(TODAY):null});
  Object.keys(traineeCache).forEach(k=>delete traineeCache[k]);
}
const FN=['Anita','Sunita','Kavita','Rekha','Pooja','Shalini','Sarita','Lata','Fatima','Mary','Asha','Priya','Geeta','Kiran','Bhavna','Usha','Tanvi','Radha','Savitri','Lakshmi','Padma','Jyoti','Meena','Nirmala'];
const LN=['Yadav','Devi','Kumari','Reddy','Naidu','Sahu','Das','Marandi','Tirkey','Meena','Rathore','Bora','Gond','Netam','Singh','Khatun','Rao','Patel'];
const traineeCache={};
function trainees(b){
  if(traineeCache[b.id])return traineeCache[b.id];
  const r=rng(hash(b.id)+3), plan=planBy(b.plan);
  const elapsed=b.status==='Completed'?plan.days:b.status==='In Progress'?Math.min(plan.days,Math.floor((TODAY-D(b.start))/864e5)+(b.attUpdated?1:0)):0;
  const list=[];
  for(let i=0;i<b.registered;i++){
    const me=b.kind==='teacher'&&b.persona&&i===0;
    const fn=me?'Anita':FN[Math.floor(r()*FN.length)], ln=me?'Yadav':LN[Math.floor(r()*LN.length)];
    const sid=me?PSCHOOL.id:b.schools[i%b.schools.length], approved=i<b.approved, att=[];
    for(let d=0;d<elapsed;d++)att.push(approved?(r()<b.attPct/100?'P':'A'):'–');
    const present=att.filter(x=>x==='P').length;
    let status=approved?(elapsed?'Training Started':'Approved'):'Registered';
    if(b.status==='Completed'&&approved)status=i<b.certified?'Certified':i<b.completed?'Training Completed':(present/plan.days<.75?'Dropped/Inactive':'Assessment Pending');
    const stu=b.kind==='student';
    list.push({uid:(stu?'ST-':'TT-')+sid+String(i+1).padStart(stu?3:2,'0'),name:fn+' '+ln,masked:stu?fn[0]+'. '+ln[0]+'.':fn+' '+ln[0]+'.',school:schoolBy(sid).name,
      mobile:stu?'—':'9'+Math.floor(r()*9)+'••••••'+String(Math.floor(r()*90)+10),grade:stu?['VI','VII','VIII','IX','X','XI','XII'][Math.floor(r()*7)]:'',
      source:stu?'School list':(r()<.6?'Excel upload':'Open registration'),approved,status,att,present,dup:!approved&&r()<.2,
      pre:stu&&b.pre?b.pre+Math.round((r()-.5)*20):null,post:stu&&b.post?b.post+Math.round((r()-.5)*20):null});
  }
  return traineeCache[b.id]=list;
}

/* ================= STATE & UTILITIES ================= */
const S={role:'admin',state:'all',mode:'teacher',attSaved:{},teacher:{post:{},fb:{}},extra:{plans:[],holidays:[],projects:[]}};
const planBy=id=>plans.find(p=>p.id===id)||S.extra.plans.find(p=>p.id===id);
const ROLES={
 admin:{who:'Teacher Training Platform Admin',home:'/admin',stateSel:true},
 trainer:{who:'Rohan Verma · '+ME+' · Uttar Pradesh',home:'/trainer',stateSel:false},
 teacher:{who:'Anita Y. · TT-'+PSCHOOL.id+'01 · '+PSCHOOL.name,home:'/teacher',stateSel:false}
};
function navFor(role){
  const reports=[['Reports'],['/reports/summary','Programme summary'],['/reports/schools','School readiness & coverage'],['/reports/batches','Batch performance'],['/reports/attendance','Attendance'],['/reports/trainers','Trainer availability'],['/reports/resources','Resource usage']];
  if(role==='ernet')return [['/ernet','Monitoring dashboard'],...reports,['Content'],['/library','Content library']];
  if(role==='admin')return [['/admin','Admin dashboard'],['Set up'],['/admin/projects','Project'],['/admin/plans','Training plans'],['/admin/batches','Batch upload'],['/admin/trainers','Trainers & availability'],['/admin/holidays','Holiday calendar'],['/admin/certificate','Certificate template'],['Content'],['/library','Content library'],['/resource/upload','Upload resource'],...reports,['/reports/users','Users & audit']];
  if(role==='trainer')return [['/trainer','My work'],['/trainer/attendance','Mark attendance'],['/trainer/trainees','Participants & registration'],['/trainer/plan','Training plan'],['Content'],['/library','Content library'],['/resource/upload','Upload resource']];
  return [['/teacher','My training'],['/teacher/assessment','Assessment'],['/teacher/feedback','Feedback'],['/teacher/certificate','Certificates'],['/library','Learning resources'],['Other'],['/register','Register for a batch']];
}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3600)}
function toggleTheme(){const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=dark?'light':'dark'}
const qstr=p=>p?new URLSearchParams(Object.entries(p).filter(([k,v])=>v!==undefined&&v!==''&&v!=='all')).toString():'';
function link(path,params){const q=qstr(params);return '#'+path+(q?'?'+q:'')}
function go(path,params){location.hash=link(path,params).slice(1)}
function switchRole(r){if(!window.DemoAuth||!window.DemoAuth.start(r)){logoutDemo();return}S.role=r;S.state='all';go(ROLES[r].home)}
function logoutDemo(){if(window.DemoAuth)window.DemoAuth.logout();location.replace('index.html?session=logout')}
function setState(v){S.state=v;route()}
function setAsOf(v){TODAY=D(v);computeStats();route()}
function setMode(m){S.mode=m;route()}
const statusChip=s=>`<span class="chip ${({'Completed':'good','In Progress':'acc','Upcoming':'info','Not Started':'','Cancelled':'bad','Certified':'good','Training Completed':'good','Approved':'info','Training Started':'acc','Registered':'','Assessment Pending':'warn','Dropped/Inactive':'bad'})[s]||''}">${esc(s)}</span>`;
const kindChip=k=>k==='student'?'<span class="chip info">Students</span>':'<span class="chip acc">Teachers</span>';
const STATUS_COL={'Not Started':'#9AA8A3','Upcoming':'var(--info)','In Progress':'var(--accent)','Completed':'var(--good)','Cancelled':'var(--bad)'};
const PH_COL=['#2F8F6B','var(--accent)','var(--info)','var(--warn)','#8B6BC2'];
const schoolsInScope=()=>schools.filter(s=>S.state==='all'||s.state===S.state);
const statesInScope=()=>S.state==='all'?STATES.map(s=>s[0]):[S.state];
const targetOf=k=>schoolsInScope().length*PER_SCHOOL[k];
const commissioned=ss=>ss.filter(s=>s.commission<=iso(TODAY)).length;
function scoped(p={}){
  return batches.filter(b=>(S.state==='all'||b.state===S.state)&&(!p.state||b.state===p.state)&&(!p.district||b.district===p.district)&&(!p.plan||b.plan===p.plan)&&(!p.kind||b.kind===p.kind)
    &&(!p.status||b.status===p.status)&&(!p.trainer||b.trainer===p.trainer)&&(!p.from||b.start>=p.from)&&(!p.to||b.start<=p.to)&&(!p.flag||(p.flag==='late'?b.late:p.flag==='conflict'?b.trainerConflict:true))
    &&(!p.q||(b.id+b.school+b.udise).toLowerCase().includes(p.q.toLowerCase())));
}
function agg(bs){
  const live=bs.filter(b=>b.status!=='Cancelled'), sum=k=>live.reduce((a,b)=>a+b[k],0);
  const w=(k,l)=>{const tot=l.reduce((a,b)=>a+b.approved,0);return tot?Math.round(l.reduce((a,b)=>a+b[k]*b.approved,0)/tot):0};
  const withAtt=live.filter(b=>b.attended>0), done=live.filter(b=>b.status==='Completed');
  const hours=live.reduce((x,b)=>{const pl=planBy(b.plan);if(b.status==='Completed')return x+b.completed*pl.hours;if(b.status==='In Progress'){const d=Math.floor((TODAY-D(b.start))/864e5)+(b.attUpdated?1:0);return x+b.attended*pl.hpd.slice(0,d).reduce((a,h)=>a+h,0)}return x},0);
  return {hours,batches:bs.length,planned:sum('cap'),registered:sum('registered'),approved:sum('approved'),attended:sum('attended'),completed:sum('completed'),certified:sum('certified'),access:sum('access'),
    attPct:w('attPct',withAtt),assessPct:w('assessPct',withAtt),pre:w('pre',done.filter(b=>b.pre)),post:w('post',done.filter(b=>b.post)),
    byStatus:['Not Started','Upcoming','In Progress','Completed'].map(s=>[s,bs.filter(b=>b.status===s).length])};
}
function phStatus(win,done){
  if(TODAY<D(win[0]))return {label:'Starts '+fd(win[0]),cls:'',exp:null};
  if(done>=98)return {label:'Completed',cls:'good',exp:null};
  if(TODAY>D(win[1]))return {label:'Overdue',cls:'bad',exp:null};
  const exp=Math.round((TODAY-D(win[0]))/(D(win[1])-D(win[0]))*100);
  return {label:done>=exp*.8?'On track':'Behind plan',cls:done>=exp*.8?'good':'warn',exp};
}
const resAud=r=>planBy(r.plan).kind==='student'?'Students':'Teachers';
const resLabel=r=>planBy(r.plan).kind==='student'?`Students · Day ${r.day}`:`Phase ${planBy(r.plan).phase} · ${planBy(r.plan).short}`;
const selOpts=(arr,val,all)=>(all?`<option value="">${all}</option>`:'')+arr.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${String(v)===String(val)?'selected':''}>${esc(l)}</option>`}).join('');
const planOpts=()=>plans.map(p=>[p.id,(p.kind==='student'?'Students · ':'Teachers · ')+p.name+' ('+p.hours+' h)']);
function filterBar(path,params,fields){
  const f={
    state:()=>S.state==='all'?`<div class="f"><label>State</label><select onchange="fset('state',this.value)">${selOpts(statesInScope(),params.state,'All states')}</select></div>`:'',
    district:()=>{const st=params.state||(S.state!=='all'?S.state:'');return `<div class="f"><label>District</label><select onchange="fset('district',this.value)">${selOpts(st?stBy(st)[5]:[],params.district,st?'All districts':'Choose a state first')}</select></div>`},
    plan:()=>`<div class="f"><label>Training</label><select onchange="fset('plan',this.value)">${selOpts(planOpts(),params.plan,'All training')}</select></div>`,
    kind:()=>`<div class="f"><label>Participants</label><select onchange="fset('kind',this.value)">${selOpts([['teacher','Teachers'],['student','Students']],params.kind,'Teachers and students')}</select></div>`,
    status:()=>`<div class="f"><label>Batch status</label><select onchange="fset('status',this.value)">${selOpts(['Not Started','Upcoming','In Progress','Completed'],params.status,'All statuses')}</select></div>`,
    trainer:()=>`<div class="f"><label>Trainer</label><select onchange="fset('trainer',this.value)">${selOpts(trainers.filter(t=>S.state==='all'||t.state===S.state).map(t=>[t.code,t.name+' · '+t.code]),params.trainer,'All trainers')}</select></div>`,
    flag:()=>`<div class="f"><label>Flag</label><select onchange="fset('flag',this.value)">${selOpts([['late','Past the 1 Mar 2027 deadline'],['conflict','Trainer not available']],params.flag,'None')}</select></div>`,
    dates:()=>`<div class="f"><label>Start from</label><input type="date" value="${params.from||''}" onchange="fset('from',this.value)"></div><div class="f"><label>Start to</label><input type="date" value="${params.to||''}" onchange="fset('to',this.value)"></div>`,
    q:()=>`<div class="f"><label>Search</label><input type="search" value="${esc(params.q||'')}" placeholder="Batch, school or UDISE" onchange="fset('q',this.value)"></div>`
  };
  window._fp={path,params};
  return `<div class="filters">${fields.map(k=>f[k]()).join('')}<button class="btn sm" onclick="go('${path}')">Clear filters</button></div>`;
}
function fset(k,v){const p={...window._fp.params,[k]:v};if(k!=='page')delete p.page;if(k==='state')delete p.district;go(window._fp.path,p)}
function paged(rows,q,size=100){const pg=Math.max(1,+q.page||1),tot=Math.ceil(rows.length/size)||1;
  return {rows:rows.slice((pg-1)*size,pg*size),pager:rows.length>size?`<div class="pager"><span class="small muted">Showing ${nf((pg-1)*size+1)}–${nf(Math.min(pg*size,rows.length))} of ${nf(rows.length)}</span><button class="btn sm" ${pg<=1?'disabled':''} onclick="fset('page','${pg-1}')">Previous</button><button class="btn sm" ${pg>=tot?'disabled':''} onclick="fset('page','${pg+1}')">Next</button></div>`:''}}
function exportBtns(name){return `<div class="row"><button class="btn sm" onclick="exportCsv('${name}')">Download CSV</button><button class="btn sm" onclick="toast('Excel export is generated server-side in the live system, using the same filters.')">Excel</button><button class="btn sm" onclick="toast('PDF export is generated server-side in the live system.')">PDF</button></div>`}
function exportCsv(name){const t=document.querySelector('#view table');if(!t){toast('Nothing to export');return}
  const rows=[...t.querySelectorAll('tr')].map(r=>[...r.children].map(c=>'"'+c.innerText.replace(/"/g,'""')+'"').join(','));
  openDlg('CSV preview – '+name,`<p class="muted small" style="margin-bottom:10px">Downloads respect the viewer's role and state permissions. Copy the rows below, or use the live system's download.</p><textarea style="width:100%;min-height:300px;font-family:monospace;font-size:12px;border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--surface-2)" readonly>${esc(rows.join('\n'))}</textarea>`)}
function table(cols,rows,opts={}){
  if(!rows.length)return `<div class="table-wrap"><div class="empty">${opts.empty||'No records match these filters. Clear a filter to widen the results.'}</div></div>`;
  return `<div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th class="${c.num?'num':''}">${c.h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr ${opts.click?`class="click" onclick="${opts.click(r)}"`:''}>${cols.map(c=>`<td class="${c.num?'num':''}">${c.f(r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function openDlg(t,h){document.getElementById('dlgT').textContent=t;document.getElementById('dlgB').innerHTML=h;document.getElementById('dlg').showModal()}
function fieldErr(id,msg){const el=document.getElementById(id).closest('.field');el.classList.toggle('err',!!msg);const m=el.querySelector('.msg');if(m)m.textContent=msg||'';return !msg}

/* ================= DASHBOARD VISUALS ================= */
function stuModuleDone(bs,k){return bs.reduce((a,b)=>a+(b.status==='Completed'?b.completed:b.status==='In Progress'&&Math.floor((TODAY-D(b.start))/864e5)+(b.attUpdated?1:0)>=k?b.attended:0),0)}
function journey(mode,bs){
  const T=targetOf(mode);
  if(mode==='teacher'){let cum=0;
    return `<section class="pipeline"><div class="j-head"><h2>Teacher training · 25 hours in five phases</h2><div class="j-total"><b>${nf(T)}</b><span>teachers in each phase</span></div></div>
    <div class="ph-scroll"><div class="phases" style="grid-template-columns:${PHASES.map(p=>`minmax(150px,${p.hours}fr)`).join(' ')};min-width:800px">${PHASES.map((P,i)=>{cum+=P.hours;const a=agg(bs.filter(b=>b.plan==='PH'+P.n)),d=pct(a.completed,T),st=phStatus(P.win,d);
      return `<a class="phase" href="${link('/reports/batches',{plan:'PH'+P.n})}"><div class="ph-top"><span>Phase ${P.n} · Module ${P.n}</span><span class="ph-h">${P.hours} h</span></div><div class="ph-t">${P.short}</div><div class="ph-w">${mY(P.win[0])} – ${mY(P.win[1])}</div>
      <div class="ph-bar"><i style="width:${d}%"></i>${st.exp!=null?`<b style="left:${st.exp}%" title="Expected by this date: ${st.exp}%"></b>`:''}</div>
      <div class="ph-s"><span>${nf(a.completed)} · ${d}%</span><span class="ph-st ${st.cls}">${st.label}</span></div><div class="ph-cum">${cum} of 25 h</div></a>`}).join('')}</div></div></section>`;}
  const a=agg(bs);
  return `<section class="pipeline"><div class="j-head"><h2>Student skill development · 15 hours in three modules</h2><div class="j-total"><b>${nf(T)}</b><span>students</span></div></div>
   <div class="ph-scroll"><div class="phases" style="grid-template-columns:repeat(3,minmax(150px,5fr)) minmax(170px,4fr);min-width:760px">${SMODS.map(M=>{const n=stuModuleDone(bs,M.n),d=pct(n,T),st=phStatus(STU.win,d);
     return `<a class="phase" href="${link('/reports/batches',{plan:'ST'})}"><div class="ph-top"><span>Module ${M.n} · Day ${M.n}</span><span class="ph-h">${M.hours} h</span></div><div class="ph-t">${M.short}</div><div class="ph-w">${mY(STU.win[0])} – ${mY(STU.win[1])}</div>
     <div class="ph-bar"><i style="width:${d}%"></i>${st.exp!=null?`<b style="left:${st.exp}%"></b>`:''}</div><div class="ph-s"><span>${nf(n)} · ${d}%</span><span class="ph-st ${st.cls}">${st.label}</span></div><div class="ph-cum">${M.n*5} of 15 h</div></a>`}).join('')}
     <a class="phase" href="${link('/reports/batches',{plan:'ST',status:'Completed'})}"><div class="ph-top"><span>Assessment</span><span class="ph-h">Pre → post</span></div><div class="ph-t">${a.pre?`${a.pre}% → ${a.post}%`:'Not yet'}</div><div class="ph-w">${a.pre?`Average gain +${a.post-a.pre} points`:'Scores appear after the first batches finish'}</div><div class="ph-s" style="margin-top:auto"><span>Digital learning access</span><span class="ph-st">${nf(a.access)}</span></div></a>
   </div></div></section>`;
}
function gantt(mode){
  const sc=schoolsInScope(), s0=D('2026-09-01'), s1=D('2028-09-01'), W=940, L=210, Rr=14, top=34, rh=30;
  const rows=[{l:'Installation',s:'1,500 classrooms · T+4',a:PO,e:INSTALL_BY,d:pct(commissioned(sc),sc.length),c:'#9AA8A3',href:link('/reports/schools'),on:true},
    ...PHASES.map(P=>({l:`Teachers · Phase ${P.n}`,s:`${P.short} · ${P.hours} h`,a:P.win[0],e:P.win[1],d:pct(agg(scoped({plan:'PH'+P.n})).completed,targetOf('teacher')),c:PH_COL[P.n-1],href:link('/reports/batches',{plan:'PH'+P.n}),on:mode==='teacher'})),
    {l:'Students · 3 modules',s:'15 h · with pre/post assessment',a:STU.win[0],e:STU.win[1],d:pct(agg(scoped({plan:'ST'})).completed,targetOf('student')),c:'var(--info)',href:link('/reports/batches',{plan:'ST'}),on:mode==='student'}];
  const H=top+rows.length*rh+34, x=d=>L+(D(d)-s0)/(s1-s0)*(W-L-Rr);
  let ticks='';for(let m=0;m<=24;m+=3){const d=new Date(s0);d.setMonth(d.getMonth()+m);if(x(iso(d))>W-40)continue;ticks+=`<line x1="${x(iso(d))}" x2="${x(iso(d))}" y1="${top-8}" y2="${H-30}" stroke="var(--line)"/><text x="${x(iso(d))+3}" y="${top-12}" font-size="11" fill="var(--muted)">${MON[d.getMonth()]} ${String(d.getFullYear()).slice(2)}</text>`}
  const body=rows.map((r,i)=>{const y=top+i*rh,w=Math.max(4,x(r.e)-x(r.a));return `<g opacity="${r.on?1:.42}"><a href="${r.href}"><text x="0" y="${y+12}" font-size="12.5" font-weight="700" fill="var(--ink)">${esc(r.l)}</text><text x="0" y="${y+25}" font-size="10.5" fill="var(--muted)">${esc(r.s)}</text>
    <rect x="${x(r.a)}" y="${y+3}" width="${w}" height="18" rx="4" fill="${r.c}" opacity=".28"><title>${esc(r.l)} · ${fd(r.a)} – ${fd(r.e)} · ${r.d}% done</title></rect><rect x="${x(r.a)}" y="${y+3}" width="${w*r.d/100}" height="18" rx="4" fill="${r.c}" pointer-events="none"/>
    <text x="${x(r.a)+w+6}" y="${y+16}" font-size="11" font-weight="700" fill="var(--ink)">${r.d}%</text></a></g>`}).join('');
  const line=(d,c,lab,dash,yo)=>`<line x1="${x(d)}" x2="${x(d)}" y1="${top-4}" y2="${H-30}" stroke="${c}" stroke-width="1.5" ${dash?`stroke-dasharray="${dash}"`:''}/><text x="${x(d)+4}" y="${H-2-(yo||0)}" font-size="11" font-weight="700" fill="${c}">${lab}</text>`;
  return `<div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" style="min-width:720px" role="img" aria-label="Programme timeline">${ticks}${body}${line(PO,'var(--muted)','PO',null,14)}${line(DEADLINE,'var(--bad)','Modules 1–3 & students due '+fd(DEADLINE),'5 3',0)}${line(iso(TODAY),'var(--ink)','As of '+fd(TODAY).slice(0,6),'2 3',14)}</svg></div>
  <p class="small muted" style="margin-top:6px">Solid fill = share of target trained. PO date assumed as ${fd(PO)}; refresher windows follow the RFP timeline (8 months after initial training, then 6 months later).</p>`;
}
function hoursDist(mode,bs){
  const T=targetOf(mode); let rows;
  if(mode==='teacher'){const c=PHASES.map(P=>agg(bs.filter(b=>b.plan==='PH'+P.n)).completed);
    rows=[['Not started · 0 h',T-c[0],'#9AA8A3',{}],['Phase 1 · 2 h',c[0]-c[1],PH_COL[0],{plan:'PH1'}],['Phases 1–2 · 10 h',c[1]-c[2],PH_COL[1],{plan:'PH2'}],['Phases 1–3 · 15 h',c[2]-c[3],PH_COL[2],{plan:'PH3'}],['Refresher I · 20 h',c[3]-c[4],PH_COL[3],{plan:'PH4'}],['All 25 h',c[4],PH_COL[4],{plan:'PH5'}]];}
  else{const m=[1,2,3].map(k=>stuModuleDone(bs,k));rows=[['Not started · 0 h',T-m[0],'#9AA8A3',{}],['Module 1 · 5 h',m[0]-m[1],'var(--accent-soft)',{plan:'ST'}],['Modules 1–2 · 10 h',m[1]-m[2],'var(--accent)',{plan:'ST'}],['All 15 h',m[2],'var(--info)',{plan:'ST',status:'Completed'}]];}
  rows.forEach(r=>r[1]=Math.max(0,r[1]));const mx=Math.max(...rows.map(r=>r[1]),1);
  return rows.map(([l,n,c,q])=>`<a class="hbar w" href="${link('/reports/batches',q)}"><span class="nm">${l}</span><span class="track"><i style="width:${n/mx*100}%;background:${c}"></i></span><span class="val">${nf(n)} <span class="muted small">${pct(n,T)}%</span></span></a>`).join('');
}
function stateRows(mode,bs){
  const rows=statesInScope().map(st=>{const ss=schools.filter(s=>s.state===st),l=bs.filter(b=>b.state===st),T=ss.length*PER_SCHOOL[mode];
    const v=mode==='teacher'?[1,2,3].map(n=>pct(agg(l.filter(b=>b.plan==='PH'+n)).completed,T)):[pct(agg(l).completed,T)];return {st,ss,c:commissioned(ss),v}}).sort((a,b)=>b.ss.length-a.ss.length);
  const cols=mode==='teacher'?PH_COL.slice(0,3):['var(--info)'];
  return rows.map(r=>`<a class="hbar w" style="grid-template-columns:170px 1fr ${mode==='teacher'?128:60}px" href="${link('/reports/schools',{state:r.st})}"><span class="nm2"><b class="small">${esc(r.st)}</b><small>${r.c}/${r.ss.length} KGBVs ready</small></span><span style="display:flex;flex-direction:column;gap:2px">${r.v.map((v,i)=>`<span class="track" style="height:${mode==='teacher'?6:10}px"><i style="width:${v}%;background:${cols[i]}"></i></span>`).join('')}</span><span class="val small">${r.v.map(v=>v+'%').join(' · ')}</span></a>`).join('')+
  `<div class="legend" style="margin-top:8px">${mode==='teacher'?[1,2,3].map(n=>`<span class="row small"><span class="sw" style="background:${PH_COL[n-1]}"></span>Phase ${n}</span>`).join(''):'<span class="row small"><span class="sw" style="background:var(--info)"></span>Completed 15 h</span>'}<span class="small muted">% of the state's ${mode==='teacher'?'teachers':'students'} trained</span></div>`;
}
function monthly(bs){
  const months=['2026-11','2026-12','2027-01','2027-02','2027-03'];
  const data=months.map(m=>{const l=bs.filter(b=>b.start.startsWith(m));const a=agg(l);return {m,n:l.length,trained:a.completed,att:a.attPct,seats:a.planned}});
  const W=640,H=236,pl=46,pr=40,pt=16,pb=38,cw=(W-pl-pr)/months.length,maxT=Math.max(50,...data.map(d=>d.seats))*1.1;
  const y=v=>pt+(H-pt-pb)*(1-v/maxT), ya=v=>pt+(H-pt-pb)*(1-v/100);
  const bars=data.map((d,i)=>{const x=pl+i*cw;return `<rect x="${x+cw*.18}" y="${y(d.seats)}" width="${cw*.3}" height="${H-pb-y(d.seats)}" rx="3" fill="var(--accent-soft)"><title>${d.m}: ${d.seats} seats scheduled</title></rect><rect x="${x+cw*.5}" y="${y(d.trained)}" width="${cw*.3}" height="${H-pb-y(d.trained)}" rx="3" fill="var(--accent)"><title>${d.m}: ${d.trained} trained</title></rect><text x="${x+cw/2}" y="${H-2}" text-anchor="middle" font-size="12" fill="var(--muted)">${MON[+d.m.slice(5)-1]} ${d.m.slice(2,4)}</text><text x="${x+cw/2}" y="${H-pb+12}" text-anchor="middle" font-size="10" fill="var(--muted)">${d.n} batches</text>`}).join('');
  const pts=data.map((d,i)=>[pl+i*cw+cw/2,ya(d.att),d]).filter(p=>p[2].att);
  const line=pts.length?`<polyline fill="none" stroke="var(--warn)" stroke-width="2.5" points="${pts.map(p=>p[0]+','+p[1]).join(' ')}"/>`+pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="var(--warn)"><title>Attendance ${p[2].att}%</title></circle>`).join(''):'';
  const grid=[0,.5,1].map(f=>`<line x1="${pl}" x2="${W-pr}" y1="${pt+(H-pt-pb)*f}" y2="${pt+(H-pt-pb)*f}" stroke="var(--line)"/><text x="${pl-6}" y="${pt+(H-pt-pb)*f+4}" text-anchor="end" font-size="10" fill="var(--muted)">${nf(Math.round(maxT*(1-f)))}</text><text x="${W-pr+6}" y="${pt+(H-pt-pb)*f+4}" font-size="10" fill="var(--warn)">${Math.round(100*(1-f))}%</text>`).join('');
  return `<div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Monthly trend">${grid}${bars}${line}</svg></div><div class="legend"><span class="row small"><span class="sw" style="background:var(--accent-soft)"></span>Seats scheduled</span><span class="row small"><span class="sw" style="background:var(--accent)"></span>Trained</span><span class="row small"><span class="sw" style="background:var(--warn)"></span>Attendance %</span></div>`;
}
function funnel(a){
  const st=[['Seats scheduled',a.planned],['Registered',a.registered],['Approved',a.approved],['Attended',a.attended],['Completed',a.completed],['Certified',a.certified]];
  return st.map(([l,n],i)=>`<a class="hbar w" href="${link(i===3?'/reports/attendance':'/reports/summary')}"><span class="nm">${l}</span><span class="track" style="justify-content:center;background:none"><i style="width:${pct(n,a.planned)}%;background:var(--accent);opacity:${1-i*.11}"></i></span><span class="val">${nf(n)} <span class="muted small">${pct(n,a.planned)}%</span></span></a>`).join('');
}
function statusBar(a,kind){
  const tot=a.byStatus.reduce((x,[,n])=>x+n,0)||1;
  return `<div class="stack-bar">${a.byStatus.filter(([,n])=>n).map(([s,n])=>`<a href="${link('/reports/batches',{status:s,kind})}" title="${s}: ${n}" style="width:${n/tot*100}%;background:${STATUS_COL[s]}"></a>`).join('')}</div>
  <div class="legend">${a.byStatus.map(([s,n])=>`<a href="${link('/reports/batches',{status:s,kind})}"><span class="sw" style="background:${STATUS_COL[s]}"></span>${s} <b>${nf(n)}</b></a>`).join('')}</div>`;
}
const kpi=(v,l,href,d,cls='')=>`<a class="kpi ${cls}" href="${href}"><span class="v">${v}</span><span class="l">${l}</span>${d?`<span class="d">${d}</span>`:''}</a>`;
const modeToggle=()=>`<div class="mode-toggle" role="group" aria-label="Show training for"><button aria-pressed="${S.mode==='teacher'}" onclick="setMode('teacher')">Teachers <span>${nf(targetOf('teacher'))}</span></button><button aria-pressed="${S.mode==='student'}" onclick="setMode('student')">Students <span>${nf(targetOf('student'))}</span></button></div>`;

/* ================= PAGES ================= */
const P={};
P['/ernet']=()=>{
  const mode=S.mode, sc=schoolsInScope(), bs=scoped({kind:mode}), a=agg(bs), T=targetOf(mode), comm=commissioned(sc);
  const cnt=s=>bs.filter(b=>b.status===s).length;
  const k= mode==='teacher'?[
    kpi(nf(T),'Teachers to train',link('/reports/summary'),`${sc.length} KGBVs · 10 per school`),
    kpi(`${comm}/${sc.length}`,'KGBVs ready for training',link('/reports/schools'),`installation due ${fd(INSTALL_BY)}`),
    kpi(nf(agg(bs.filter(b=>b.plan==='PH3')).completed),'Completed Modules 1–3',link('/reports/batches',{plan:'PH3',status:'Completed'}),`due ${fd(DEADLINE)}`),
    kpi(nf(a.hours),'Teacher-hours delivered',link('/reports/summary'),`${pct(a.hours,T*25)}% of ${nf(T*25)}`),
    kpi(nf(bs.length),'Batches',link('/reports/batches',{kind:mode}),`${nf(cnt('Completed'))} done · ${cnt('In Progress')} live · ${nf(cnt('Upcoming')+cnt('Not Started'))} planned`),
    kpi(a.attPct?a.attPct+'%':'–','Average attendance',link('/reports/attendance'),a.attPct?'':'starts with Phase 1')]
   :[kpi(nf(T),'Students to train',link('/reports/summary'),`${sc.length} KGBVs · 100 per school`),
    kpi(`${comm}/${sc.length}`,'KGBVs ready for training',link('/reports/schools'),`installation due ${fd(INSTALL_BY)}`),
    kpi(nf(a.completed),'Completed 15 hours',link('/reports/batches',{plan:'ST',status:'Completed'}),`${pct(a.completed,T)}% · due ${fd(DEADLINE)}`),
    kpi(nf(a.hours),'Student-hours delivered',link('/reports/summary'),`${pct(a.hours,T*15)}% of ${nf(T*15)}`),
    kpi(nf(a.access),'Digital learning access',link('/library',{aud:'Students'}),'self-paced modules activated'),
    kpi(a.pre?'+'+(a.post-a.pre):'–','Assessment gain (points)',link('/reports/batches',{plan:'ST',status:'Completed'}),a.pre?`pre ${a.pre}% → post ${a.post}%`:'after first batches')];
  return `<div class="page-head"><div><h1>KGBV digital classroom training</h1><p>${sc.length} KGBVs${S.state==='all'?' across 13 states':' in '+esc(S.state)} · data as of ${fd(TODAY)}. Every figure opens the report behind it.</p></div><div class="row">${modeToggle()}${exportBtns('dashboard')}</div></div>
  <div class="kpis k6">${k.join('')}</div>
  ${journey(mode,bs)}
  <section class="panel" style="margin-bottom:16px"><div class="panel-head"><h2>Programme timeline</h2><a href="${link('/reports/summary')}">Programme summary</a></div>${gantt(mode)}</section>
  <div class="grid g-main">
   <div class="stack">
    <section class="panel"><div class="panel-head"><h2>Progress by state</h2><a href="${link('/reports/schools')}">School readiness & coverage</a></div>${stateRows(mode,bs)}</section>
    <section class="panel"><div class="panel-head"><h2>Monthly trend · initial training</h2><a href="${link('/reports/batches',{kind:mode})}">Batch performance</a></div>${monthly(bs)}</section>
   </div>
   <div class="stack">
    <section class="panel"><div class="panel-head"><h2>${mode==='teacher'?'Teachers':'Students'} by hours completed</h2></div>${hoursDist(mode,bs)}</section>
    <section class="panel"><div class="panel-head"><h2>Participation funnel${mode==='teacher'?' · Phases 1–3':''}</h2><a href="${link('/reports/summary')}">Summary</a></div>${funnel(agg(bs.filter(b=>b.phase<=3)))}</section>
    <section class="panel"><div class="panel-head"><h2>Batch status</h2><a href="${link('/reports/batches',{kind:mode})}">View batches</a></div>${statusBar(a,mode)}</section>
    <section class="panel"><div class="panel-head"><h2>Content library</h2><a href="${link('/library',{aud:mode==='teacher'?'Teachers':'Students'})}">Open library</a></div>
     <div class="list">${resources.filter(r=>resAud(r)===(mode==='teacher'?'Teachers':'Students')).sort((x,y)=>y.hits-x.hits).slice(0,4).map(r=>`<a class="li" href="${link('/library',{q:r.name})}"><span><span class="li-t">${esc(r.name)}</span><br><span class="li-s">${r.type} · ${esc(resLabel(r))} · ${r.lang}</span></span><span class="small muted">${r.hits?nf(r.hits)+' opens':'Not yet used'}</span></a>`).join('')}</div></section>
   </div></div>`;
};
P['/admin']=()=>{
  const sc=schoolsInScope(), t=agg(scoped({kind:'teacher'})), s=agg(scoped({kind:'student'}));
  return `<div class="page-head"><div><h1>Platform administration</h1><p>Set-up, scheduling and data quality for the KGBV training programme · data as of ${fd(TODAY)}.</p></div>
  <div class="row"><a class="btn primary" href="#/admin/batches">Upload batches</a><a class="btn" href="#/admin/trainers">Trainer availability</a></div></div>
  <div class="kpis k6">${kpi(`${commissioned(sc)}/${sc.length}`,'KGBVs commissioned',link('/reports/schools'))}${kpi(nf(t.batches),'Teacher batches',link('/reports/batches',{kind:'teacher'}))}${kpi(nf(s.batches),'Student batches',link('/reports/batches',{kind:'student'}))}
  ${kpi(nf(scoped({flag:'late'}).length),'Batches past 1 Mar 2027',link('/reports/batches',{flag:'late'}),'','warn')}${kpi(nf(scoped({flag:'conflict'}).length),'Trainer conflicts',link('/reports/batches',{flag:'conflict'}),'','warn')}${kpi(trainers.filter(x=>x.status==='Active').length,'Active trainers','#/admin/trainers')}</div>
  <section class="panel" style="margin-bottom:16px"><div class="panel-head"><h2>Programme timeline</h2></div>${gantt('all')}</section>
  <div class="grid g2"><section class="panel"><div class="panel-head"><h2>Teacher batches</h2><a href="${link('/reports/batches',{kind:'teacher'})}">View</a></div>${statusBar(t,'teacher')}</section>
  <section class="panel"><div class="panel-head"><h2>Student batches</h2><a href="${link('/reports/batches',{kind:'student'})}">View</a></div>${statusBar(s,'student')}</section>
  <section class="panel"><div class="panel-head"><h2>Recent changes</h2><a href="#/reports/users">Audit log</a></div><div class="list">${audit.slice(0,4).map(x=>`<div class="li"><span><span class="li-t">${esc(x.field)}</span><br><span class="li-s">${esc(x.user)} · by ${esc(x.by)}</span></span><span class="small muted">${x.date.slice(5,10)}</span></div>`).join('')}</div></section>
  <section class="panel"><div class="panel-head"><h2>Training plans</h2><a href="#/admin/plans">Manage</a></div><div class="list">${plans.map(p=>`<div class="li"><span><span class="li-t">${esc(p.name)}</span><br><span class="li-s">${p.code} · ${p.days} day(s) · ${fd(p.win[0])} – ${fd(p.win[1])}</span></span>${kindChip(p.kind)}</div>`).join('')}</div></section></div>`;
};

/* ---- Reports ---- */
function reportHead(t,d,n){return `<div class="page-head"><div><h1>${t}</h1><p>${d}</p></div>${exportBtns(n)}</div>`}
P['/reports/summary']=(q)=>{
  const rows=plans.map(pl=>{const l=scoped({...q,plan:pl.id});const a=agg(l),T=targetOf(pl.kind);return {pl,a,n:l.length,T,st:phStatus(pl.win,pct(a.completed,T))}});
  return reportHead('Programme summary','MIS 1. Planned versus actual training for each teacher phase and the student programme. Select a row to see its batches.','programme-summary')+filterBar('/reports/summary',q,['state','dates'])+
  table([{h:'Participants',f:r=>kindChip(r.pl.kind)},{h:'Training',f:r=>`<b>${esc(r.pl.name)}</b>`},{h:'Hours',num:1,f:r=>r.pl.hours},{h:'Window',f:r=>fd(r.pl.win[0])+' – '+fd(r.pl.win[1])},{h:'Target',num:1,f:r=>nf(r.T)},{h:'Batches',num:1,f:r=>nf(r.n)},{h:'Seats scheduled',num:1,f:r=>nf(r.a.planned)},{h:'Registered',num:1,f:r=>nf(r.a.registered)},{h:'Attended',num:1,f:r=>nf(r.a.attended)},{h:'Completed',num:1,f:r=>nf(r.a.completed)},{h:'Certified',num:1,f:r=>nf(r.a.certified)},{h:'Attendance %',num:1,f:r=>r.a.attPct?r.a.attPct+'%':'–'},{h:'% of target',num:1,f:r=>pct(r.a.completed,r.T)+'%'},{h:'Status',f:r=>`<span class="chip ${r.st.cls}">${r.st.label}</span>`}],rows,{click:r=>`go('/reports/batches',{plan:'${r.pl.id}'})`});
};
P['/reports/schools']=(q)=>{
  let ss=schoolsInScope().filter(s=>(!q.state||s.state===q.state)&&(!q.district||s.district===q.district)&&(!q.q||(s.name+s.udise).toLowerCase().includes(q.q.toLowerCase())));
  const ready=s=>s.commission<=iso(TODAY);
  if(q.ready==='yes')ss=ss.filter(ready);if(q.ready==='no')ss=ss.filter(s=>!ready(s));if(q.ready==='late')ss=ss.filter(s=>s.commission>=INSTALL_BY);
  const tb=s=>batches.filter(b=>b.schools.includes(s.id));
  const per=(s,plan)=>{const b=tb(s).find(x=>x.plan===plan);if(!b)return '–';if(b.status==='Completed')return `<span class="chip good">${plan==='ST'?b.completed:Math.round(b.completed/b.schools.length)}</span>`;if(b.status==='In Progress')return '<span class="chip acc">Live</span>';return `<span class="small muted">${fd(b.start).slice(0,6)}</span>`};
  const pg=paged(ss,q);
  return reportHead('School readiness & coverage','Each KGBV with its commissioning date and training coverage. Training can start only after the school is commissioned.','school-coverage')+
  `<div class="filters">${S.state==='all'?`<div class="f"><label>State</label><select onchange="fset('state',this.value)">${selOpts(statesInScope(),q.state,'All states')}</select></div>`:''}<div class="f"><label>District</label><select onchange="fset('district',this.value)">${selOpts((q.state||S.state)!=='all'&&(q.state||S.state)?stBy(q.state||S.state)[5]:[],q.district,'All districts')}</select></div><div class="f"><label>Commissioning</label><select onchange="fset('ready',this.value)">${selOpts([['yes','Commissioned'],['no','Not yet commissioned'],['late','After 1 Jan 2027 deadline']],q.ready,'All')}</select></div><div class="f"><label>Search</label><input type="search" value="${esc(q.q||'')}" placeholder="School or UDISE" onchange="fset('q',this.value)"></div><button class="btn sm" onclick="go('/reports/schools')">Clear filters</button></div>`+
  (window._fp={path:'/reports/schools',params:q},'')+
  `<p class="small muted" style="margin-bottom:8px">${nf(ss.length)} KGBVs · ${nf(ss.filter(ready).length)} commissioned. Teacher columns show teachers trained per school, or the scheduled date.</p>`+
  table([{h:'KGBV',f:s=>`<b>${esc(s.name)}</b><br><span class="small muted">UDISE ${s.udise}</span>`},{h:'District, state',f:s=>`${esc(s.district)}, ${esc(s.state)}`},{h:'Commissioned',f:s=>ready(s)?fd(s.commission):`<span class="chip ${s.commission>=INSTALL_BY?'bad':'warn'}">Due ${fd(s.commission)}</span>`},
   ...PHASES.slice(0,3).map(P=>({h:`Phase ${P.n}`,f:s=>per(s,'PH'+P.n)})),{h:'Students',f:s=>per(s,'ST')},{h:'Content language',f:s=>s.lang}],pg.rows)+pg.pager;
};
P['/reports/batches']=(q)=>{
  const bs=scoped(q).sort((a,b)=>a.start<b.start?-1:1), pg=paged(bs,q);
  return reportHead('Batch performance','MIS 2. One row per batch. Teacher batches group up to three nearby KGBVs; student batches run at each KGBV. Select a batch for participants and attendance.','batch-performance')+filterBar('/reports/batches',q,['state','district','plan','status','trainer','flag','dates','q'])+
  `<p class="small muted" style="margin-bottom:8px">${nf(bs.length)} batches</p>`+
  table([{h:'Batch',f:b=>`<b>${b.id}</b>`},{h:'Participants',f:b=>kindChip(b.kind)},{h:'Training',f:b=>esc(planBy(b.plan).name)},{h:'KGBV(s)',f:b=>`${esc(b.school)}<br><span class="small muted">${b.district}, ${b.state}</span>`},{h:'Trainer',f:b=>esc(trainerBy(b.trainer).name)+(b.trainerConflict?' <span class="chip bad">Unavailable</span>':'')},{h:'Start',f:b=>fd(b.start)+(b.late?' <span class="chip warn">Past deadline</span>':'')},{h:'End',f:b=>fd(b.end)},{h:'Capacity',num:1,f:b=>b.cap},{h:'Registered',num:1,f:b=>b.registered},{h:'Attended',num:1,f:b=>b.attended},{h:'Completed',num:1,f:b=>b.completed},{h:'Attendance %',num:1,f:b=>b.attended?`<span style="color:${b.attPct<75?'var(--bad)':'inherit'}">${b.attPct}%</span>`:'–'},{h:'Status',f:b=>statusChip(b.status)}],pg.rows,{click:b=>`batchDetail('${b.id}')`})+pg.pager;
};
function batchDetail(id){
  const b=batches.find(x=>x.id===id), plan=planBy(b.plan), list=trainees(b), days=Array.from({length:plan.days},(_,i)=>i), stu=b.kind==='student';
  openDlg(`Batch ${b.id}`,`<div class="grid g3" style="margin-bottom:14px">
   <div><div class="small muted">KGBV(s)</div><b>${b.schools.map(s=>esc(schoolBy(s).name)).join(', ')}</b><div class="small muted">${b.district}, ${b.state}</div></div>
   <div><div class="small muted">Training</div><b>${esc(plan.name)}</b><div class="small muted">${fd(b.start)} – ${fd(b.end)} · ${plan.hours} h</div></div>
   <div><div class="small muted">Trainer</div><b>${esc(trainerBy(b.trainer).name)}</b><div class="small muted">${b.trainer} · ${statusChip(b.status)}</div></div></div>
   <div class="kpis"><div class="kpi"><span class="v">${b.registered}/${b.cap}</span><span class="l">Registered</span></div><div class="kpi"><span class="v">${b.attended?b.attPct+'%':'–'}</span><span class="l">Attendance</span></div><div class="kpi"><span class="v">${b.completed}</span><span class="l">Completed</span></div>${stu?`<div class="kpi"><span class="v">${b.pre?b.pre+'→'+b.post:'–'}</span><span class="l">Pre → post score</span></div>`:`<div class="kpi"><span class="v">${b.certified}</span><span class="l">Certified</span></div>`}</div>
   <h3 style="margin:6px 0 8px">${stu?'Students':'Teachers'} and attendance</h3><p class="small muted" style="margin-bottom:8px">${stu?'Students are minors: only initials and IDs are shown.':'Names and mobile numbers are masked in reports.'}</p>
   ${list.length?`<div class="table-wrap att-grid"><table><thead><tr><th>ID</th><th>${stu?'Student':'Teacher'}</th>${stu?'<th>Class</th>':'<th>Mobile</th>'}<th>KGBV</th>${days.map(d=>`<th>Day ${d+1}</th>`).join('')}${stu?'<th>Pre</th><th>Post</th>':''}<th>Status</th></tr></thead><tbody>${list.map(t=>`<tr><td>${t.uid}</td><td>${esc(t.masked)}</td><td>${stu?t.grade:t.mobile}</td><td class="small">${esc(t.school)}</td>${days.map(d=>{const v=t.att[d];return `<td class="${v==='P'?'p':v==='A'?'a':''}">${v||'·'}</td>`}).join('')}${stu?`<td>${t.pre??'–'}</td><td>${t.post??'–'}</td>`:''}<td>${statusChip(t.status)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No participants registered yet.</div>'}`);
}
P['/reports/attendance']=(q)=>{
  const bs=scoped(q).filter(b=>b.attended>0).sort((a,b)=>a.attPct-b.attPct);
  if(!bs.length)return reportHead('Attendance report','MIS 3. Batch and participant attendance with exception flags.','attendance')+filterBar('/reports/attendance',q,['state','plan','trainer'])+`<div class="panel empty">No attendance recorded yet. Attendance appears here once training begins on ${fd(PHASES[0].win[0])}.</div>`;
  const b=batches.find(x=>x.id===q.batch)||bs[0], list=trainees(b).filter(t=>t.approved);
  const flags=t=>{const f=[];if(!t.att.length)f.push(['No attendance recorded','warn']);else{if(t.present/t.att.length<.75)f.push(['Below 75%','bad']);if(t.att.join('').includes('AA'))f.push(['Consecutive absence','bad'])}return f};
  const pg=paged(bs,q,50);
  return reportHead('Attendance report','MIS 3. Batches with the lowest attendance first, and participant detail for the selected batch.','attendance')+filterBar('/reports/attendance',q,['state','plan','trainer'])+
  `<div class="grid g2" style="margin-bottom:16px"><section class="panel"><div class="panel-head"><h2>Batches with attendance</h2><span class="small muted">${nf(bs.length)}</span></div><div style="max-height:380px;overflow:auto">${table([{h:'Batch',f:x=>`<b>${x.id}</b>`},{h:'Participants',f:x=>kindChip(x.kind)},{h:'Attendance',num:1,f:x=>`<span style="color:${x.attPct<75?'var(--bad)':'inherit'}">${x.attPct}%</span>`},{h:'Updated',f:x=>x.attUpdated?'<span class="chip good">Yes</span>':'<span class="chip warn">Not updated</span>'}],pg.rows,{click:x=>`fset('batch','${x.id}')`})}</div>${pg.pager}</section>
  <section class="panel"><div class="panel-head"><h2>Batch ${b.id}</h2><a href="javascript:batchDetail('${b.id}')">Day-wise grid</a></div><p class="small muted">${esc(b.school)} · ${esc(planBy(b.plan).name)}</p><div class="kpis" style="margin-top:12px"><div class="kpi"><span class="v">${b.attPct}%</span><span class="l">Average attendance</span></div><div class="kpi"><span class="v">${list.filter(t=>flags(t).length).length}</span><span class="l">Participants flagged</span></div></div></section></div>`+
  table([{h:'Participant',f:t=>esc(t.masked)+' <span class="small muted">'+t.uid+'</span>'},{h:'KGBV',f:t=>esc(t.school)},{h:'Total days',num:1,f:()=>planBy(b.plan).days},{h:'Days present',num:1,f:t=>t.present},{h:'Attendance %',num:1,f:t=>t.att.length?pct(t.present,t.att.length)+'%':'–'},{h:'Flags',f:t=>flags(t).map(([x,c])=>`<span class="chip ${c}">${x}</span>`).join(' ')||'<span class="chip good">On track</span>'}],list);
};
P['/reports/trainers']=(q)=>{
  const ts=trainers.filter(t=>(S.state==='all'||t.state===S.state)&&(!q.state||t.state===q.state));
  const rows=ts.map(t=>{const asg=batches.filter(b=>b.trainer===t.code),fut=asg.filter(b=>b.status!=='Completed'&&b.phase<=3);const win=t.avail.find(([f,e])=>D(e)>=TODAY);return {t,asg,fut,win,days:fut.reduce((a,b)=>a+planBy(b.plan).days,0)}});
  const months=['2026-11','2026-12','2027-01','2027-02'];
  const need=months.map(m=>{const l=batches.filter(b=>(S.state==='all'||b.state===S.state)&&b.start.startsWith(m));const days=l.reduce((a,b)=>a+planBy(b.plan).days,0);const req=Math.ceil(days/22);const av=ts.filter(t=>t.status==='Active'&&t.avail.some(([f,e])=>f.slice(0,7)<=m&&e.slice(0,7)>=m)).length;return {m,req,av}});
  const mx=Math.max(...need.map(n=>Math.max(n.req,n.av)),1);
  return reportHead('Trainer availability','MIS 4. Available trainers against the training days scheduled for the initial training window.','trainer-availability')+filterBar('/reports/trainers',q,['state'])+
  `<section class="panel" style="margin-bottom:16px"><div class="panel-head"><h2>Available vs required trainers</h2><span class="small muted">Required = training days that month ÷ 22 working days</span></div>
  ${need.map(n=>`<div class="hbar" style="grid-template-columns:90px 1fr 150px"><span class="nm">${MON[+n.m.slice(5)-1]} ${n.m.slice(0,4)}</span><span style="display:flex;flex-direction:column;gap:3px"><span class="track"><i style="width:${n.av/mx*100}%;background:var(--accent)"></i></span><span class="track"><i style="width:${n.req/mx*100}%;background:${n.req>n.av?'var(--bad)':'var(--warn)'}"></i></span></span><span class="val">${n.av} available / ${n.req} required</span></div>`).join('')}
  <div class="legend" style="margin-top:6px"><span class="row small"><span class="sw" style="background:var(--accent)"></span>Available</span><span class="row small"><span class="sw" style="background:var(--warn)"></span>Required (red when short)</span></div></section>`+
  table([{h:'Trainer',f:r=>`<b>${esc(r.t.name)}</b><br><span class="small muted">${r.t.code} · ${r.t.kind}</span>`},{h:'State',f:r=>r.t.state},{h:'Available from',f:r=>r.win?fd(r.win[0]):'–'},{h:'Available to',f:r=>r.win?fd(r.win[1]):'<span class="chip bad">None</span>'},{h:'Assigned batches',num:1,f:r=>nf(r.asg.length)},{h:'Initial-training days ahead',num:1,f:r=>r.days},{h:'Status',f:r=>`<span class="chip ${r.t.status==='Inactive'?'bad':'acc'}">${r.t.status}</span>`}],rows,{click:r=>`go('/reports/batches',{trainer:'${r.t.code}'})`});
};
P['/reports/resources']=(q)=>{
  const list=resources.filter(r=>(!q.aud||resAud(r)===q.aud)).sort((a,b)=>b.hits-a.hits);
  window._fp={path:'/reports/resources',params:q};
  return reportHead('Resource usage','MIS 6. Which training materials and learning resources are being used.','resource-usage')+`<div class="filters"><div class="f"><label>Audience</label><select onchange="fset('aud',this.value)">${selOpts(['Teachers','Students'],q.aud,'All')}</select></div></div>`+
  table([{h:'Audience',f:r=>resAud(r)==='Students'?kindChip('student'):kindChip('teacher')},{h:'Resource',f:r=>`<b>${esc(r.name)}</b>`},{h:'Training',f:r=>esc(resLabel(r))},{h:'Type',f:r=>r.type},{h:'Language',f:r=>r.lang},{h:'Uploaded',f:r=>fd(r.date)},{h:'Users accessing',num:1,f:r=>nf(r.users)},{h:'Accesses',num:1,f:r=>nf(r.hits)},{h:'Last accessed',f:r=>r.last?fd(r.last):'<span class="chip">Not yet used</span>'}],list,{click:r=>`go('/library',{q:'${esc(r.name).replace(/'/g,"\\'")}'})`});
};
P['/reports/users']=()=>{
  const t=agg(scoped({kind:'teacher'})),s=agg(scoped({kind:'student'}));
  return reportHead('Users, logins and profile audit','MIS 5, 7 and 8. User lifecycle, login activity and changes to profile data. Sensitive values stay masked.','user-audit')+
  `<div class="kpis k6">${kpi(nf(7500+30+750),'Registered users',link('/reports/users'),'teachers, trainers, KGBV admins')}${kpi(nf(t.attended),'Active teachers','#/reports/users')}${kpi(nf(s.access),'Student learning accounts','#/reports/users')}${kpi('1,240','Logins this month','#/reports/users')}${kpi('38','Failed login attempts','#/reports/users')}${kpi('97.8%','OTP verification success','#/reports/users')}</div>`+
  `<h2 style="margin:6px 0 10px">Profile change audit</h2>`+table([{h:'Date',f:x=>x.date},{h:'User',f:x=>esc(x.user)},{h:'Field changed',f:x=>esc(x.field)},{h:'Old value',f:x=>esc(x.old)},{h:'New value',f:x=>esc(x.nw)},{h:'Changed by',f:x=>esc(x.by)}],audit);
};

/* ---- Content library ---- */
function teacherBatches(){return batches.filter(b=>b.persona&&b.kind==='teacher').sort((a,b)=>a.phase-b.phase)}
P['/library']=(q)=>{
  let list=resources.slice(), unlock=null;
  if(S.role==='teacher'){const tb=teacherBatches();list=list.filter(r=>resAud(r)==='Teachers');unlock=r=>{const b=tb.find(x=>x.plan===r.plan);return b?iso(addDays(D(b.start),r.day-1)):null}}
  list=list.filter(r=>(!q.type||r.type===q.type)&&(!q.aud||resAud(r)===q.aud)&&(!q.plan||r.plan===q.plan)&&(!q.lang||r.lang===q.lang)&&(!q.q||r.name.toLowerCase().includes(q.q.toLowerCase())));
  window._fp={path:'/library',params:q};
  const langs=[...new Set(resources.map(r=>r.lang))];
  return `<div class="page-head"><div><h1>${S.role==='teacher'?'Learning resources':'Content library'}</h1><p>${S.role==='teacher'?'Materials for your training. Each item unlocks on its training day and stays available afterwards.':'Training materials and user manuals for teachers, student learning resources and assessment forms, in English and state languages.'}</p></div>${S.role==='admin'||S.role==='trainer'?'<a class="btn primary" href="#/resource/upload">Upload resource</a>':''}</div>
  <div class="tabs">${[['','All'],['PPT','Presentations'],['PDF','Manuals & PDFs'],['Video','Videos'],['Form','Forms'],['Other','Other']].map(([v,l])=>`<a href="${link('/library',{...q,type:v})}" class="${(q.type||'')===v?'on':''}">${l}</a>`).join('')}</div>
  <div class="filters"><div class="f"><label>Search</label><input type="search" value="${esc(q.q||'')}" placeholder="Resource name" onchange="fset('q',this.value)"></div>
  ${S.role==='teacher'?'':`<div class="f"><label>Audience</label><select onchange="fset('aud',this.value)">${selOpts(['Teachers','Students'],q.aud,'All')}</select></div><div class="f"><label>Training</label><select onchange="fset('plan',this.value)">${selOpts(planOpts(),q.plan,'All training')}</select></div>`}
  <div class="f"><label>Language</label><select onchange="fset('lang',this.value)">${selOpts(langs,q.lang,'All languages')}</select></div><button class="btn sm" onclick="go('/library')">Clear filters</button></div>
  ${list.length?`<div class="lib">${list.map(r=>{const u=unlock&&unlock(r),locked=u&&u>iso(TODAY);return `<article class="res ${locked?'locked':''}"><div class="row" style="justify-content:space-between;align-items:flex-start"><div class="ty ${r.type}">${r.type==='Video'?'▶':r.type}</div>${resAud(r)==='Students'?kindChip('student'):kindChip('teacher')}</div>
  <h3>${esc(r.name)}</h3><div class="meta">${esc(resLabel(r))} · Day ${r.day} · ${r.lang}<br>${r.size} · uploaded ${fd(r.date)} by ${esc(r.by)}</div>${S.role!=='teacher'?`<div class="meta">${r.users?nf(r.users)+' users · '+nf(r.hits)+' opens':'Not yet used'}</div>`:''}
  <div class="row" style="margin-top:auto">${locked?`<span class="chip">Unlocks ${fd(u)}</span>`:`<button class="btn sm primary" onclick="openRes('${r.id}')">${r.type==='Form'?'Open form':r.type==='Video'?'Play':'Open'}</button>`}</div></article>`}).join('')}</div>`:'<div class="panel empty">No resources match these filters.</div>'}`;
};
const resourceFormKey="tt-demo-resource-form-submissions";
function getResourceFormSubmissions(){try{return JSON.parse(localStorage.getItem(resourceFormKey)||"{}")}catch(e){return {}}}
function resPageContent(r,page){const pages=[{title:"Prepare the learning space",body:"<p>Before the session, check the device, projector and room layout. Arrange seating so every participant can see the demonstration and practise in pairs.</p><h3>Quick readiness check</h3><ul><li>Charge the device and confirm the network connection.</li><li>Open the digital teaching application and verify the display.</li><li>Keep the lesson plan and participant activity sheet ready.</li></ul>"},{title:"Model, practise and reflect",body:"<p>Demonstrate one teaching task at a time. Ask participants to repeat each step, then apply it to a classroom activity they already teach.</p><h3>Facilitator notes</h3><ol><li>Model the task slowly and explain the teaching purpose.</li><li>Give each participant time for hands-on practice.</li><li>Invite a pair to share what worked and what they would adjust.</li></ol>"},{title:"Take it into the classroom",body:"<p>Choose a short lesson for the next school day. Set one learning objective, select a suitable digital resource and note how students will participate.</p><div class='doc-callout'><b>Reflection prompt</b><p>What did learners do, and what evidence will show that the activity supported the lesson objective?</p></div><p class='doc-muted'>Sample learning material · Teacher Training Tracker demo</p>"}];return pages[page-1]}
function resPdfHtml(r){window._resourcePreview={id:r.id,page:1,zoom:false};return "<div class='resource-toolbar'><span class='preview-tag'>PDF · "+esc(r.lang)+" · SAMPLE DOCUMENT</span><div><button class='btn sm' onclick='resZoom()' id='resZoomBtn'>Zoom in</button> <button class='btn sm' onclick='resPrint()'>Print</button></div></div><div id='resDocPaper' class='doc-paper'><div class='doc-kicker'>TEACHER TRAINING TRACKER · LEARNING RESOURCE</div><h2 id='resDocTitle'></h2><div id='resDocBody'></div><div class='doc-footer'><span>Training resource · Sample content</span><span id='resDocPageLabel'></span></div></div><div class='doc-pagination'><button class='btn sm' onclick='resDocTurn(-1)' id='resDocPrev'>← Previous</button><span id='resDocCount'></span><button class='btn sm' onclick='resDocTurn(1)' id='resDocNext'>Next →</button></div>"}
function renderResPdf(){const v=window._resourcePreview,r=resources.find(x=>x.id===v.id),p=resPageContent(r,v.page);document.getElementById("resDocTitle").textContent=p.title;document.getElementById("resDocBody").innerHTML=p.body;document.getElementById("resDocPageLabel").textContent="Page "+v.page;document.getElementById("resDocCount").textContent="Page "+v.page+" of 3";document.getElementById("resDocPrev").disabled=v.page===1;document.getElementById("resDocNext").disabled=v.page===3}
function resDocTurn(n){const v=window._resourcePreview;v.page=Math.max(1,Math.min(3,v.page+n));renderResPdf()}
function resZoom(){const paper=document.getElementById("resDocPaper");const v=window._resourcePreview;v.zoom=!v.zoom;paper.classList.toggle("zoomed",v.zoom);document.getElementById("resZoomBtn").textContent=v.zoom?"Fit page":"Zoom in"}
function resPrint(){window.print()}
function resVideoHtml(r){window._resourcePreview={id:r.id,seconds:0,duration:150,playing:false,timer:null};return "<div class='video-preview'><div class='video-stage' id='resVideoStage'><div class='video-sun'></div><div class='video-board'><span>FIELD TRAINING · DEMO CLIP</span><b>Learn by seeing.<br>Grow by doing.</b><small>"+esc(r.name)+"</small></div><button class='video-play' id='resVideoPlay' onclick='resVideoToggle()' aria-label='Play demo video'>▶</button><div class='video-caption' id='resVideoCaption'>Welcome. In this sample clip, we will explore a practical classroom activity.</div></div><div class='video-controls'><button class='video-control' onclick='resVideoToggle()' id='resVideoToggle' aria-label='Play or pause'>▶</button><span id='resVideoTime'>0:00 / 2:30</span><input aria-label='Video position' id='resVideoSeek' type='range' min='0' max='150' value='0' oninput='resVideoSeek(this.value)'><button class='btn sm' onclick='resVideoRestart()'>Restart</button></div><p class='video-demo-note'>Interactive sample player · Demo playback uses an animated preview and does not require a video file.</p><details class='transcript'><summary>View sample transcript</summary><p>Introduce the activity. Model the steps. Invite participants to practise in pairs. Close with a short reflection on how learners can use the skill.</p></details></div>"}
function resTime(t){return Math.floor(t/60)+":"+String(t%60).padStart(2,"0")}
function resVideoRender(){const v=window._resourcePreview;if(!v)return;document.getElementById("resVideoTime").textContent=resTime(v.seconds)+" / "+resTime(v.duration);document.getElementById("resVideoSeek").value=v.seconds;document.getElementById("resVideoToggle").textContent=v.playing?"Ⅱ":"▶";document.getElementById("resVideoPlay").style.opacity=v.playing?"0":"1";document.getElementById("resVideoStage").classList.toggle("playing",v.playing);const cap=v.seconds<35?"Welcome. In this sample clip, we will explore a practical classroom activity.":v.seconds<90?"Watch the facilitator model the steps, then pause and practise with a partner.":"Reflect: how could you adapt this activity for your next lesson?";document.getElementById("resVideoCaption").textContent=cap}
function resVideoToggle(){const v=window._resourcePreview;if(!v)return;v.playing=!v.playing;if(v.timer)clearInterval(v.timer);if(v.playing)v.timer=setInterval(()=>{if(!window._resourcePreview)return;const s=window._resourcePreview;s.seconds=Math.min(s.duration,s.seconds+1);if(s.seconds>=s.duration){s.playing=false;clearInterval(s.timer)}resVideoRender()},1000);resVideoRender()}
function resVideoSeek(value){const v=window._resourcePreview;if(!v)return;v.seconds=Number(value)||0;resVideoRender()}
function resVideoRestart(){const v=window._resourcePreview;if(!v)return;if(v.timer)clearInterval(v.timer);v.seconds=0;v.playing=false;resVideoRender()}
function resFormQuestions(r){return r.name.toLowerCase().includes("feedback")?[{label:"Which part of the session was most useful?",options:["Facilitator demonstration","Hands-on practice","Group discussion","Planning a classroom activity"]},{label:"How confident do you feel trying this in class?",options:["Very confident","Mostly confident","Still practising","I need more support"]}]:[{label:"Which approach best supports active learning with a digital resource?",options:["Learners explore and discuss the content","The device is used only to display notes","Only the facilitator interacts with the resource","Skip reflection after the activity"]},{label:"What is a useful first step before a classroom activity?",options:["Check the learning objective and resource","Start playback without planning","Ask learners to wait until the end","Avoid checking the device"]}]}
function resFormHtml(r){const old=getResourceFormSubmissions()[r.id+":"+S.role],qs=resFormQuestions(r);if(old)return "<div class='form-success'><div class='success-icon'>✓</div><h3>Response saved</h3><p>Your sample response was saved on this device on "+esc(old.date)+".</p><button class='btn' onclick='resFormReset()'>Start another response</button></div>";return "<div class='form-intro'><span class='preview-tag'>DEMO FORM · "+esc(r.lang)+"</span><p>This sample form is interactive. Required questions are marked; no score or certification decision is generated.</p></div><form id='resourceDemoForm' onsubmit='return resFormSubmit(event,"+JSON.stringify(r.id)+")'>"+qs.map((q,i)=>"<fieldset class='resource-question' data-question='"+i+"'><legend>"+(i+1)+". "+esc(q.label)+" <span>*</span></legend>"+q.options.map((o,j)=>"<label class='resource-option'><input required type='radio' name='response"+i+"' value='"+esc(o)+"'><span>"+esc(o)+"</span></label>").join("")+"<div class='resource-field-error' hidden>Select one answer to continue.</div></fieldset>").join("")+"<label class='resource-comment-label' for='resourceComment'>Anything else you would like to share? <span>Optional</span></label><textarea id='resourceComment' class='resource-comment' rows='3' maxlength='500' placeholder='Write a short note…'></textarea><div class='resource-form-actions'><span class='doc-muted'>Your response stays in this browser demo.</span><button class='btn primary' type='submit'>Submit response</button></div></form>"}
function resFormSubmit(event,id){event.preventDefault();const form=event.currentTarget,groups=[...form.querySelectorAll(".resource-question")];let valid=true;groups.forEach(g=>{const ok=!!g.querySelector("input:checked");g.querySelector(".resource-field-error").hidden=ok;valid=valid&&ok});if(!valid){const first=groups.find(g=>!g.querySelector("input:checked"));if(first)first.scrollIntoView({block:"center",behavior:"smooth"});return false}const submission={date:new Date().toLocaleString(),answers:groups.map(g=>g.querySelector("input:checked").value),comment:document.getElementById("resourceComment").value.trim()};const all=getResourceFormSubmissions();all[id+":"+S.role]=submission;try{localStorage.setItem(resourceFormKey,JSON.stringify(all))}catch(e){toast("Response could not be saved in this browser.");return false}document.getElementById("dlgB").innerHTML=resFormHtml(resources.find(r=>r.id===id));return false}
function resFormReset(){const all=getResourceFormSubmissions();delete all[window._resourcePreview.id+":"+S.role];try{localStorage.setItem(resourceFormKey,JSON.stringify(all))}catch(e){};document.getElementById("dlgB").innerHTML=resFormHtml(resources.find(r=>r.id===window._resourcePreview.id))}
function resSlidesHtml(r){window._resourcePreview={id:r.id,slide:1};return "<div class='slide-deck'><div class='slide-canvas' id='resSlideCanvas'></div><div class='doc-pagination'><button class='btn sm' id='resSlidePrev' onclick='resSlideTurn(-1)'>← Previous</button><span id='resSlideCount'></span><button class='btn sm' id='resSlideNext' onclick='resSlideTurn(1)'>Next →</button></div><p class='doc-muted'>Sample slides · presentation controls are interactive.</p></div>"}
function resSlideTurn(n){const v=window._resourcePreview;v.slide=Math.max(1,Math.min(4,v.slide+n));renderResSlide()}
function renderResSlide(){const v=window._resourcePreview;const slides=[{eyebrow:"START WITH A LEARNING GOAL",title:"Make every digital moment count",body:"Connect the tool to what learners should understand or practise."},{eyebrow:"MODEL THE TASK",title:"Show one step at a time",body:"Think aloud, demonstrate clearly and check that everyone can follow."},{eyebrow:"PRACTISE TOGETHER",title:"Give learners the lead",body:"Try the activity in pairs, ask questions and share discoveries."},{eyebrow:"REFLECT AND ADAPT",title:"Carry learning into class",body:"Notice what worked and adapt the next activity to your learners."}];const s=slides[v.slide-1];document.getElementById("resSlideCanvas").innerHTML="<span>"+s.eyebrow+"</span><h2>"+s.title+"</h2><p>"+s.body+"</p><div class='slide-number'>0"+v.slide+" <i>/ 04</i></div>";document.getElementById("resSlideCount").textContent="Slide "+v.slide+" of 4";document.getElementById("resSlidePrev").disabled=v.slide===1;document.getElementById("resSlideNext").disabled=v.slide===4}
function resOtherHtml(r){return "<div class='package-preview'><span class='preview-tag'>INTERACTIVE LEARNING PACKAGE · SAMPLE</span><h2>Explore a classroom activity</h2><p>Choose a step to preview a simple digital learning activity.</p><div class='package-steps'><button class='package-step active' onclick='resPackageStep(1,this)'>1 <span>Explore</span></button><button class='package-step' onclick='resPackageStep(2,this)'>2 <span>Discuss</span></button><button class='package-step' onclick='resPackageStep(3,this)'>3 <span>Create</span></button></div><div id='resPackageContent' class='package-content'><b>Explore</b><p>Look closely at a picture, short clip or local example. What do you notice?</p></div><p class='doc-muted'>"+esc(r.name)+" · "+esc(r.lang)+" · demo package</p></div>"}
function resPackageStep(step,button){document.querySelectorAll(".package-step").forEach(x=>x.classList.remove("active"));button.classList.add("active");const data={1:["Explore","Look closely at a picture, short clip or local example. What do you notice?"],2:["Discuss","Share observations with a partner. Which details support your ideas?"],3:["Create","Make a short response using a drawing, sentence or simple presentation."]}[step];document.getElementById("resPackageContent").innerHTML="<b>"+data[0]+"</b><p>"+data[1]+"</p>"}
function openRes(id){const r=resources.find(x=>x.id===id);if(!r){toast("That learning resource is no longer available.");return}r.hits++;r.last=iso(TODAY);window._resourcePreview={id:r.id};let body="";if(r.type==="PDF")body=resPdfHtml(r);else if(r.type==="Video")body=resVideoHtml(r);else if(r.type==="Form")body=resFormHtml(r);else if(r.type==="PPT")body=resSlidesHtml(r);else body=resOtherHtml(r);openDlg(r.name,body);if(r.type==="PDF")renderResPdf();if(r.type==="PPT")renderResSlide()}
document.addEventListener("close",event=>{if(event.target&&event.target.id==="dlg"&&window._resourcePreview&&window._resourcePreview.timer)clearInterval(window._resourcePreview.timer)},true);
/* ---- Admin ---- */
P['/admin/projects']=()=>`<div class="page-head"><div><h1>Project</h1><p>All training plans, batches and reports belong to this project. Users with one project don't need to choose it.</p></div></div>
 <div class="grid g2"><section class="panel"><h2 style="margin-bottom:12px">${PROJECT.name}</h2><div class="list">
  <div class="li"><span class="li-s">Project code</span><b>${PROJECT.code}</b></div><div class="li"><span class="li-s">Purchase order date</span><span>${fd(PO)} <span class="chip warn">Assumed</span></span></div>
  <div class="li"><span class="li-s">Installation & commissioning due</span><span>${fd(INSTALL_BY)} (T+4)</span></div><div class="li"><span class="li-s">Modules 1–3 and student training due</span><span>${fd(DEADLINE)} (T+6)</span></div>
  <div class="li"><span class="li-s">Scope</span><span>750 KGBVs · 13 states · 1,500 digital classrooms</span></div><div class="li"><span class="li-s">Training targets</span><span>7,500 teachers × 25 h · 75,000 students × 15 h</span></div>
  <div class="li"><span class="li-s">Project end</span><span>${fd(PROJECT.end)}</span></div></div></section>
 <section class="panel"><h2 style="margin-bottom:12px">Schools by state</h2>${table([{h:'State',f:s=>s[0]},{h:'KGBVs',num:1,f:s=>s[1]},{h:'Teachers',num:1,f:s=>nf(s[1]*10)},{h:'Students',num:1,f:s=>nf(s[1]*100)},{h:'Content language',f:s=>s[4]}],STATES)}</section></div>`;
P['/admin/plans']=()=>`<div class="page-head"><div><h1>Training plans</h1><p>Five teacher phases (25 hours) and the student programme (15 hours). Each plan sets its days, hours per day, window and the resources linked to each day.</p></div></div>`+
 table([{h:'Code',f:p=>`<b>${p.code}</b>`},{h:'Participants',f:p=>kindChip(p.kind)},{h:'Training plan',f:p=>esc(p.name)},{h:'Hours',num:1,f:p=>p.hours},{h:'Days',num:1,f:p=>p.days},{h:'Hours per day',f:p=>p.hpd.join(' + ')},{h:'Window',f:p=>fd(p.win[0])+' – '+fd(p.win[1])},{h:'Batches',num:1,f:p=>nf(batches.filter(b=>b.plan===p.id).length)},{h:'Change control',f:p=>batches.some(b=>b.plan===p.id&&b.status!=='Not Started')?'<span class="chip warn">In use · edits audited</span>':'<span class="chip">Editable</span>'}],[...plans,...S.extra.plans],{click:p=>`planDetail('${p.id}')`})+
 `<section class="panel" style="margin-top:16px"><h2 style="margin-bottom:14px">Edit day-wise plan</h2><div class="form">
  <div class="field"><label for="tpSel">Training plan</label><select id="tpSel" onchange="tpRender()">${selOpts(planOpts(),'PH2')}</select></div>
  <div class="field"><label for="tpHrs">Total hours</label><input id="tpHrs" readonly><span class="msg"></span></div>
  <div class="full" id="tpBox"></div></div><div class="actions"><button class="btn primary" onclick="tpSave()">Save plan</button></div></section>`;
function planDetail(id){const p=planBy(id);document.getElementById('tpSel').value=id;tpRender();document.getElementById('tpSel').scrollIntoView({behavior:'smooth',block:'center'})}
function tpRender(){const p=planBy(tpSel.value),opts=id=>resources.filter(r=>r.plan===p.id).map(r=>`<option ${r.day===id+1?'selected':''}>${r.type} · ${esc(r.name)} (${r.lang})</option>`).join('');
  document.getElementById('tpBox').innerHTML=`<div class="table-wrap"><table><thead><tr><th>Day</th><th>Activity</th><th>Hours</th><th>Linked resources / forms</th></tr></thead><tbody>${p.schedule.map((s,i)=>`<tr><td><b>Day ${i+1}</b></td><td><input style="border:1px solid var(--line);border-radius:6px;padding:6px;min-width:300px;background:var(--surface)" value="${esc(s)}"></td><td><input class="tpH" type="number" min="0.5" step="0.5" value="${p.hpd[i]}" oninput="tpSum()" style="width:70px;border:1px solid var(--line);border-radius:6px;padding:6px;background:var(--surface)"></td><td><select multiple size="3" style="min-width:300px;border:1px solid var(--line);border-radius:6px;background:var(--surface)">${opts(i)}</select></td></tr>`).join('')}</tbody></table></div>`;tpSum()}
function tpSum(){const p=planBy(tpSel.value),s=[...document.querySelectorAll('.tpH')].reduce((a,x)=>a+(+x.value||0),0);tpHrs.value=`${s} h of ${p.hours} h`;return s}
function tpSave(){const p=planBy(tpSel.value),s=tpSum();if(!fieldErr('tpHrs',s===p.hours?'':`Day hours add up to ${s} h. This plan needs exactly ${p.hours} h as per the RFP.`))return;toast(`${p.code} saved. Change recorded in the audit trail.`)}
P['/admin/batches']=()=>`<div class="page-head"><div><h1>Batch upload</h1><p>Upload training schedules from Excel. Each row is checked before import.</p></div><button class="btn" onclick="toast('Template columns: Batch_ID, Training_Plan_Code, UDISE_Codes, Start_Date, End_Date, Batch_Maxsize, Trainer_Code, Open_Registration')">Template columns</button></div>
 <div class="grid g-main"><section class="panel"><label class="drop" for="buFile" style="display:block"><b>Choose an Excel file</b><br><span class="small muted">.xlsx, .xls or .csv, up to 5 MB</span><input id="buFile" type="file" accept=".xlsx,.xls,.csv" style="display:none" onchange="validateUpload(this.files[0])"></label>
  <p class="small muted" style="margin-top:8px">No file handy? <a href="javascript:validateUpload({name:'up_bahraich_schedule.xlsx'})">Run validation on a sample file</a></p><div id="buResult" style="margin-top:16px"></div></section>
 <section class="panel"><h2 style="margin-bottom:10px">Checks on every row</h2><ul class="checklist small" style="padding-left:18px;margin:0"><li>Batch ID is unique</li><li>Training plan code exists</li><li>Every UDISE code is one of the 750 KGBVs and the school is commissioned before the start date</li><li>Teacher Phases 1–3 and student training end by ${fd(DEADLINE)}</li><li>Phases run in order: Phase 2 after Phase 1 at the same KGBV, and so on</li><li>Day hours match the plan (2, 8, 5, 5, 5 h for teachers; 15 h over 3–5 days for students)</li><li>No national or state holiday clash</li><li>Trainer is available for the whole period</li><li>Capacity: up to 10 teachers per KGBV; 100 students per KGBV</li></ul></section></div>`;
function validateUpload(f){if(!f)return;
  const rows=[['T1-UP-C61','TP-KGBV-M1','09157432118','2026-11-09','2026-11-09',10,ME,[]],['T2-UP-C61','TP-KGBV-M2','09157432118','2026-11-07','2026-11-08',10,ME,['Clashes with Diwali (8 Nov 2026)','Phase 2 is scheduled before Phase 1 at this KGBV']],
   ['S-UP181','TP-KGBV-STU','09157432118','2026-12-07','2026-12-09',100,ME,[]],['T3-UP-C62','TP-KGBV-M3','09160021455','2027-03-08','2027-03-08',10,ME,['Ends after the 1 Mar 2027 deadline for Modules 1–3']],
   ['T1-UP-C63','TP-KGBV-M1','09170033921','2026-11-04','2026-11-04',10,'TR-1001',['KGBV not commissioned until 12 Jan 2027','Trainer TR-1001 is assigned to Andhra Pradesh']],['S-UP182','TP-KGBV-STU','0917003','2026-12-10','2026-12-12',120,ME,['UDISE code must be 11 digits','Student batch exceeds 100 per KGBV']]];
  const ok=rows.filter(r=>!r[7].length).length;
  document.getElementById('buResult').innerHTML=`<div class="note ${ok===rows.length?'good':'warn'}" style="margin-bottom:12px"><b>${esc(f.name)}</b>: ${rows.length} rows read. ${ok} ready to import, ${rows.length-ok} need correction.</div>`+
  table([{h:'Row',f:r=>rows.indexOf(r)+2},{h:'Batch',f:r=>r[0]},{h:'Plan',f:r=>r[1]},{h:'UDISE',f:r=>r[2]},{h:'Dates',f:r=>fd(r[3])+' – '+fd(r[4])},{h:'Size',num:1,f:r=>r[5]},{h:'Trainer',f:r=>r[6]},{h:'Result',f:r=>r[7].length?r[7].map(e=>`<div class="chip bad" style="margin:1px 0">${esc(e)}</div>`).join(''):'<span class="chip good">Valid</span>'}],rows)+
  `<div class="actions"><button class="btn" onclick="toast('Error report lists each failed row with the reason')">View error report</button><button class="btn primary" onclick="toast('${ok} batches imported. Rows with errors were not saved.')">Import ${ok} valid rows</button></div>`}
P['/admin/trainers']=()=>{const s0=D('2026-10-01'),span=212,pos=d=>Math.max(0,Math.min(100,(D(d)-s0)/864e5/span*100));
  const ts=trainers.filter(t=>S.state==='all'||t.state===S.state);
  return `<div class="page-head"><div><h1>Trainers and availability</h1><p>Trainer pool across the 13 states. Availability is checked when a trainer is assigned to a batch.</p></div></div>
  <div class="grid g-main" style="margin-bottom:16px"><section class="panel"><div class="panel-head"><h2>Availability and load</h2><span class="small muted">Oct 2026 – Apr 2027 · green = available, amber = batch</span></div><div style="max-height:520px;overflow:auto">
  ${ts.map(t=>`<div class="tl-row"><span class="small"><b>${esc(t.name)}</b><br><span class="muted">${t.code} · ${t.state}</span></span><div class="tl">${t.avail.map(([f,e])=>`<i style="left:${pos(f)}%;width:${pos(e)-pos(f)}%"></i>`).join('')}${batches.filter(b=>b.trainer===t.code&&D(b.end)>=s0&&b.phase<=3).map(b=>`<b title="${b.id}" style="left:${pos(b.start)}%;width:${Math.max(.6,pos(b.end)-pos(b.start)+.4)}%"></b>`).join('')}</div></div>`).join('')}</div></section>
  <section class="panel"><h2 style="margin-bottom:12px">Update availability</h2><div class="form" style="grid-template-columns:1fr">
   <div class="field"><label class="req" for="avT">Trainer</label><select id="avT">${selOpts(ts.map(t=>[t.code,t.name+' · '+t.code]),'')}</select></div>
   <div class="field"><label for="avA">Action</label><select id="avA">${selOpts(['Add availability','Change availability','Remove availability'],'')}</select></div>
   <div class="field"><label class="req" for="avF">Available from</label><input id="avF" type="date" min="${iso(TODAY)}"><span class="msg"></span></div>
   <div class="field"><label class="req" for="avE">Available to</label><input id="avE" type="date"><span class="msg"></span></div></div>
   <div class="actions"><button class="btn primary" onclick="saveAvail()">Save availability</button></div></section></div>`};
function saveAvail(){const t=trainerBy(avT.value),f=avF.value,e=avE.value;
  let ok=fieldErr('avF',!f?'Choose a start date.':f<iso(TODAY)?'Availability can only be set from today onwards.':'');ok&=fieldErr('avE',!e?'Choose an end date.':f&&e<f?'End date must be on or after the start date.':'');if(!ok)return;
  if(avA.value.startsWith('Remove')){const clash=batches.filter(b=>b.trainer===t.code&&b.status!=='Completed'&&b.start<=e&&b.end>=f);if(clash.length){toast(`${t.name} has ${clash.length} batch(es) in this period. Reassign them first.`);return}t.avail=t.avail.filter(([x,y])=>!(x<=e&&y>=f))}
  else if(avA.value.startsWith('Change'))t.avail=[[f,e]];else t.avail.push([f,e]);computeStats();toast(`Availability saved for ${t.name}`);route()}
P['/admin/holidays']=()=>`<div class="page-head"><div><h1>Holiday calendar</h1><p>National and state holidays. Schedules are checked against this calendar on upload and edit.</p></div></div>
 <div class="grid g-main"><div>${table([{h:'Date',f:h=>fd(h.date)},{h:'Holiday',f:h=>esc(h.name)},{h:'Type',f:h=>`<span class="chip ${h.scope==='National'?'info':'acc'}">${h.scope}</span>`},{h:'Applies to',f:h=>esc(h.state)}],[...holidays,...S.extra.holidays].sort((a,b)=>a.date<b.date?-1:1))}</div>
 <section class="panel"><h2 style="margin-bottom:12px">Add holiday</h2><div class="form" style="grid-template-columns:1fr">
  <div class="field"><label class="req" for="hD">Date</label><input id="hD" type="date"><span class="msg"></span></div><div class="field"><label class="req" for="hN">Holiday name</label><input id="hN"><span class="msg"></span></div>
  <div class="field"><label for="hS">Type</label><select id="hS" onchange="hSt.disabled=this.value==='National'">${selOpts(['National','State'],'National')}</select></div>
  <div class="field"><label for="hSt">State</label><select id="hSt" disabled>${selOpts(STATES.map(s=>s[0]),'')}</select></div></div>
  <div class="actions"><button class="btn primary" onclick="saveHoliday()">Add holiday</button></div></section></div>`;
function saveHoliday(){let ok=fieldErr('hD',hD.value?'':'Choose a date.');ok&=fieldErr('hN',hN.value.trim()?'':'Enter the holiday name.');if(!ok)return;
  const clash=batches.filter(b=>b.status!=='Completed'&&b.start<=hD.value&&b.end>=hD.value&&(hS.value==='National'||b.state===hSt.value));
  S.extra.holidays.push({date:hD.value,name:hN.value.trim(),scope:hS.value,state:hS.value==='National'?'All':hSt.value});toast(clash.length?`Holiday added. ${clash.length} batch(es) fall on this date and are flagged for rescheduling.`:'Holiday added');route()}
P['/admin/certificate']=()=>`<div class="page-head"><div><h1>Certificate template</h1><p>The RFP requires a certificate for teachers and students at the end of their training. The preview updates as you type.</p></div></div>
 <div class="grid g2"><section class="panel"><div class="form">
  <div class="field full"><label for="cPlan">Certificate for</label><select id="cPlan" oninput="certPrev()">${selOpts([['T','Teachers · 25-hour programme (all five phases)'],['T3','Teachers · initial training (Modules 1–3, 15 h)'],['ST','Students · digital skills (15 h)']],'T3')}</select></div>
  <div class="field"><label for="cPre">Certificate number prefix</label><input id="cPre" value="ERN-KGBV-26-" oninput="certPrev()"></div><div class="field"><label for="cSig">Authorised signatory</label><input id="cSig" value="Programme Director" oninput="certPrev()"></div>
  <div class="field"><label for="cOrg">Organisation logo text</label><input id="cOrg" value="ERNET India" oninput="certPrev()"></div><div class="field"><label for="cPl">Programme logo text</label><input id="cPl" value="KGBV Digital Classrooms" oninput="certPrev()"></div>
  <div class="field"><label for="cCol">Colour</label><input id="cCol" type="color" value="#1E3B33" oninput="certPrev()" style="height:42px;padding:3px"></div><div class="field"><label for="cMin">Minimum attendance</label><input id="cMin" type="number" value="75" min="0" max="100"><span class="hint">Placeholder until the business team decides</span></div>
 </div><div class="actions"><button class="btn primary" onclick="toast('Certificate template saved')">Save template</button></div></section><section><div id="certBox"></div><p class="small muted" style="margin-top:8px">Full names appear only on the issued certificate.</p></section></div>`;
function certHtml(o){return `<div class="cert" style="--cert-c:${o.col}"><div class="logos"><span>${esc(o.org)}</span><span>${esc(o.pl)}</span></div><h2>Certificate of Completion</h2><p>This certifies that</p><div class="nm">${esc(o.name)}</div><p>has successfully completed <b>${esc(o.plan)}</b><br>(${o.hours}-hour training) at ${esc(o.school)}</p><div class="foot"><span>Completion date<br><b>${o.date}</b></span><span>Certificate no.<br><b>${esc(o.no)}</b></span><span style="text-align:right">____________<br>${esc(o.sig)}</span></div></div>`}
function certPrev(){const box=document.getElementById('certBox');if(!box)return;const m={T:['Teacher Training on the Digital Classroom Solution',25,'Teacher Full Name'],T3:['Initial Teacher Training (Modules 1–3)',15,'Teacher Full Name'],ST:['Student Digital Skills: Cyber Safety, Digital Creativity, AI Awareness',15,'Student Full Name']}[cPlan.value];
  box.innerHTML=certHtml({col:cCol.value,org:cOrg.value,pl:cPl.value,name:m[2],plan:m[0],hours:m[1],school:'KGBV name, district, state',date:fd(TODAY),no:cPre.value+'000123',sig:cSig.value})}
P['/resource/upload']=()=>`<div class="page-head"><div><h1>Upload resource</h1><p>Add a training material, user manual, video or form, and link it to a training plan and day.</p></div></div>
 <section class="panel" style="max-width:860px"><div class="form">
  <div class="field full"><label class="req" for="rName">Resource name</label><input id="rName" maxlength="120"><span class="msg"></span></div>
  <div class="field"><label class="req" for="rType">Type</label><select id="rType">${selOpts([['PPT','Presentation (PPT/PPTX)'],['PDF','PDF manual'],['Video','Video (MP4)'],['Other','Other multimedia']],'PDF')}</select></div>
  <div class="field"><label class="req" for="rLang">Language</label><select id="rLang">${selOpts(['English','Hindi','Telugu','Assamese','Gujarati','Kannada','Manipuri','Nepali'],'English')}</select></div>
  <div class="field full"><label class="req" for="rPlan">Training plan</label><select id="rPlan" onchange="rDays()">${selOpts(planOpts(),'PH1')}</select></div>
  <div class="field full"><label class="req">Available from day</label><div id="rDayBox" class="row"></div><span class="hint">Only days inside the plan's duration can be chosen.</span></div>
  <div class="field full"><label class="req" for="rFile">File</label><input id="rFile" type="file" accept=".ppt,.pptx,.pdf,.mp4,.webm"><span class="hint">PPT/PPTX or PDF up to 50 MB; MP4/WEBM up to 500 MB</span><span class="msg"></span></div>
  ${S.role==='trainer'?'<div class="field full"><label class="toggle"><input type="checkbox"> Suggest for the common repository</label><span class="hint">An admin reviews suggestions before publishing.</span></div>':''}
 </div><div class="actions"><a class="btn" href="#/library">Cancel</a><button class="btn primary" onclick="saveRes()">Upload resource</button></div></section>`;
function rDays(){const p=planBy(rPlan.value);rDayBox.innerHTML=Array.from({length:p.days},(_,i)=>`<label class="toggle"><input type="radio" name="rDay" value="${i+1}" ${i===0?'checked':''}> Day ${i+1}</label>`).join('')}
function saveRes(){let ok=fieldErr('rName',rName.value.trim()?'':'Enter a resource name.');const f=rFile.files[0],ext=f?f.name.split('.').pop().toLowerCase():'';
  ok&=fieldErr('rFile',!f?'Choose a file to upload.':!['ppt','pptx','pdf','mp4','webm'].includes(ext)?'This file type is not allowed. Use PPT, PPTX, PDF, MP4 or WEBM.':'');if(!ok)return;
  resources.push({id:'R'+Date.now(),name:rName.value.trim(),type:rType.value,plan:rPlan.value,day:+document.querySelector('[name=rDay]:checked').value,lang:rLang.value,size:(f.size/1048576).toFixed(1)+' MB',by:S.role==='admin'?'Platform Admin':'Rohan Verma',date:iso(TODAY),f:.5,users:0,hits:0,last:null});
  toast('Resource uploaded and added to the library');go('/library')}

/* ---- Trainer ---- */
const myBatches=()=>batches.filter(b=>b.trainer===ME);
const dayOf=b=>Math.floor((TODAY-D(b.start))/864e5)+1;
P['/trainer']=()=>{
  const mb=myBatches(), live=mb.filter(b=>b.status==='In Progress'), next=mb.filter(b=>D(b.start)>TODAY).sort((a,b)=>a.start<b.start?-1:1);
  const focus=live[0]||next[0], plan=planBy(focus.plan), a=agg(mb.filter(b=>b.phase<=3));
  const isLive=focus.status==='In Progress', day=dayOf(focus), marked=S.attSaved[focus.id+'|'+iso(TODAY)];
  return `<div class="page-head"><div><h1>Hello, Rohan</h1><p>${fd(TODAY)} · ${isLive?`training today at ${esc(focus.school)}`:`next training on ${fd(focus.start)}`}</p></div></div>
  <section class="pipeline"><h2>${isLive?"Today's training":'Next training'}</h2><p class="sub">${focus.id} · ${esc(plan.name)} · ${esc(focus.school)}</p>
   <div class="stages">
    <a class="stage" href="${link('/trainer/trainees',{batch:focus.id})}"><div class="n">${focus.registered}/${focus.cap}</div><div class="t">${focus.kind==='student'?'Students':'Teachers'} registered</div><div class="p">${focus.approved} approved</div></a>
    <a class="stage" href="${link('/trainer/attendance',{batch:focus.id})}"><div class="n">${isLive?(marked||focus.attUpdated?'Done':'Due'):'–'}</div><div class="t">Attendance</div><div class="p">${isLive?'Day '+day+' of '+plan.days:'Opens on day 1'}</div></a>
    <a class="stage" href="#/trainer/plan"><div class="n">${plan.hours} h</div><div class="t">${plan.days} day(s)</div><div class="p">${fd(focus.start)} – ${fd(focus.end)}</div></a>
    <a class="stage" href="#/library"><div class="n">${resources.filter(r=>r.plan===plan.id).length}</div><div class="t">Resources</div><div class="p">Open library</div></a>
    <a class="stage" href="${link('/trainer/trainees',{batch:focus.id})}"><div class="n">${focus.registered-focus.approved}</div><div class="t">To approve</div><div class="p">Before day 1</div></a>
    <a class="stage" href="${link('/reports/batches')}"><div class="n">${next.length}</div><div class="t">Upcoming batches</div><div class="p">across ${new Set(next.map(b=>b.cluster)).size} clusters</div></a></div></section>
  <div class="row" style="margin-bottom:16px">${[[link('/trainer/attendance',{batch:focus.id}),'Mark attendance',1],[link('/trainer/trainees',{batch:focus.id}),'View participants'],['#/resource/upload','Upload resource'],['#/trainer/plan','View training plan']].map(([h,l,p])=>`<a class="btn ${p?'primary':''}" href="${h}">${l}</a>`).join('')}</div>
  <div class="kpis k6">${kpi(nf(mb.length),'Assigned batches','#/trainer/trainees')}${kpi(nf(mb.filter(b=>b.kind==='teacher').length),'Teacher batches','#/trainer/trainees')}${kpi(nf(mb.filter(b=>b.kind==='student').length),'Student batches','#/trainer/trainees')}${kpi(nf(mb.filter(b=>b.status==='Completed').length),'Completed','#/trainer/trainees')}${kpi(a.attPct?a.attPct+'%':'–','Average attendance','#/trainer/attendance')}${kpi(nf(a.completed),'Participants trained','#/trainer/trainees')}</div>
  <section class="panel"><div class="panel-head"><h2>Next 15 batches</h2></div>${table([{h:'Batch',f:b=>`<b>${b.id}</b>`},{h:'Participants',f:b=>kindChip(b.kind)},{h:'Training',f:b=>esc(planBy(b.plan).name)},{h:'KGBV(s)',f:b=>esc(b.school)},{h:'Dates',f:b=>fd(b.start)+(b.start!==b.end?' – '+fd(b.end):'')},{h:'Registered',num:1,f:b=>b.registered+'/'+b.cap},{h:'Status',f:b=>statusChip(b.status)}],[...live,...next].slice(0,15),{click:b=>`go('/trainer/trainees',{batch:'${b.id}'})`})}</section>`;
};
P['/trainer/attendance']=(q)=>{
  const mb=myBatches().filter(b=>b.status==='In Progress'||b.status==='Completed').sort((a,b)=>a.start<b.start?1:-1);
  if(!mb.length){const n=myBatches().filter(b=>D(b.start)>TODAY).sort((a,b)=>a.start<b.start?-1:1)[0];return `<div class="page-head"><div><h1>Mark attendance</h1></div></div><div class="panel"><div class="note">No training days yet. Attendance opens on your first training day: ${fd(n.start)} (${n.id}).</div></div>`}
  const b=mb.find(x=>x.id===q.batch)||mb[0], plan=planBy(b.plan), date=q.date||(b.status==='In Progress'?iso(TODAY):b.end), list=trainees(b).filter(t=>t.approved), dayIdx=Math.floor((D(date)-D(b.start))/864e5);
  let err='';if(date>iso(TODAY))err='Attendance cannot be marked for a future date.';else if(date<b.start||date>b.end)err=`Choose a date between ${fd(b.start)} and ${fd(b.end)}.`;
  const saved=S.attSaved[b.id+'|'+date];
  return `<div class="page-head"><div><h1>Mark attendance</h1><p>Mark each approved participant present or absent for today or an earlier training day. Changes are recorded in the audit trail.</p></div></div>
  <div class="filters"><div class="f"><label>Batch</label><select onchange="go('/trainer/attendance',{batch:this.value})">${selOpts(mb.map(x=>[x.id,x.id+' · '+x.school+' · '+fd(x.start)]),b.id)}</select></div>
  <div class="f"><label>Training date</label><input type="date" value="${date}" max="${iso(TODAY)}" onchange="go('/trainer/attendance',{batch:'${b.id}',date:this.value})"></div><div class="f"><label>Training day</label><input readonly value="${err?'–':'Day '+(dayIdx+1)+' of '+plan.days}"></div></div>
  ${err?`<div class="note warn">${err}</div>`:`${saved?'<div class="note good" style="margin-bottom:12px">Attendance saved for this date. Editing again creates a new audit entry.</div>':''}
  <div class="row" style="justify-content:space-between;margin-bottom:10px"><span class="small muted">${list.length} approved participants · <span id="attSum"></span></span><div class="row"><button class="btn sm" onclick="markAll('P')">Mark all present</button><button class="btn sm" onclick="markAll('A')">Mark all absent</button></div></div>
  <div class="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>KGBV</th><th>Mark</th></tr></thead><tbody>${list.map((t,i)=>{const cur=saved?saved[i]:(t.att[dayIdx]||'P');return `<tr><td>${t.uid}</td><td>${esc(b.kind==='student'?t.masked:t.name)}</td><td class="small">${esc(t.school)}</td><td><span class="seg"><input type="radio" id="p${i}" name="a${i}" value="P" ${cur==='P'?'checked':''} onchange="attSum()"><label class="p" for="p${i}">Present</label><input type="radio" id="a${i}" name="a${i}" value="A" ${cur==='A'?'checked':''} onchange="attSum()"><label class="a" for="a${i}">Absent</label></span></td></tr>`}).join('')}</tbody></table></div>
  <div class="actions"><button class="btn primary" onclick="saveAtt('${b.id}','${date}',${list.length})">Save attendance</button></div>`}`;
};
function markAll(v){document.querySelectorAll(`.seg input[value="${v}"]`).forEach(x=>x.checked=true);attSum()}
function attSum(){const el=document.getElementById('attSum');if(el)el.textContent=`${document.querySelectorAll('.seg input[value=P]:checked').length} present, ${document.querySelectorAll('.seg input[value=A]:checked').length} absent`}
function saveAtt(id,date,n){const v=[];for(let i=0;i<n;i++)v.push((document.querySelector(`[name=a${i}]:checked`)||{}).value||'P');S.attSaved[id+'|'+date]=v;const b=batches.find(x=>x.id===id);if(date===iso(TODAY))b.attUpdated=true;toast(`Attendance saved for ${fd(date)}: ${v.filter(x=>x==='P').length} present, ${v.filter(x=>x==='A').length} absent`);route()}
P['/trainer/trainees']=(q)=>{
  const mb=myBatches().sort((a,b)=>a.start<b.start?-1:1), dflt=mb.find(b=>b.status==='In Progress')||mb.find(b=>D(b.start)>TODAY)||mb[0], b=mb.find(x=>x.id===q.batch)||dflt, list=trainees(b), stu=b.kind==='student';
  return `<div class="page-head"><div><h1>Participants and registration</h1><p>Review registrations, approve the final list before day 1 and control open registration for teacher batches.</p></div></div>
  <div class="filters"><div class="f"><label>Batch</label><select onchange="go('/trainer/trainees',{batch:this.value})">${selOpts(mb.map(x=>[x.id,x.id+' · '+fd(x.start)+' · '+x.status]),b.id)}</select></div></div>
  <div class="grid g3" style="margin-bottom:16px"><section class="panel"><h3>Capacity</h3><div class="track" style="margin:10px 0"><i style="width:${pct(b.registered,b.cap)}%;background:var(--accent)"></i></div><p class="small">${b.registered} of ${b.cap} registered · ${b.approved} approved</p></section>
   <section class="panel"><h3>Registration</h3>${stu?'<p class="small muted" style="margin-top:10px">Student lists come from the KGBV. Upload the list; open registration is not used for students.</p>':`<label class="toggle" style="margin:10px 0"><input type="checkbox" ${b.openReg?'checked':''} onchange="regToggle('${b.id}',this.checked)"> ${b.openReg?'Open':'Closed'}</label><p class="small muted">Link: training-tracker/register?batch=${b.id}</p>`}</section>
   <section class="panel"><h3>Add participants</h3><label class="btn sm" style="margin-top:10px">Upload Excel list<input type="file" accept=".xlsx,.xls,.csv" style="display:none" onchange="toast(this.files[0].name+': rows read and checked. Duplicates skipped.')"></label><p class="small muted" style="margin-top:6px">${stu?'Up to 100 students per KGBV.':'Up to 10 teachers per KGBV.'}</p></section></div>
  <div class="row" style="justify-content:space-between;margin-bottom:10px"><span class="small muted">${list.filter(t=>!t.approved).length} awaiting approval</span><div class="row"><button class="btn sm" onclick="approveSel('${b.id}')">Approve selected</button><button class="btn sm primary" onclick="approveAll('${b.id}')">Approve final list</button></div></div>`+
  table([{h:'<input type="checkbox" aria-label="Select all" onchange="document.querySelectorAll(\'.tsel\').forEach(x=>x.checked=this.checked)">',f:t=>t.approved?'':`<input type="checkbox" class="tsel" value="${t.uid}" aria-label="Select">`},{h:'ID',f:t=>t.uid},{h:'Name',f:t=>esc(stu?t.masked:t.name)},stu?{h:'Class',f:t=>t.grade}:{h:'Mobile',f:t=>t.mobile},{h:'KGBV',f:t=>esc(t.school)},{h:'Source',f:t=>t.source},{h:'Check',f:t=>t.dup?'<span class="chip warn">Possible duplicate</span>':'<span class="chip good">OK</span>'},{h:'Status',f:t=>statusChip(t.status)}],list,{empty:'No participants yet. Upload a list'+(stu?'.':' or share the registration link.')});
};
function regToggle(id,on){batches.find(b=>b.id===id).openReg=on;toast(on?'Registration opened for '+id:'Registration closed for '+id);route()}
function approveSel(id){const s=[...document.querySelectorAll('.tsel:checked')].map(x=>x.value);if(!s.length){toast('Select participants to approve');return}const b=batches.find(x=>x.id===id);trainees(b).forEach(t=>{if(s.includes(t.uid)){t.approved=true;t.status='Approved'}});b.approved=trainees(b).filter(t=>t.approved).length;toast(s.length+' approved');route()}
function approveAll(id){const b=batches.find(x=>x.id===id),l=trainees(b);if(l.some(t=>!t.approved&&t.dup)){toast('Resolve possible duplicates first: approve or remove them individually.');return}l.forEach(t=>{t.approved=true;if(t.status==='Registered')t.status='Approved'});b.approved=l.length;toast('Final list approved for '+id);route()}
P['/trainer/plan']=()=>{const mb=myBatches(),b=mb.find(x=>x.status==='In Progress')||mb.filter(x=>D(x.start)>TODAY).sort((a,c)=>a.start<c.start?-1:1)[0],p=planBy(b.plan),day=dayOf(b);
  return `<div class="page-head"><div><h1>${esc(p.name)}</h1><p>${p.code} · ${p.days} day(s) · ${p.hours} hours · batch ${b.id} at ${esc(b.school)}</p></div></div>`+
  `<div class="stack">${p.schedule.map((s,i)=>`<section class="panel" ${i+1===day?'style="border-color:var(--accent);border-width:2px"':''}><div class="panel-head"><h2>Day ${i+1} · ${fd(addDays(D(b.start),i))} · ${p.hpd[i]} h</h2>${i+1===day?'<span class="chip acc">Today</span>':i+1<day?'<span class="chip good">Done</span>':''}</div><p style="margin-bottom:10px">${esc(s)}</p><div class="row">${resources.filter(r=>r.plan===p.id&&r.day===i+1).map(r=>`<button class="btn sm" onclick="openRes('${r.id}')">${r.type} · ${esc(r.name)} (${r.lang})</button>`).join('')||'<span class="small muted">No resources linked</span>'}</div></section>`).join('')}</div>`};

/* ---- Teacher ---- */
function myStatus(){const tb=teacherBatches();const me=b=>trainees(b)[0];
  return tb.map(b=>{const p=planBy(b.plan),t=b.registered?me(b):null,done=b.status==='Completed'&&t&&['Certified','Training Completed'].includes(t.status);
    const hrs=done?p.hours:b.status==='In Progress'?p.hpd.slice(0,dayOf(b)-1).reduce((a,h)=>a+h,0):0;return {b,p,done,hrs}})}
P['/teacher']=()=>{
  const ms=myStatus(), total=ms.reduce((a,m)=>a+m.hrs,0), cur=ms.find(m=>!m.done)||ms[ms.length-1], b=cur.b, p=cur.p, live=b.status==='In Progress', day=live?dayOf(b):0;
  const jr=ms.map(m=>{const lbl=m.done?'Completed':m.b.status==='In Progress'?`In progress · day ${dayOf(m.b)} of ${m.p.days}`:`Scheduled ${fd(m.b.start)}`;
    return `<div class="phase${m===cur?' cur':''}"><div class="ph-top"><span>Phase ${m.p.phase}</span><span class="ph-h">${m.p.hours} h</span></div><div class="ph-t">${m.p.short}</div><div class="ph-bar"><i style="width:${pct(m.hrs,m.p.hours)}%"></i></div><div class="ph-m">${lbl}</div></div>`}).join('');
  return `<section class="hero-t"><h1>Hello, Anita</h1><p class="meta">TT-${PSCHOOL.id}01 · ${esc(PSCHOOL.name)} · ${total} of 25 training hours completed</p>
   <div class="ph-scroll"><div class="phases" style="grid-template-columns:${PHASES.map(x=>`minmax(130px,${x.hours}fr)`).join(' ')};min-width:700px">${jr}</div></div>
   <h2 style="margin-top:22px;color:var(--board-ink)">${live?`${esc(p.name)} · today is day ${day} of ${p.days}`:`Next: ${esc(p.name)} on ${fd(b.start)}`}</h2>
   <div class="days" style="grid-template-columns:repeat(${p.days},minmax(0,1fr))">${p.schedule.map((s,i)=>`<div class="day ${live&&i<day-1?'done':''} ${live&&i===day-1?'today':''}"><b>Day ${i+1} · ${fd(addDays(D(b.start),i)).slice(0,6)} · ${p.hpd[i]} h</b><span>${esc(s)}</span></div>`).join('')}</div></section>
  <div class="grid g3" style="margin-top:16px">
   <section class="panel"><h2 style="margin-bottom:10px">${live?'My training':'Next session'}</h2><div class="list"><div class="li"><span class="li-s">Dates</span><span>${fd(b.start)}${b.start!==b.end?' – '+fd(b.end):''}</span></div><div class="li"><span class="li-s">Venue</span><span style="text-align:right">${esc(schoolBy(b.schools[0]).name)}<br><span class="small muted">with ${b.schools.length-1} nearby KGBV(s)</span></span></div><div class="li"><span class="li-s">Trainer</span><span>Rohan Verma</span></div><div class="li"><span class="li-s">Status</span>${statusChip(b.status)}</div></div>${p.phase===3?'<p class="small muted" style="margin-top:8px">Module 3 is held jointly with your students.</p>':''}</section>
   <section class="panel"><h2 style="margin-bottom:10px">${live?`Today · day ${day}`:'Before you start'}</h2><div class="list">${live?`<p class="small" style="margin-bottom:6px">${esc(p.schedule[day-1])}</p>`:''}
    ${resources.filter(r=>r.plan===p.id&&r.type!=='Form').slice(0,3).map(r=>{const u=iso(addDays(D(b.start),r.day-1));return u<=iso(TODAY)?`<a class="li" href="javascript:openRes('${r.id}')"><span class="li-t">${esc(r.name)}</span><span class="chip">${r.type}</span></a>`:`<div class="li"><span class="li-t muted">${esc(r.name)}</span><span class="chip">Unlocks ${fd(u).slice(0,6)}</span></div>`}).join('')}
    <a class="li" href="#/teacher/feedback"><span class="li-t">Feedback</span>${live?(S.teacher.fb[b.id+day]?'<span class="chip good">Submitted</span>':'<span class="chip warn">To do</span>'):'<span class="chip">Opens on day 1</span>'}</a></div></section>
   <section class="panel"><h2 style="margin-bottom:10px">My progress</h2><div class="list">${ms.map(m=>`<div class="li"><span class="li-t">Phase ${m.p.phase} · ${m.p.short}</span>${m.done?'<span class="chip good">Done</span>':m.b.status==='In Progress'?'<span class="chip acc">Live</span>':`<span class="chip">${fd(m.b.start).slice(0,6)} ${m.b.start.slice(2,4)}</span>`}</div>`).join('')}<a class="li" href="#/teacher/certificate"><span class="li-t">Certificates</span><span class="chip">View</span></a></div></section></div>`;
};
const QS=[['Which feature lets you write over content on the digital teaching device?',['Annotation tool','Screen mirror','Volume control','Night mode'],0],['A good technology-enabled lesson starts with…',['Choosing a video','The learning objective','The device brand','Seating plan'],1],['Best way to check understanding during a digital lesson?',['Skip questions','Short in-class quiz','Read slides aloud','Longer video'],1],['Where should student data be stored?',['Personal pen drive','Approved school system','Public cloud folder','Messaging group'],1],['If the device freezes, the first safe step is to…',['Unplug the mains','Restart via the menu','Call the vendor','End the class'],1]];
P['/teacher/assessment']=()=>{const ms=myStatus(),cur=ms.find(m=>!m.done)||ms[ms.length-1],b=cur.b,open=b.status==='In Progress'&&dayOf(b)===cur.p.days;
  return `<div class="page-head"><div><h1>Assessment</h1><p>The pre-training assessment opens on the first day of Phase 1. A post-assessment opens on the last day of each initial phase.</p></div></div>
  ${S.teacher.post[b.id]?'<div class="panel"><div class="note good">Assessment submitted for this phase.</div></div>':open||S.teacher.preview?`<section class="panel" style="max-width:780px">${QS.map((q,i)=>`<fieldset class="q"><legend>${i+1}. ${esc(q[0])}</legend>${q[1].map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${esc(o)}</label>`).join('')}</fieldset>`).join('')}<div class="actions"><button class="btn primary" onclick="submitAs('${b.id}')">Submit assessment</button></div></section>`:`<div class="panel"><div class="note">The next assessment opens on ${fd(b.end)} (${esc(cur.p.name)}).</div><div class="actions" style="justify-content:flex-start"><button class="btn" onclick="S.teacher.preview=true;route()">Preview the form</button></div></div>`}`};
function submitAs(id){const ans=QS.map((q,i)=>(document.querySelector(`[name=q${i}]:checked`)||{}).value);const miss=ans.findIndex(a=>a===undefined);if(miss>-1){toast(`Answer question ${miss+1} before submitting`);return}S.teacher.post[id]=true;toast(`Assessment submitted. Score ${ans.filter((a,i)=>+a===QS[i][2]).length}/${QS.length}.`);go('/teacher')}
P['/teacher/feedback']=()=>{const ms=myStatus(),cur=ms.find(m=>!m.done)||ms[ms.length-1],b=cur.b,live=b.status==='In Progress',key=b.id+dayOf(b);
  return `<div class="page-head"><div><h1>Session feedback</h1><p>Takes about two minutes and helps improve the training.</p></div></div><section class="panel" style="max-width:780px">${!live?`<div class="note">Feedback opens during your next training session on ${fd(b.start)}.</div>`:S.teacher.fb[key]?'<div class="note good">Feedback submitted for today. Thank you.</div>':`
  ${[['How useful was today\'s session for your teaching?','fb1'],['How clear was the trainer?','fb2'],['How well did the device and venue work?','fb3']].map(([l,n])=>`<fieldset class="q"><legend>${l}</legend><div class="rating">${[1,2,3,4,5].map(v=>`<label><input type="radio" name="${n}" value="${v}"><span>${v} ${v===1?'Poor':v===5?'Excellent':''}</span></label>`).join('')}</div></fieldset>`).join('')}
  <div class="field"><label for="fbI">Anything we should improve?</label><textarea id="fbI"></textarea></div><div class="actions"><button class="btn primary" onclick="submitFb('${key}')">Submit feedback</button></div>`}</section>`};
function submitFb(k){if(['fb1','fb2','fb3'].some(n=>!document.querySelector(`[name=${n}]:checked`))){toast('Choose a rating for each question');return}S.teacher.fb[k]=true;toast('Feedback submitted');go('/teacher')}
P['/teacher/certificate']=()=>{const ms=myStatus(),init=ms.slice(0,3).every(m=>m.done),all=ms.every(m=>m.done);
  return `<div class="page-head"><div><h1>Certificates</h1><p>Issued when you complete the training and meet the attendance and assessment criteria.</p></div></div>
  <div class="grid g2"><section class="panel"><div class="list"><div class="li"><span><span class="li-t">Initial training · Modules 1–3 (15 h)</span><br><span class="li-s">Due by ${fd(DEADLINE)}</span></span>${init?'<span class="chip good">Available</span>':`<span class="chip">${ms.slice(0,3).filter(m=>m.done).length} of 3 phases done</span>`}</div>
  <div class="li"><span><span class="li-t">Full programme · 25 h</span><br><span class="li-s">After Refresher II</span></span>${all?'<span class="chip good">Available</span>':`<span class="chip">${ms.filter(m=>m.done).length} of 5 phases done</span>`}</div></div><p class="small muted" style="margin-top:12px">Criteria such as minimum attendance are placeholders until the business team confirms them.</p></section>
  <section><div style="${init?'':'opacity:.45;filter:grayscale(.6)'}">${certHtml({col:'#1E3B33',org:'ERNET India',pl:'KGBV Digital Classrooms',name:'Anita Yadav',plan:'Initial Teacher Training (Modules 1–3)',hours:15,school:PSCHOOL.name+', '+PSCHOOL.district,date:init?fd(ms[2].b.end):'—',no:init?'ERN-KGBV-26-004211':'Issued on completion',sig:'Programme Director'})}</div></section></div>`};
P['/register']=()=>{const open=batches.filter(b=>b.kind==='teacher'&&b.openReg&&b.status!=='Completed'&&D(b.start)>TODAY&&(D(b.start)-TODAY)/864e5<=30&&b.state==='Uttar Pradesh').slice(0,40);
  return `<div class="page-head"><div><h1>Register for a training batch</h1><p>Use the batch code shared by your trainer or KGBV. We'll verify your mobile number with a one-time password.</p></div></div>
  <div class="grid g2"><section class="panel"><div class="form" style="grid-template-columns:1fr">
  <div class="field"><label class="req" for="rgB">Batch</label><select id="rgB">${selOpts(open.map(b=>[b.id,b.id+' · '+b.school+' · '+fd(b.start)]),'')}</select><span class="msg"></span></div>
  <div class="field"><label class="req" for="rgN">Full name</label><input id="rgN" autocomplete="name"><span class="msg"></span></div>
  <div class="field"><label class="req" for="rgM">Mobile number</label><input id="rgM" inputmode="numeric" maxlength="10" autocomplete="tel" placeholder="10-digit mobile"><span class="msg"></span></div>
  <div class="field"><label for="rgE">Email (optional)</label><input id="rgE" type="email" autocomplete="email"><span class="msg"></span></div>
  <div class="field"><label class="req" for="rgU">KGBV UDISE code</label><input id="rgU" inputmode="numeric" maxlength="11"><span class="msg"></span></div>
  <div class="field" id="otpBox" style="display:none"><label class="req" for="rgO">Enter the 6-digit OTP</label><input id="rgO" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><span class="hint">Prototype: any 6 digits work.</span><span class="msg"></span></div></div>
  <div class="actions"><button class="btn primary" id="rgBtn" onclick="regStep()">Send OTP</button></div></section>
  <section class="panel"><h2 style="margin-bottom:8px">Already registered?</h2><p class="small muted" style="margin-bottom:12px">Find your Unique ID with your registered mobile number or email.</p><div class="field"><label for="fid">Mobile number or email</label><input id="fid"></div><div class="actions" style="justify-content:flex-start"><button class="btn" onclick="fid.value.trim()?toast('OTP sent. After verification your Unique ID is shown here.'):toast('Enter your mobile number or email')">Find my Unique ID</button></div></section></div>`};
function regStep(){if(otpBox.style.display==='none'){let ok=fieldErr('rgB',rgB.value?'':'Choose your batch.');ok&=fieldErr('rgN',rgN.value.trim().length>1?'':'Enter your full name.');ok&=fieldErr('rgM',/^[6-9]\d{9}$/.test(rgM.value)?'':'Enter a valid 10-digit mobile number.');ok&=fieldErr('rgE',!rgE.value||/^\S+@\S+\.\S+$/.test(rgE.value)?'':'Enter a valid email or leave it blank.');
  const b=batches.find(x=>x.id===rgB.value);ok&=fieldErr('rgU',!/^\d{11}$/.test(rgU.value)?'UDISE code must be 11 digits.':b&&!b.schools.some(s=>schoolBy(s).udise===rgU.value)?'This UDISE code is not one of the KGBVs in this batch.':'');if(!ok)return;
  if(b.registered>=b.cap){fieldErr('rgB','This batch is full. Ask your trainer about another batch.');return}otpBox.style.display='';rgBtn.textContent='Verify and register';toast('OTP sent to '+rgM.value.slice(0,2)+'••••••'+rgM.value.slice(-2))}
  else{if(!fieldErr('rgO',/^\d{6}$/.test(rgO.value)?'':'Enter the 6-digit OTP sent to your mobile.'))return;const b=batches.find(x=>x.id===rgB.value);b.registered++;delete traineeCache[b.id];openDlg('Registration received',`<p>You are registered for batch <b>${b.id}</b>, starting ${fd(b.start)}.</p><p class="small muted" style="margin-top:10px">Your trainer approves the final list before training begins.</p>`);route()}}

/* ================= ROUTER ================= */
const TITLES={'/library':'Content library','/register':'Registration','/resource/upload':'Upload resource'};
function route(){
  if(!window.DemoAuth||!window.DemoAuth.requireSession())return;
  const session=window.DemoAuth.get();
  const h=location.hash.slice(1)||ROLES[S.role].home, [path,qs]=h.split('?'), q=Object.fromEntries(new URLSearchParams(qs||''));
  const pathRole=path.startsWith('/admin')||path.startsWith('/reports')?'admin':path.startsWith('/trainer')?'trainer':path.startsWith('/teacher')||path==='/register'?'teacher':null;
  if(pathRole&&pathRole!==session.role){location.replace('#'+ROLES[session.role].home);return}
  S.role=session.role;
  const allowed={ernet:p=>p==='/ernet'||(p.startsWith('/reports')&&p!=='/reports/users')||p==='/library',admin:p=>p.startsWith('/admin')||p.startsWith('/reports')||p==='/library'||p==='/resource/upload',trainer:p=>p.startsWith('/trainer')||p==='/library'||p==='/resource/upload',teacher:p=>p.startsWith('/teacher')||p==='/library'||p==='/register'};
  if(!P[path]||!allowed[S.role](path)){if(path!==ROLES[S.role].home){location.replace('#'+ROLES[S.role].home);return}}
  roleSel.value=S.role; who.textContent=ROLES[S.role].who;
  stateCtl.style.display=ROLES[S.role].stateSel?'':'none';
  stateSel.innerHTML=selOpts([['all','All 13 states'],...STATES.map(s=>[s[0],s[0]+' ('+s[1]+')'])],S.state);
  asOfSel.innerHTML=selOpts(AS_OF,iso(TODAY));
  nav.innerHTML=navFor(S.role).map(n=>n.length===1?`<div class="grp">${n[0]}</div>`:`<a href="#${n[0]}" class="${path===n[0]?'on':''}">${n[1]}</a>`).join('');
  const label=navFor(S.role).find(n=>n[0]===path); crumb.textContent=label?label[1]:TITLES[path]||'';
  document.title=(label?label[1]:'Training Tracker')+' · KGBV Training Tracker';
  window._fp={path,params:q};
  view.innerHTML=P[path](q);
  side.classList.remove('open');
  if(path==='/admin/plans')tpRender(); if(path==='/admin/certificate')certPrev(); if(path==='/resource/upload')rDays(); if(path==='/trainer/attendance')attSum();
  window.scrollTo(0,0);
}
computeStats();
const hp=(location.hash.slice(1)||'').split('?')[0];
if(hp.startsWith('/admin'))S.role='admin';else if(hp.startsWith('/trainer'))S.role='trainer';else if(hp.startsWith('/teacher')||hp==='/register')S.role='teacher';
window.addEventListener('hashchange',route); route();

