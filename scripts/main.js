/* Girgis Mirzek Ibrahim — portfolio behaviour: theme, nav, reveal, active link */
const root=document.documentElement,tb=document.getElementById('theme');
let t;try{t=localStorage.getItem('theme')}catch(e){}
if(!t)t=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
function set(v){root.dataset.theme=v;const nx=v==='dark'?'Switch to light mode':'Switch to dark mode';tb.setAttribute('aria-label',nx);tb.title=nx;try{localStorage.setItem('theme',v)}catch(e){}}
set(t);tb.onclick=()=>set(root.dataset.theme==='dark'?'light':'dark');
const m=document.getElementById('menu'),l=document.getElementById('links');
m.onclick=()=>m.setAttribute('aria-expanded',l.classList.toggle('open'));
l.onclick=e=>{if(e.target.tagName==='A'){l.classList.remove('open');m.setAttribute('aria-expanded','false')}};
addEventListener('keydown',e=>{if(e.key==='Escape'){l.classList.remove('open');m.setAttribute('aria-expanded','false')}});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(n=>io.observe(n));
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-40% 0px -55% 0px'});
document.querySelectorAll('main section').forEach(s=>so.observe(s));

/* Hero: writing effect — eyebrow, headline, intro and tech line type in sequence,
   then the buttons fade in. Reduced-motion users get the text instantly. */
(function () {
  const items = [...document.querySelectorAll('.hero [data-type]')];
  const cta = document.querySelector('.hero .cta');
  if (!items.length) return;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const plan = [];
  items.forEach((el) => {
    const chars = [];
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    (function wrap(node) {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span');
            w.className = 'word';
            w.setAttribute('aria-hidden', 'true');
            [...part].forEach((c) => {
              const s = document.createElement('span');
              s.className = 'ch';
              s.textContent = c;
              w.append(s);
              chars.push(s);
            });
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.classList.contains('pin')) {
          n.classList.add('ch'); chars.push(n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') wrap(n);
      });
    })(el);
    const sr = document.createElement('span');
    sr.className = 'sr';
    sr.textContent = text;
    el.append(sr);
    el.style.visibility = 'visible';
    plan.push({ chars, step: +el.dataset.type || 30 });
  });
  if (reduce) {
    plan.forEach((p) => p.chars.forEach((c) => c.classList.add('on')));
    cta && cta.classList.add('show');
    return;
  }
  let t = 350;
  plan.forEach(({ chars, step }) => {
    chars.forEach((c, i) => {
      setTimeout(() => {
        chars[i - 1] && chars[i - 1].classList.remove('cur');
        c.classList.add('on', 'cur');
      }, t + i * step);
    });
    t += chars.length * step;
    const last = chars[chars.length - 1];
    setTimeout(() => last && last.classList.remove('cur'), t + 120);
    t += 180;
  });
  setTimeout(() => cta && cta.classList.add('show'), t);
})();

/* ===== Append to scripts/main.js ===== */

/* Close the mobile menu when tapping outside it */
addEventListener('click',e=>{
  if(l.classList.contains('open')&&!e.target.closest('header.nav')){
    l.classList.remove('open');m.setAttribute('aria-expanded','false');
  }
});

