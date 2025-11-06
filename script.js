document.addEventListener('DOMContentLoaded',()=>{
const io=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');io.unobserve(x.target);}})},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
});
