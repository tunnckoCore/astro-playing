import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// import node from "@astrojs/node";
// import image from "@astrojs/image";
// import { astroImageTools } from "astro-imagetools";

// import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    // astroImageTools,
    // image({
    //   // serviceEntryPoint: "@astrojs/image/sharp",
    // }),
  ],
  // output: 'server',
  // adapter: node(),
});
