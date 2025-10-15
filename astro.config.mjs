// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  i18n: {
      locales: ["en", "ar"],
      defaultLocale: "en",
      fallback: {
          ar: "en",
      },
      routing: {
          prefixDefaultLocale: true,
          fallbackType: "rewrite",
      }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [alpinejs()]
});