// ETHRION i18n — full apply + EN default + fallback
(function () {
  const STORAGE_KEY = 'ETHRION_LANG';
  const FALLBACK = 'en';

  async function fetchDict(lang) {
    try {
      const res = await fetch(`/i18n/${lang}.json`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[i18n] load failed for ${lang}`, e);
      if (lang !== FALLBACK) return fetchDict(FALLBACK);
      return {};
    }
  }

  function applyDict(dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (dict[k] != null) el.textContent = dict[k];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const k = el.getAttribute('data-i18n-placeholder');
      if (dict[k] != null) el.setAttribute('placeholder', dict[k]);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const k = el.getAttribute('data-i18n-html');
      if (dict[k] != null) el.innerHTML = dict[k];
    });
  }

  async function setLang(lang) {
    const dict = await fetchDict(lang);
    applyDict(dict);
    document.documentElement.setAttribute('lang', lang);
    const sel = document.getElementById('langSel');
    if (sel) sel.value = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function init() {
    const sel = document.getElementById('langSel');
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = stored || FALLBACK;
    if (sel) sel.addEventListener('change', () => setLang(sel.value));
    setLang(initial);
  }

  document.addEventListener('DOMContentLoaded', init);
})();