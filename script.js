const screens = [...document.querySelectorAll('.screen')];
const state = { date:'', time:'', activity:'' };

function showScreen(name){
  screens.forEach(s => s.classList.toggle('active', s.dataset.screen === name));
}

document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.next));
});

const dateInput = document.getElementById('dateInput');
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().slice(0,10);

document.getElementById('scheduleForm').addEventListener('submit', e => {
  e.preventDefault();
  state.date = dateInput.value;
  state.time = document.getElementById('timeInput').value;
  showScreen('mood');
});

const activityButtons = [...document.querySelectorAll('#activityGrid button')];
const activityNext = document.getElementById('activityNext');
activityButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    activityButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.activity = btn.dataset.activity;
    activityNext.disabled = false;
  });
});

activityNext.addEventListener('click', () => {
  const d = state.date ? new Date(state.date + 'T00:00:00') : null;
  const prettyDate = d ? d.toLocaleDateString(undefined,{month:'short',day:'numeric'}) : 'our date';
  const shortTime = (state.time || '6:00 PM').replace(':00','');
  document.getElementById('finalTime').textContent = shortTime;
  document.getElementById('finalPlan').textContent = `${prettyDate} • ${state.time || '6:00 PM'} • ${state.activity}`;
  showScreen('done');
});

// Playful moving "no" button, like the reel.
const noBtn = document.getElementById('noBtn');
const choiceArea = document.getElementById('choiceArea');
function dodgeNo(){
  const area = choiceArea.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();
  const maxX = Math.max(0, area.width - btn.width);
  const maxY = Math.max(0, area.height - btn.height);
  noBtn.style.position = 'absolute';
  noBtn.style.left = Math.random() * maxX + 'px';
  noBtn.style.top = Math.random() * maxY + 'px';
}
['mouseenter','touchstart','pointerdown'].forEach(evt => noBtn.addEventListener(evt, dodgeNo, {passive:true}));

document.getElementById('restartBtn').addEventListener('click', () => {
  state.date=''; state.time=''; state.activity='';
  dateInput.value=''; document.getElementById('timeInput').value='';
  activityButtons.forEach(b=>b.classList.remove('selected'));
  activityNext.disabled=true;
  noBtn.removeAttribute('style');
  showScreen('intro');
});
