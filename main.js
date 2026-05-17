'use strict';

/* ══ LOADER ══ */
(function(){
  const pct=document.getElementById('ldPct');
  if(!pct)return;
  let n=0;
  const iv=setInterval(()=>{
    n=Math.min(n+Math.random()*18,100);
    pct.textContent=`CARGANDO SISTEMA... ${Math.round(n)}%`;
    if(n>=100){clearInterval(iv);setTimeout(()=>document.getElementById('loader').classList.add('gone'),300);}
  },120);
})();

/* ══ CURSOR ══ */
(function(){
  const cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
  if(!cur)return;
  let mx=0,my=0,f2x=0,f2y=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  (function raf(){f2x+=(mx-f2x)*.1;f2y+=(my-f2y)*.1;cur2.style.left=f2x+'px';cur2.style.top=f2y+'px';requestAnimationFrame(raf);})();
})();

/* ══ HEADER SCROLL ══ */
const _hdr=document.querySelector('header');
if(_hdr){
  window.addEventListener('scroll',()=>{
    _hdr.classList.toggle('on',scrollY>30);
    const btt=document.getElementById('btt');
    if(btt)btt.classList.toggle('show',scrollY>400);
  },{passive:true});
}

/* ══ BURGER ══ */
const _burger=document.getElementById('burger'),_mnav=document.getElementById('mnav');
if(_burger&&_mnav){
  _burger.addEventListener('click',()=>{_burger.classList.toggle('on');_mnav.classList.toggle('on');});
  document.querySelectorAll('.mnl').forEach(l=>l.addEventListener('click',()=>{_burger.classList.remove('on');_mnav.classList.remove('on');}));
}

/* ══ SMOOTH SCROLL ══ */
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const t=document.querySelector(a.getAttribute('href'));
  if(t){e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+scrollY-70,behavior:'smooth'});}
}));

/* ══ BACK TO TOP ══ */
const _btt=document.getElementById('btt');
if(_btt)_btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* ══ REVEAL ══ */
const _robs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');_robs.unobserve(e.target);}}),{threshold:.1,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.r').forEach(el=>_robs.observe(el));

/* ══ COUNTERS ══ */
function _count(el){
  const t=+el.dataset.target,dur=1800,s=performance.now();
  const up=now=>{const p=Math.min((now-s)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(e*t);if(p<1)requestAnimationFrame(up);};
  requestAnimationFrame(up);
}
const _cobs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('[data-target]').forEach(_count);_cobs.unobserve(e.target);}}),{threshold:.5});
document.querySelectorAll('.hero-stats,.ticker-inner').forEach(el=>_cobs.observe(el));

/* ══ HERO CANVAS ══ */
(function(){
  const cv=document.getElementById('heroCanvas');
  if(!cv)return;
  const ctx=cv.getContext('2d');
  let W,H,pts=[];
  function resize(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;}
  class Pt{
    constructor(){this.reset();}
    reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.35;this.vy=(Math.random()-.5)*.35;this.r=Math.random()*1.2+.4;this.a=Math.random()*.35+.05;}
    tick(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=`rgba(0,212,255,${this.a})`;ctx.fill();}
  }
  resize();pts=Array.from({length:90},()=>new Pt());
  let mx=-999,my=-999;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  (function loop(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{p.tick();p.draw();});
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(0,212,255,${(1-d/120)*.1})`;ctx.lineWidth=.6;ctx.stroke();}
    }
    pts.forEach(p=>{const dx=mx-p.x,dy=my-p.y,d=Math.sqrt(dx*dx+dy*dy);if(d<180){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(mx,my);ctx.strokeStyle=`rgba(0,255,157,${(1-d/180)*.15})`;ctx.lineWidth=.8;ctx.stroke();}});
    requestAnimationFrame(loop);
  })();
  new ResizeObserver(resize).observe(cv);
})();

/* ══ TERMINAL ══ */
(function(){
  const body=document.getElementById('termBody');
  if(!body)return;
  const lines=[
    {text:'[OK] Conexión establecida',color:'var(--green)'},
    {text:'[OK] Módulos IA cargados',color:'var(--green)'},
    {text:'[OK] Web engine activo',color:'var(--green)'},
    {text:'[OK] Studio online',color:'var(--green)'},
    {text:'> Sistema listo // v3.0',color:'var(--accent)'},
  ];
  let li=0;
  function addLine(){
    if(li>=lines.length)return;
    const d=document.createElement('div');d.className='term-line';d.style.color=lines[li].color;d.textContent=lines[li].text;
    body.appendChild(d);li++;
    if(li<lines.length)setTimeout(addLine,700);
    else{const c=document.createElement('div');c.className='term-line';c.innerHTML='<span class="term-cursor"></span>';body.appendChild(c);}
  }
  setTimeout(addLine,1800);
})();

/* ══ CARD TILT ══ */
document.querySelectorAll('.div-card,.feat-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(800px) rotateX(${-y*5}deg) rotateY(${x*5}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='');
});

/* ══ MAGNETIC BTNS ══ */
document.querySelectorAll('.btn-primary,.btn-ghost,.cta-hdr').forEach(b=>{
  b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.12,y=(e.clientY-r.top-r.height/2)*.12;b.style.transform=`translate(${x}px,${y}px)`;});
  b.addEventListener('mouseleave',()=>b.style.transform='');
});

/* ══ PARALLAX HERO ══ */
window.addEventListener('scroll',()=>{
  const el=document.querySelector('.hero-content,.sub-hero-content');
  if(el&&scrollY<innerHeight)el.style.transform=`translateY(${scrollY*.12}px)`;
},{passive:true});

/* ══ FORM ══ */
const _form=document.getElementById('cForm');
if(_form)_form.addEventListener('submit',e=>{
  e.preventDefault();
  const btn=_form.querySelector('button[type="submit"]'),ok=document.getElementById('formOk'),orig=btn.innerHTML;
  btn.innerHTML='ENVIANDO...';btn.disabled=true;
  setTimeout(()=>{btn.innerHTML=orig;btn.disabled=false;ok.classList.add('show');_form.reset();setTimeout(()=>ok.classList.remove('show'),6000);},1600);
});

/* ══ PROCESO LINE ANIMATION ══ */
(function(){
  const sec = document.querySelector('.proceso-section');
  if(!sec) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ sec.classList.add('line-visible'); obs.unobserve(e.target); }
    });
  }, {threshold: 0.2});
  obs.observe(sec);
})();
