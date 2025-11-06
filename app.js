// v2 behavior:
// Day mode: camera visible & active (video minimized). You can pick/add words to store in left list.
// Night mode: camera visually dimmed, show 3 short AI clip thumbnails in center; camera OFF state visually.
// Toggle enacts the behavior.

let words = ['happy','window','chair','desk','live','camera','learn','friend','play','night'];
let currentIndex = 0;
const wordsList = document.getElementById('wordsList');
const currentWordEl = document.getElementById('currentWord');
const videoTitle = document.getElementById('videoTitle');
const phoneShell = document.getElementById('phoneShell');
const cameraBox = document.getElementById('cameraBox');
const videoContent = document.getElementById('videoContent');
const wordsCount = document.getElementById('wordsCount');

function renderWords(){
  wordsList.innerHTML = '';
  words.forEach((w,i)=>{
    const li = document.createElement('li');
    li.textContent = w;
    li.dataset.index = i;
    if(i===currentIndex) li.classList.add('active');
    li.addEventListener('click', ()=>{ currentIndex = i; selectWord(); });
    wordsList.appendChild(li);
  });
  wordsCount.textContent = words.length;
}

function selectWord(){
  const w = words[currentIndex];
  currentWordEl.textContent = w;
  videoTitle.textContent = 'Short AI video for ' + w;
  renderWords();
  // camera quick overlay text to mimic recognition when in day
  if(!phoneShell.classList.contains('night-mode')){
    cameraBox.querySelector('.camera-view').textContent = 'Camera On — seeing: "'+w+'"';
    setTimeout(()=>{ cameraBox.querySelector('.camera-view').textContent = 'Camera On — assistant ready'; }, 2200);
  } else {
    // night: clicking/selecting will show which clip
    const vc = document.getElementById('videoContent');
    vc.innerHTML = createNightThumbnailsHTML(w);
  }
}

function createNightThumbnailsHTML(word){
  return '<div class="video-thumbs">' +
    '<div class="thumb" onclick="playExample(0,\''+word+'\')">Clip 1<br/><small>short example</small></div>' +
    '<div class="thumb" onclick="playExample(1,\''+word+'\')">Clip 2<br/><small>short example</small></div>' +
    '<div class="thumb" onclick="playExample(2,\''+word+'\')">Clip 3<br/><small>short example</small></div>' +
    '</div>';
}

window.playExample = function(i, word){
  const vc = document.getElementById('videoContent');
  vc.innerHTML = '<div style="padding:12px;text-align:center">Playing clip '+(i+1)+' for "'+word+'" (placeholder)</div>';
  // simulate waveform while clip plays
  simulateWave(1200);
}

document.getElementById('nextWord').addEventListener('click', ()=>{ currentIndex = (currentIndex+1)%words.length; selectWord(); });
document.getElementById('prevWord').addEventListener('click', ()=>{ currentIndex = (currentIndex-1+words.length)%words.length; selectWord(); });
document.getElementById('addWord').addEventListener('click', ()=>{
  const v = document.getElementById('newWord').value.trim();
  if(!v) return;
  words.push(v);
  document.getElementById('newWord').value = '';
  currentIndex = words.length-1;
  renderWords();
  selectWord();
});
document.getElementById('toggleDayNight').addEventListener('click', ()=>{
  const night = phoneShell.classList.toggle('night-mode');
  phoneShell.classList.toggle('day-mode', !night);
  if(night){
    enterNightMode();
  } else {
    enterDayMode();
  }
});

document.getElementById('playAll').addEventListener('click', ()=>{
  let i=0;
  const interval = setInterval(()=>{
    currentIndex = i%words.length;
    selectWord();
    i++;
    if(i>words.length) clearInterval(interval);
  }, 1200);
});

// create waveform bars
const barsContainer = document.getElementById('waveBars');
for(let i=0;i<28;i++){
  const sp = document.createElement('span');
  sp.style.animationDelay = (Math.random()*1)+'s';
  sp.style.height = (8 + Math.random()*80)+'%';
  barsContainer.appendChild(sp);
}

function simulateWave(ms){
  // briefly increase heights
  const spans = barsContainer.querySelectorAll('span');
  spans.forEach(s=> s.style.transform = 'scaleY(1.2)');
  setTimeout(()=> spans.forEach(s=> s.style.transform = ''), ms||800);
}

function enterNightMode(){
  // camera off visually, show video thumbs for current word
  cameraBox.querySelector('.camera-view').textContent = 'Camera Off — night mode';
  document.getElementById('videoContent').innerHTML = createNightThumbnailsHTML(words[currentIndex]);
}

function enterDayMode(){
  // camera active, hide thumbnails, show helper text
  document.getElementById('videoContent').innerHTML = '<div class="video-placeholder">Day mode: camera active — video clips hidden</div>';
  cameraBox.querySelector('.camera-view').textContent = 'Camera On — assistant ready';
}

phoneShell.classList.add('day-mode');
renderWords();
selectWord();
