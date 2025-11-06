// ETHRION vFX — neon flow + orb + pulse grid + radar
const $=s=>document.querySelector(s);

// Reveal on scroll
const io=new IntersectionObserver((ents)=>{ents.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// --- Neon background (Perlin-like flow)
(function(){
  const c=document.getElementById('bg'); if(!c) return;
  const x=c.getContext('2d'); let W,H; function R(){W=c.width=innerWidth;H=c.height=innerHeight;} R(); addEventListener('resize',R);
  const P=Array.from({length:140},()=>({x:Math.random()*W,y:Math.random()*H,s:.3+Math.random()*.7,h:190+Math.random()*140}));
  let t=0; function F(x,y,t){return Math.sin(x*.0016+t*.0021)+Math.cos(y*.0013-t*.0017);}
  (function step(){t+=1; x.clearRect(0,0,W,H);
    for(const p of P){const a=F(p.x,p.y,t)*Math.PI; p.x+=Math.cos(a)*p.s; p.y+=Math.sin(a)*p.s;
      if(p.x<0||p.x>W||p.y<0||p.y>H){p.x=Math.random()*W;p.y=Math.random()*H;}
      const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,18); g.addColorStop(0,`hsla(${p.h},90%,75%,.22)`); g.addColorStop(1,`hsla(${p.h},90%,75%,0)`);
      x.fillStyle=g; x.beginPath(); x.arc(p.x,p.y,18,0,Math.PI*2); x.fill();}
    requestAnimationFrame(step);
  })();
})();

// --- Co-evolution Orb (dual ring)
(function(){
  const c=document.getElementById('orb'); if(!c) return;
  const x=c.getContext('2d'); let W,H; function R(){W=c.width=innerWidth;H=c.height=innerHeight;} R(); addEventListener('resize',R);
  const N=200; const pts=Array.from({length:N},(_,i)=>({a:Math.random()*Math.PI*2,r:90+Math.random()*240,s:.003+.002*Math.random(),h:i%2?220:320}));
  (function step(){x.clearRect(0,0,W,H); const cx=W*.5, cy=H*.36;
    pts.forEach((p,i)=>{p.a+=p.s*(i%2?1:-1); const px=cx+Math.cos(p.a)*p.r; const py=cy+Math.sin(p.a)*p.r*.58;
      const g=x.createRadialGradient(px,py,0,px,py,12); g.addColorStop(0,`hsla(${p.h},95%,70%,.45)`); g.addColorStop(1,`hsla(${p.h},95%,70%,0)`);
      x.fillStyle=g; x.beginPath(); x.arc(px,py,12,0,Math.PI*2); x.fill();});
    requestAnimationFrame(step);
  })();
})();

// --- Pulsing holo grid
(function(){
  const c=document.getElementById('grid'); if(!c) return; const g=c.getContext('2d');
  let W,H; function R(){W=c.width=innerWidth;H=c.height=innerHeight;} R(); addEventListener('resize',R);
  (function step(){g.clearRect(0,0,W,H); g.strokeStyle='rgba(180,200,255,.09)'; g.lineWidth=1;
    const s=48; const off = (Math.sin(performance.now()*0.001)*8);
    for(let x=off% s; x<W; x+=s){g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke();}
    for(let y=off% s; y<H; y+=s){g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke();}
    requestAnimationFrame(step);
  })();
})();

// --- LQ Radar
(function(){
  const c=document.getElementById('radar'); if(!c) return; const ctx=c.getContext('2d'); const N=8;
  let vals=Array.from({length:N},()=>0.6+Math.random()*0.35);
  function draw(){const W=c.width,H=c.height,cx=W/2,cy=H/2,R=Math.min(W,H)*.38; ctx.clearRect(0,0,W,H);
    for(let ring=1; ring<=5; ring++){const r=R*ring/5; ctx.beginPath(); for(let i=0;i<N;i++){const a=-Math.PI/2+i*(2*Math.PI/N); const x=cx+Math.cos(a)*r; const y=cy+Math.sin(a)*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.closePath(); ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.stroke();}
    for(let i=0;i<N;i++){const a=-Math.PI/2+i*(2*Math.PI/N); const x=cx+Math.cos(a)*R; const y=cy+Math.sin(a)*R; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y); ctx.strokeStyle='rgba(255,255,255,.1)'; ctx.stroke();}
    ctx.beginPath(); for(let i=0;i<N;i++){const a=-Math.PI/2+i*(2*Math.PI/N); const r=R*vals[i]; const x=cx+Math.cos(a)*r; const y=cy+Math.sin(a)*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.closePath();
    const grad=ctx.createLinearGradient(0,0,W,H); grad.addColorStop(0,'rgba(125,211,252,.35)'); grad.addColorStop(1,'rgba(167,139,250,.35)'); ctx.fillStyle=grad; ctx.fill();
    ctx.lineWidth=2; ctx.strokeStyle='rgba(167,139,250,.85)'; ctx.stroke();
  } draw();
  $('#rnd')?.addEventListener('click',()=>{ vals=Array.from({length:N},()=>0.55+Math.random()*0.4); draw(); });
  $('#exp')?.addEventListener('click',()=>{ const data={vals, LQ_comp: Number((vals.reduce((a,b)=>a+b,0)/N).toFixed(3))}; const blob=new Blob([JSON.stringify({timestamp:new Date().toISOString(), data}, null, 2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ethrion_lq_sample.json'; a.click(); URL.revokeObjectURL(a.href); });
})();