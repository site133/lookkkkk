import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sharp from "sharp";
import config from "./src/config/config.json";

// Configuration corrigée pour Cloudflare Pages
export default defineConfig({
  output: 'static', // Essential pour Cloudflare
  site: config.site.base_url || "https://examplesite.com", // Utilisation de || pour les fallbacks
  base: config.site.base_path || "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  
  // Optimisation des assets
  image: { 
    service: sharp(),
    domains: [] // Ajoutez vos domaines d'images si nécessaire
  },
  
  // Configuration Vite corrigée
  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 0, // Désactive l'inlining des assets
      cssCodeSplit: true    // Active le split CSS
    },
    ssr: {
      noExternal: ['react-icons'] // Si vous utilisez react-icons
    }
  },

  // Intégrations
  integrations: [
    react(),
    sitemap(),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],

  // Markdown config
  markdown: {
    remarkPlugins: [
      remarkToc, 
      [remarkCollapse, { 
        test: "Table of contents",
        summary: "Afficher le sommaire" 
      }]
    ],
    shikiConfig: { 
      theme: "one-dark-pro", 
      wrap: true 
    },
    syntaxHighlight: 'shiki' // Explicitement défini
  }
});
