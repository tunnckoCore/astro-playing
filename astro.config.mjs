import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
// import image from "@astrojs/image";
// import { astroImageTools } from "astro-imagetools";

// import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    // astroImageTools,
    // image({
    //   // serviceEntryPoint: "@astrojs/image/sharp",
    // }),
  ],
  // output: "server",
  // adapter: vercel()
});
