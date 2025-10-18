// import { ui, defaultLang } from './ui';

// export function getLangFromUrl(url: URL) {
//   const [, lang] = url.pathname.split('/');
//   if (lang in ui) return lang as keyof typeof ui;
//   return defaultLang;
// }

// export function useTranslations(lang: keyof typeof ui) {
//   return function t(key: keyof typeof ui[typeof defaultLang]) {
//     return ui[lang][key] || ui[defaultLang][key];
//   }
// }

// src/i18n/utils.js
import { getTranslations, getLanguages } from '@lib/contentful';

export const defaultLang = 'en';
export const siteName = 'Marketing Agency Website'; // You can make this dynamic

let languagesCache = null;

export async function getLanguagesList() {
  if (!languagesCache) {
    languagesCache = await getLanguages();
  }
  return languagesCache;
}

export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  const validLangs = ['en', 'ar'];
  return validLangs.includes(lang) ? lang : defaultLang;
}

export async function useTranslations(lang, customSiteName = siteName) {
  const translations = await getTranslations(lang, customSiteName);
  //console.log('Translations for', lang, ':', translations);
  
  return function t(key, vars = {}) {
    let text = translations[key] || key;
    
    // Replace variables like {year}
    if (vars && Object.keys(vars).length > 0) {
      Object.entries(vars).forEach(([variable, value]) => {
        text = text.replace(new RegExp(`\\{${variable}\\}`, 'g'), value);
      });
    }
    
    return text;
  };
}