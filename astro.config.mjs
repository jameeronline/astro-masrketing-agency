// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";

import alpinejs from "@astrojs/alpinejs";

import react from "@astrojs/react";

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

  // Disable prefetch globally
  prefetch: false,

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [alpinejs(), react()]
});