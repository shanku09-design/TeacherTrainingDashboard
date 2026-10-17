const accounts={admin:{email:'admin@training.demo',password:'Admin123!',route:'admin'},trainer:{email:'rohan.verma@training.demo',password:'Trainer123!',route:'trainer'},teacher:{email:'anita.yadav@training.demo',password:'Trainee123!',route:'teacher'}};let selected='admin';const email=document.getElementById('email'),password=document.getElementById('password'),message=document.getElementById('loginMessage');function selectPersona(role){if(!accounts[role])return;selected=role;document.querySelectorAll('.persona').forEach(button=>button.classList.toggle('active',button.dataset.persona===role));email.value=accounts[role].email;password.value=accounts[role].password}document.querySelectorAll('.persona').forEach(button=>button.addEventListener('click',()=>selectPersona(button.dataset.persona)));document.getElementById('showPassword').addEventListener('click',event=>{password.type=password.type==='password'?'text':'password';event.currentTarget.textContent=password.type==='password'?'Show':'Hide'});const sessionReason=new URLSearchParams(location.search).get('session');const openedFromFile=location.protocol==='file:';if(message&&openedFromFile)message.textContent='For sign-in to work, run the local demo server and open http://127.0.0.1:4173. Direct file opening cannot share a session with the dashboard.';else if(message&&sessionReason)message.textContent=sessionReason==='expired'?'Your demo session expired. Choose your persona to sign in again.':'You have signed out. Choose a persona to continue.';document.getElementById('loginForm').addEventListener('submit',event=>{event.preventDefault();if(location.protocol==='file:'){if(message)message.textContent='Please start the local demo server first, then open http://127.0.0.1:4173.';return}if(!window.DemoAuth||!window.DemoAuth.start(selected)){if(message)message.textContent='This browser could not start a demo session. Enable browser storage and try again.';return}location.href='dashboard.html#/'+accounts[selected].route});selectPersona(selected);const demoDialog=document.getElementById('demoDialog');
const demoVideo=document.getElementById('demoVideo');
const demoTrack=document.getElementById('demoTrack');
const demoLanguage=document.getElementById('demoLanguage');
const demoClose=document.querySelector('.demo-close');
const demoSources={
  english:{title:'English product walkthrough',src:'docs/product-demo/teacher-training-tracker-modules-english.mp4',captions:'docs/product-demo/teacher-training-tracker-modules-english.vtt',srclang:'en',label:'English captions',description:'English narration · English captions'},
  hindi:{title:'Hindi product walkthrough',src:'docs/product-demo/teacher-training-tracker-modules-hindi.mp4',captions:'docs/product-demo/teacher-training-tracker-modules-hindi.vtt',srclang:'hi',label:'Hindi subtitles',description:'Hindi narration · Hindi subtitles'}
};
function closeDemo(){if(demoDialog.open)demoDialog.close();demoVideo.pause();demoVideo.removeAttribute('src');demoTrack.removeAttribute('src');demoVideo.load()}
document.querySelectorAll('[data-demo]').forEach(button=>button.addEventListener('click',()=>{
  const demo=demoSources[button.dataset.demo];if(!demo)return;
  document.getElementById('demoDialogTitle').textContent=demo.title;
  demoLanguage.textContent=demo.description;
  demoVideo.src=demo.src;demoTrack.src=demo.captions;demoTrack.srclang=demo.srclang;demoTrack.label=demo.label;demoTrack.default=true;
  demoVideo.load();demoDialog.showModal();
  const playAttempt=demoVideo.play();if(playAttempt&&typeof playAttempt.catch==='function')playAttempt.catch(()=>{});
}));
demoClose.addEventListener('click',closeDemo);
demoDialog.addEventListener('click',event=>{if(event.target===demoDialog)closeDemo()});
demoDialog.addEventListener('close',()=>{demoVideo.pause();demoVideo.removeAttribute('src');demoTrack.removeAttribute('src');demoVideo.load()});
