/**
 * @file        i18n.js
 * @brief       다국어 로케일 로딩 및 data-i18n 요소 치환
 * @author      LEEHYEONHO (owen0414@neobh.kr)
 * @date        2026-08-27
 *
 * Copyright (c) 2026 NeoBH. All rights reserved.
 *
 * WARNING: This corporate source code is the intellectual property of NeoBH.
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium is strictly prohibited. Proprietary and confidential.
 */

(function () {
    const I18N = { lang: "ko", dict: {} };
    let readyResolve;
    const ready = new Promise((res) => (readyResolve = res));
  
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

    function applyLinksByLang(root = document) {
      const lang = I18N.lang || 'ko';
      root.querySelectorAll('a[data-href-ko], a[data-href-en]').forEach(a => {
        const next = a.getAttribute(`data-href-${lang}`);
        if (next) a.setAttribute('href', next);
      });
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
          if (attr === "value" && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
            el.value = value;                 // ✅ 핵심
          } else {
            el.setAttribute(attr, value);
          }
        } else if (isHtml) {
          el.innerHTML = value; // ⚠ 신뢰된 문자열만
        } else {
          el.textContent = value;
        }
      });
  
      document.documentElement.lang = I18N.lang;
      updateLangButtons(I18N.lang);
      applyLinksByLang(root);
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
      readyResolve();
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".sh_tip [data-lang]");
      if (!btn) return;
      setLanguage(btn.dataset.lang);
    });
  
    // (선택) 메뉴바를 나중에 로드한 뒤에도 번역 적용할 때 쓰라고 노출
    window.i18n = window.i18n || {};
    window.i18n.refresh = () => applyI18n(document);
    window.i18n = {
      ready,                 // 컴포넌트 로더가 await 할 것
      setLanguage,           // 언어 변경
      refresh: (root) => applyI18n(root || document), // 특정 영역만 재적용 가능
      getLang: () => I18N.lang
    };  
})();  