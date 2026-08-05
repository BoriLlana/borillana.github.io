// year
document.getElementById('year').textContent = new Date().getFullYear();

// theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// nav scrolled state
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 10));

// mobile menu
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// headshot presence
const photoImg = document.querySelector('#photo img');
if (photoImg.complete && photoImg.naturalWidth > 0) document.getElementById('photo').classList.add('has-img');
photoImg.addEventListener('load', () => { if (photoImg.naturalWidth > 0) document.getElementById('photo').classList.add('has-img'); });

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// publication filters (status AND topic)
const pubs = document.querySelectorAll('.pub[data-cat]');
let curStatus = 'all', curTopic = 'all';

function applyFilters(){
  pubs.forEach(p => {
    const okStatus = curStatus === 'all' || p.dataset.cat === curStatus;
    const topics = (p.dataset.topics || '').split(' ');
    const okTopic = curTopic === 'all' || topics.includes(curTopic);
    p.style.display = (okStatus && okTopic) ? 'flex' : 'none';
  });
}

function wireGroup(selector, onPick){
  const btns = document.querySelectorAll(selector + ' .chip-btn');
  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    onPick(btn);
    applyFilters();
  }));
}
wireGroup('#statusFilters', btn => { curStatus = btn.dataset.filter; });
wireGroup('#topicFilters',  btn => { curTopic  = btn.dataset.topic; });

// Google Scholar stats: read the JSON that the GitHub Action refreshes.
fetch('scholar-stats.json', { cache: 'no-store' })
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(d => {
    let hasData = false;
    document.querySelectorAll('#scholarStats [data-stat]').forEach(el => {
      const v = d[el.dataset.stat];
      if (v !== null && v !== undefined) { el.textContent = Number(v).toLocaleString(); hasData = true; }
    });
    const upd = document.getElementById('statUpdated');
    if (hasData && d.updated) {
      upd.innerHTML = '<span class="live-dot"></span>Updated ' + d.updated + ' from Google Scholar';
    } else if (!hasData) {
      upd.innerHTML = '<span class="live-dot"></span>Syncing with Google Scholar…';
    }
  })
  .catch(() => {
    const upd = document.getElementById('statUpdated');
    if (upd) upd.innerHTML = '<span class="live-dot"></span>Stats sync pending';
  });
