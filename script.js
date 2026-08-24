// ============================================
// EF SET Study Agenda - Shared Scripts
// ============================================

// Toggle task completion
function toggle(el) {
  el.classList.toggle('done');
  const title = el.nextElementSibling?.querySelector('.task-title');
  if (title) title.classList.toggle('done', el.classList.contains('done'));
  saveProgress();
  updateProgress();
}

// Update progress bar
function updateProgress() {
  const total = document.querySelectorAll('.task-check').length;
  const done = document.querySelectorAll('.task-check.done').length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const textEl = document.getElementById('progress-text');
  const fillEl = document.getElementById('progress-fill');
  if (textEl) textEl.textContent = pct + '%';
  if (fillEl) fillEl.style.width = pct + '%';
}

// Switch week tabs
function switchWeek(n) {
  document.querySelectorAll('.week-tab').forEach((b, i) => b.classList.toggle('active', i === n));
  document.querySelectorAll('.week-panel').forEach((p, i) => p.classList.toggle('active', i === n));
  localStorage.setItem('efset_active_week', n);
}

// Save progress to localStorage
function saveProgress() {
  const checks = document.querySelectorAll('.task-check');
  const state = Array.from(checks).map(c => c.classList.contains('done'));
  localStorage.setItem('efset_progress', JSON.stringify(state));
}

// Load progress from localStorage
function loadProgress() {
  const saved = localStorage.getItem('efset_progress');
  if (!saved) return;
  try {
    const state = JSON.parse(saved);
    const checks = document.querySelectorAll('.task-check');
    checks.forEach((c, i) => {
      if (state[i]) c.classList.add('done');
    });
    checks.forEach(c => {
      const title = c.nextElementSibling?.querySelector('.task-title');
      if (title && c.classList.contains('done')) title.classList.add('done');
    });
  } catch(e) {}

  const savedWeek = localStorage.getItem('efset_active_week');
  if (savedWeek !== null) switchWeek(parseInt(savedWeek));
}

// Copy text to clipboard
function copyText(el) {
  const text = el.closest('.template-card').querySelector('.template-body').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = el;
    const original = btn.innerText;
    btn.innerText = '✓ Copiado!';
    setTimeout(() => btn.innerText = original, 1500);
  });
}

// Flashcard flip
function flipCard(el) {
  el.classList.toggle('flipped');
}

// ============================================
// SIMULADOR
// ============================================
function updateSim() {
  const sp = +document.getElementById('s-speaking')?.value || 0;
  const wr = +document.getElementById('s-writing')?.value || 0;
  const li = +document.getElementById('s-listening')?.value || 0;
  const re = +document.getElementById('s-reading')?.value || 0;

  const vsp = document.getElementById('v-speaking');
  const vwr = document.getElementById('v-writing');
  const vli = document.getElementById('v-listening');
  const vre = document.getElementById('v-reading');
  if (vsp) vsp.textContent = sp;
  if (vwr) vwr.textContent = wr;
  if (vli) vli.textContent = li;
  if (vre) vre.textContent = re;

  const avg = (sp + wr + li + re) / 4;
  const res = document.getElementById('sim-result');
  const scoreEl = document.getElementById('res-score');
  const levelEl = document.getElementById('res-level');
  if (!res || !scoreEl || !levelEl) return;

  scoreEl.textContent = avg.toFixed(1);

  let level = '';
  if (avg < 20) level = 'A0 Novice';
  else if (avg < 30) level = 'A1 Beginner';
  else if (avg < 40) level = 'A2 Elementary';
  else if (avg < 50) level = 'B1 Intermediate';
  else if (avg < 60) level = 'B2 Upper Intermediate';
  else if (avg < 70) level = 'C1 Advanced';
  else level = 'C2 Proficiency';

  if (avg >= 48) {
    res.className = 'sim-result win';
    levelEl.innerHTML = level + ' — <strong>🎉 Wellington supera o João!</strong>';
  } else {
    res.className = 'sim-result lose';
    levelEl.innerHTML = level + ' — ainda não passa do João (47)';
  }

  localStorage.setItem('efset_sim', JSON.stringify({sp, wr, li, re}));
}

function loadSim() {
  const saved = localStorage.getItem('efset_sim');
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    const s = document.getElementById('s-speaking');
    const w = document.getElementById('s-writing');
    const l = document.getElementById('s-listening');
    const r = document.getElementById('s-reading');
    if (s) s.value = data.sp;
    if (w) w.value = data.wr;
    if (l) l.value = data.li;
    if (r) r.value = data.re;
    updateSim();
  } catch(e) {}
}

// ============================================
// FLASHCARDS FILTER
// ============================================
function filterCards(category) {
  document.querySelectorAll('.flashcard').forEach(card => {
    const cat = card.dataset.category;
    if (category === 'all' || cat === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  updateProgress();
  loadSim();
});
