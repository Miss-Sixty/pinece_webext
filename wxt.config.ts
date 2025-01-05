import { defineConfig } from 'wxt';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    permissions: [
      "bookmarks",
      "*://*.clearbit.com/*",
      "*://*.icon.horse/*"
    ],
    host_permissions: [
      "*://*.clearbit.com/*",
      "*://*.icon.horse/*"
    ]
  },
  vite: () => ({
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ElementPlus({}),
    ],
  }),
});
