import { createClient } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const client = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
  environment: import.meta.env.CONTENTFUL_ENVIRONMENT,
});

// Cache for translations
let translationsCache = new Map();
let siteConfigCache = null;

export async function getSiteTranslations(siteName = 'Marketing Agency Website') {
  // Return cached translations if available
  if (translationsCache.has(siteName)) {
    //console.log('Using cached translations for site:', siteName);
    return translationsCache.get(siteName);
  }

  try {
    const response = await client.getEntries({
      content_type: 'localization', // Your content model ID
      'fields.siteName': siteName,
      limit: 1,
    });

    //console.log('Fetched translations from Contentful for site:', response.items[0].fields);

    if (response.items.length > 0) {
      const item = response.items[0].fields;
      const translations = {
        en: item.englishTranslations || {},
        ar: item.arabicTranslations || {},
        siteName: item.siteName
      };
      
      // Cache the translations
      translationsCache.set(siteName, translations);
      return translations;
    }

    console.warn(`No translations found for site: ${siteName}`);
    return getLocalTranslations(); // Fallback
  } catch (error) {
    console.error('Error fetching translations from Contentful:', error);
    return getLocalTranslations(); // Fallback
  }
}

export async function getTranslations(locale = 'en', siteName = 'Marketing Agency Website') {
  const siteTranslations = await getSiteTranslations(siteName);
  //console.log('Site translations for', siteName, ':', siteTranslations);
  return siteTranslations[locale] || {};
}

export async function getLanguages() {
  // Static languages since they're always the same
  return {
    en: 'English',
    ar: 'Arabic'
  };
}

// Fallback function using your local translations
function getLocalTranslations() {
  return {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.pricing': 'Pricing',
      'nav.blog': 'Blog',
      'nav.contact': 'Contact',
      'footer.title': 'Company',
      'footer.about': 'About Us',
      'footer.careers': 'Careers',
      'footer.press': 'Press',
      'footer.resources': 'Resources',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.contact': 'Contact Us',
      'footer.follow': 'Follow Us',
      'footer.copyright': '© {year} Company. All rights reserved.',
    },
    ar: {
      'nav.home': 'الرئيسية',
      'nav.about': 'حول',
      'nav.services': 'الخدمات',
      'nav.pricing': 'التسعير',
      'nav.blog': 'مدونة',
      'nav.contact': 'اتصل',
      'footer.title': 'الشركة',
      'footer.about': 'من نحن',
      'footer.careers': 'الوظائف',
      'footer.press': 'الصحافة',
      'footer.resources': 'الموارد',
      'footer.privacy': 'سياسة الخصوصية',
      'footer.terms': 'شروط الخدمة',
      'footer.contact': 'اتصل بنا',
      'footer.follow': 'تابعنا',
      'footer.copyright': '© {year} الشركة. جميع الحقوق محفوظة.',
    },
    siteName: 'Marketing Agency Website'
  };
}

// Fetch a single entry by slug, with locale fallback
export async function getEntryBySlug(contentType: string, slug: string, locale: string = 'en-US') {
  const entries = await client.getEntries({
    content_type: contentType,
    'fields.slug': slug,
    locale: locale,
  });
  if (!entries.items.length) return null;
  const entry = entries.items[0];
  
  // Render rich text fields
  if (entry.fields.pageContent) {
    entry.fields.pageContentHtml = documentToHtmlString(entry.fields.pageContent);
  }
  
  return entry.fields;
}

// Fetch all entries for a content type, paginated if needed
export async function getEntries(contentType: string, locale: string = 'en-US') {
  const entries = await client.getEntries({
    content_type: contentType,
    locale: locale,
  });
  return entries.items.map(item => {
    if (item.fields.pageContent) {
      item.fields.pageContentHtml = documentToHtmlString(item.fields.pageContent);
    }
    return item.fields;
  });
}