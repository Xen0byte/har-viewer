/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from "vite";
import ViteVuePlugin from "@vitejs/plugin-vue";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import ViteFaviconsInjectPlugin from "vite-plugin-favicons-inject";
import { VitePWA } from "vite-plugin-pwa";

import cssnano from "cssnano";
import postcssImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";

import {
  description,
  author,
  dependencies,
  homepage,
  license,
  version,
} from "./package.json";

const publicUrl = process.env.DEPLOY
  ? "/har-viewer/"
  : "/";

export default defineConfig(({ mode }) => {
  const config = {
    base: publicUrl,
    define: {
      APP: JSON.stringify(description),
      AUTHOR_NAME: JSON.stringify(author.name),
      AUTHOR_URL: JSON.stringify(author.url),
      HOMEPAGE: JSON.stringify(homepage),
      LICENSE: JSON.stringify(license),
      VERSION: JSON.stringify(version),
    },
    build: {
      emptyOutDir: true,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name].[hash].min.js",
          manualChunks: Object
            .keys(dependencies)
            .filter(key => !["@mdi/svg"].includes(key))
            .reduce((chunks, name) => {
              // eslint-disable-next-line no-param-reassign
              chunks[name] = [name];
              return chunks;
            }, {}),
          assetFileNames: ({ name }) => {
            if (/\.woff2?$/.test(name)) {
              return "fonts/[name].[hash][extname]";
            }

            if (/\.svg$/.test(name)) {
              return "img/[name].[hash].min[extname]";
            }

            if (/\.css$/.test(name)) {
              return "css/[name].[hash].min[extname]";
            }

            if (/\.webmanifest$/.test(name)) {
              return "assets/[name][extname]";
            }

            return "assets/[name].[hash][extname]";
          },
        },
      },
    },
    plugins: [
      ViteFaviconsInjectPlugin("./src/assets/icon.svg", {
        manifestMaskable: "./src/assets/icon_mask.svg",
        appShortName: "HAR Viewer",
        appName: description,
        appDescription: `${description} (v${version})`,
        developerName: author.name,
        developerURL: author.url,
        background: "#e4e9f2",
        theme_color: "#3f51b5",
        version,
        start_url: publicUrl,
        icons: {
          yandex: false,
        },
      }),
      ViteVuePlugin(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        manifest: false,
      }),
      ViteMinifyPlugin({
        removeComments: true,
      }),
    ],
    css: {
      postcss: {
        plugins: [
          postcssImport,
          postcssPresetEnv,
          ...(mode === "production" ? [cssnano] : []),
        ],
      },
    },
  };

  return config;
});
