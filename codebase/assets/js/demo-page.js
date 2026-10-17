const walkthrough=document.getElementById('walkthroughVideo');
const captions=document.getElementById('walkthroughCaptions');
if(walkthrough&&captions){
  walkthrough.addEventListener('loadedmetadata',()=>{
    if(walkthrough.textTracks.length)walkthrough.textTracks[0].mode='showing';
  },{once:true});
  walkthrough.addEventListener('error',()=>{
    const status=document.getElementById('videoStatus');
    if(status)status.textContent='The video could not be loaded. Please refresh the page and try again.';
  });
}
