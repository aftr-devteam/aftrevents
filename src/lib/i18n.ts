import { useState, useEffect, useCallback } from "react";

type Lang = "en" | "es";

let currentLang: Lang = "en";
const listeners = new Set<() => void>();

export function setLang(lang: Lang) {
  currentLang = lang;
  listeners.forEach(fn => fn());
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(currentLang);

  useEffect(() => {
    const listener = () => setLangState(currentLang);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const toggle = useCallback(() => {
    const next = currentLang === "en" ? "es" : "en";
    setLang(next);
  }, []);

  const t = useCallback((en: string, es: string) => {
    return lang === "en" ? en : es;
  }, [lang]);

  return { lang, toggle, t, setLang };
}
