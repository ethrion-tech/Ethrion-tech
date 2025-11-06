// ETHRION i18n — simple loader (ko/en/ja)
(function(){
  const key='ETHRION_LANG';
  async function load(lang){
    try{
      const res = await fetch(`/i18n/${lang}.json`);
      const dict = await res.json();
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const k=el.getAttribute('data-i18n'); if(dict[k]) el.textContent = dict[k];
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
        const k=el.getAttribute('data-i18n-placeholder'); if(dict[k]) el.setAttribute('placeholder', dict[k]);
      });
      localStorage.setItem(key, lang);
    }catch(e){ console.warn('i18n load failed', e); }
  }
  function init(){
    const stored = localStorage.getItem(key) || 'ko';
    const sel = document.getElementById('langSel');
    if(sel){ sel.value = stored; sel.addEventListener('change',()=> load(sel.value)); }
    load(stored);
  }
  document.addEventListener('DOMContentLoaded', init);
})();