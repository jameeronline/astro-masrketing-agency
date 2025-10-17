import { createClient } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const client = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
  environment: import.meta.env.CONTENTFUL_ENVIRONMENT,
});

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