(function () {
    const I18N = { lang: "ko", dict: {} };
  
    async function loadLocale(lang) {
      const res = await fetch(`/locales/${lang}.json`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load locale: " + lang);
      return res.json();
    }

    function renderTemplate(str, vars = {}) {
      return str.replace(/\{(\w+)\}/g, (_, k) =>
        vars[k] != null ? vars[k] : `{${k}}`
      );
    }
  
    function applyI18n(root = document, vars = {}) {
      root.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        let value = I18N.dict[key];
        if (value == null) return;
  
        value = renderTemplate(value, vars);
  
        const isHtml = el.getAttribute("data-i18n-html") === "true";
        const attr = el.getAttribute("data-i18n-attr");
  
        if (attr) {
          el.setAttribute(attr, value);
        } else if (isHtml) {
          el.innerHTML = value; // ⚠ 신뢰된 문자열만
        } else {
          el.textContent = value;
        }
      });
  
      document.documentElement.lang = I18N.lang;
    }

    function updateLangButtons(lang) {
      document
        .querySelectorAll(".sh_tip [data-lang]")
        .forEach((btn) => {
          btn.classList.toggle("active", btn.dataset.lang === lang);
          btn.setAttribute(
            "aria-pressed",
            btn.dataset.lang === lang ? "true" : "false"
          );
      });
    }  
  
    async function setLanguage(lang) {
      I18N.lang = lang;
      I18N.dict = await loadLocale(lang);
      localStorage.setItem("lang", lang);
      applyI18n(document);
      updateLangButtons(lang);
    }
  
    // ✅ 전역 공개 (메뉴바 onclick이 찾을 수 있게)
    window.setLanguage = setLanguage;
  
    document.addEventListener("DOMContentLoaded", async () => {
      const saved = localStorage.getItem("lang");
      const browserLang = navigator.language.startsWith("ko") ? "ko" : "en";
      await setLanguage(saved || browserLang);
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".sh_tip [data-lang]");
      if (!btn) return;
      setLanguage(btn.dataset.lang);
    });
  
    // (선택) 메뉴바를 나중에 로드한 뒤에도 번역 적용할 때 쓰라고 노출
    window.applyI18n = applyI18n;
})();  