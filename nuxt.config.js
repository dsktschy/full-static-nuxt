import { config } from 'dotenv'
import { langDir, locales, defaultLocale } from './src/assets/json/variables'
import { createDynamicRoutes } from './src/assets/js/routes-creator'

config()

export default {
  target: 'static',

  mode: 'universal',

  srcDir: 'src/',

  /*
   ** Headers of the page
   */
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],

    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ccc' },

  /*
   ** Global CSS
   */
  css: ['sanitize.css', 'reset-css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/initialize-vee-validate', '~/plugins/inject-global'],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    ['@nuxtjs/dotenv', { path: __dirname }],

    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',

    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',

    // Create message files before building
    '~/modules/create-messages',

    // Doc: https://github.com/nuxt-community/nuxt-i18n
    [
      'nuxt-i18n',
      {
        lazy: true,
        langDir,
        locales,
        defaultLocale,
        vueI18n: {
          warnHtmlInMessage: 'off'
        }
      }
    ]
  ],

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.node = {
        fs: 'empty'
      }
    },

    /*
     ** Transpiling configuration
     */
    transpile: ['vue-agile', 'vee-validate/dist/rules']
  },

  /*
   ** Generating configuration
   */
  generate: {
    routes: createDynamicRoutes,

    // To show blog post list pages without generating
    // If no file matches, request must be redirected to 404.html
    fallback: process.env.NUXT_ENV_GENERATE_FALLBACK_FILE_NAME || true
  }
}
