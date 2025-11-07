
// vFX graphics + LQ radar + reveal + i18n hooks (lang.js loads first)
(function(){
  // Helpers
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const rand=(a,b)=>a+Math.random()*(b-a);
  const TWO=Math.PI*2;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1));

  // Canvas setup
  const bg = document.getElementById('bg');
  const orb = document.getElementById('orb');
  const grid = document.getElementById('grid');
  const cvs=[bg,orb,grid].map(c=>{const ctx=c.getContext('2d'); return [c,ctx];});

  function resize(){
    const w = innerWidth, h = innerHeight;
    for(const [c,ctx] of cvs){ c.width = w*dpr; c.height = h*dpr; c.style.width=w+'px'; c.style.height=h+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); }
  }
  addEventListener('resize',resize,{passive:true}); resize();

  // BG Neon Flow (particles)
  const particles = Array.from({length: 140}, ()=> ({
    x: rand(0, innerWidth), y: rand(0, innerHeight),
    vx: rand(-0.6,0.6), vy: rand(-0.6,0.6), r: rand(0.6,1.8)
  }));

  // Orb (dual rings)
  let t=0;

  // Grid pulse
  function draw(){
    t += 0.016;
    // BG
    {
      const ctx = bg.getContext('2d');
      ctx.clearRect(0,0,innerWidth,innerHeight);
      for(const p of particles){
        p.x += p.vx; p.y += p.vy;
        if(p.x<0||p.x>innerWidth) p.vx*=-1;
        if(p.y<0||p.y>innerHeight) p.vy*=-1;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,TWO);
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
        g.addColorStop(0,'rgba(125,211,252,.8)');
        g.addColorStop(1,'rgba(167,139,250,0)');
        ctx.fillStyle=g; ctx.fill();
      }
    }
    // ORB
    {
      const ctx = orb.getContext('2d');
      ctx.clearRect(0,0,innerWidth,innerHeight);
      const cx=innerWidth/2, cy=innerHeight*0.28;
      const R1 = Math.min(innerWidth, innerHeight)*0.14;
      const R2 = R1*1.25;
      ctx.globalCompositeOperation='lighter';
      for(let k=0;k<90;k++){
        const a = t*0.8 + k*0.07;
        const r = R1 + Math.sin(a*1.7)*6;
        const x = cx + Math.cos(a)*r*1.1;
        const y = cy + Math.sin(a)*r*0.7;
        const g = ctx.createRadialGradient(x,y,0,x,y,10);
        g.addColorStop(0,'rgba(167,139,250,.9)');
        g.addColorStop(1,'rgba(167,139,250,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,3.2,0,TWO); ctx.fill();
      }
      for(let k=0;k<90;k++){
        const a = -t*0.9 + k*0.07;
        const r = R2 + Math.cos(a*1.3)*6;
        const x = cx + Math.cos(a)*r*1.15;
        const y = cy + Math.sin(a)*r*0.75;
        const g = ctx.createRadialGradient(x,y,0,x,y,10);
        g.addColorStop(0,'rgba(125,211,252,.9)');
        g.addColorStop(1,'rgba(125,211,252,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,2.8,0,TWO); ctx.fill();
      }
      ctx.globalCompositeOperation='source-over';
    }
    // GRID pulse
    {
      const ctx = grid.getContext('2d');
      ctx.clearRect(0,0,innerWidth,innerHeight);
      ctx.strokeStyle='rgba(255,255,255,.06)';
      const step = 40;
      for(let x=0;x<innerWidth;x+=step){
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,innerHeight); ctx.stroke();
      }
      for(let y=0;y<innerHeight;y+=step){
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(innerWidth,y); ctx.stroke();
      }
      // pulse
      const cx=innerWidth/2, cy=innerHeight*0.28;
      const r = (Math.sin(t*1.7)*0.5+0.5)*80+60;
      ctx.beginPath(); ctx.arc(cx,cy,r,0,TWO);
      ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=1.5; ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  draw();

  // Reveal on scroll
  const io = new IntersectionObserver(ents=>{
    for(const e of ents){ if(e.isIntersecting) e.target.classList.add('_on'); }
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // LQ Radar
  const formInputs = Array.from(document.querySelectorAll('#lq input[name^="c"]'));
  const rc = document.getElementById('radar');
  if(rc){
    const ctx = rc.getContext('2d');
    function vals(){ return formInputs.map(i=> clamp((+i.value||0)/100,0,1)); }
    function drawRadar(v){
      const W=rc.width, H=rc.height, cx=W/2, cy=H/2, R=Math.min(W,H)*.38, N=8;
      ctx.clearRect(0,0,W,H);
      // rings
      for(let ring=1; ring<=5; ring++){
        const r=R*ring/5; ctx.beginPath();
        for(let i=0;i<N;i++){ const a=-Math.PI/2+i*(TWO/N); const x=cx+Math.cos(a)*r; const y=cy+Math.sin(a)*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }
        ctx.closePath(); ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.stroke();
      }
      // spokes
      for(let i=0;i<N;i++){ const a=-Math.PI/2+i*(TWO/N); const x=cx+Math.cos(a)*R; const y=cy+Math.sin(a)*R; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y); ctx.strokeStyle='rgba(255,255,255,.1)'; ctx.stroke(); }
      // shape
      ctx.beginPath();
      for(let i=0;i<N;i++){ const a=-Math.PI/2+i*(TWO/N); const r=R*v[i]; const x=cx+Math.cos(a)*r; const y=cy+Math.sin(a)*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }
      ctx.closePath();
      const grad=ctx.createLinearGradient(0,0,W,H);
      grad.addColorStop(0,'rgba(125,211,252,.35)');
      grad.addColorStop(1,'rgba(167,139,250,.35)');
      ctx.fillStyle=grad; ctx.fill();
      ctx.lineWidth=2; ctx.strokeStyle='rgba(167,139,250,.85)'; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy,3,0,TWO); ctx.fillStyle='rgba(255,255,255,.7)'; ctx.fill();
    }
    formInputs.forEach(i=> i.addEventListener('input', ()=> drawRadar(vals())));
    drawRadar(vals());

    // buttons
    const rnd = document.getElementById('rnd');
    const exp = document.getElementById('exp');
    if(rnd) rnd.addEventListener('click', ()=>{ formInputs.forEach(i=> i.value = Math.round(rand(55,90))); drawRadar(vals()); });
    if(exp) exp.addEventListener('click', ()=>{
      const names=['Cognitive','Emotional','Creative','Strategic','Ethical','Systemic','SelfInsight','Resilience'];
      const v = vals(); const data = Object.fromEntries(names.map((n,i)=>[n, Number(v[i].toFixed(3))]));
      data['LQ_comp']= Number((Object.values(data).reduce((a,b)=>a+b,0)/8).toFixed(3));
      const blob = new Blob([JSON.stringify({timestamp:new Date().toISOString(), data}, null, 2)], {type:'application/json'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ethrion_lq_quick_assess.json'; a.click(); URL.revokeObjectURL(a.href);
    });
  }
})();
