import Vue from 'vue'
import { config as configureDotenv } from 'dotenv'
import { AxiosError } from 'axios'
import { NuxtConfig } from '@nuxt/types'
import { Configuration as WebpackConfiguration } from 'webpack'
import { LOCALES, DEFAULT_LOCALE, LANG_DIR } from './src/constants/index'

configureDotenv()

const config: NuxtConfig = {
  target: 'static',

  mode: 'universal',

  srcDir: 'src/',

  components: true,

  /*
   ** Headers of the page
   */
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'noindex,nofollow,noarchive' }
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
  plugins: ['~/plugins/initialize-vee-validate', '~/plugins/inject-nav-state'],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://typescript.nuxtjs.org/ja/
    '@nuxt/typescript-build',

    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',

    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',

    // Create route files before building
    '~/modules/create-dynamic-route-list',

    // Create message files before building
    '~/modules/create-messages',

    // Doc: https://github.com/nuxt-community/nuxt-i18n
    [
      'nuxt-i18n',
      {
        lazy: true,
        langDir: LANG_DIR,
        locales: LOCALES,
        defaultLocale: DEFAULT_LOCALE,
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
    extend(config: WebpackConfiguration) {
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
    async routes() {
      // JSON file doesn't exist before building
      const { default: routes } = await import(
        /* webpackChunkName: "[request]" */
        './src/assets/json/routes/dynamic.json'
      )
      return routes
    },

    fallback: process.env.NUXT_ENV_GENERATE_FALLBACK_FILE_NAME || true
  },

  vue: {
    config: {
      /*
       ** Global error handler
       */
      errorHandler(error: Error | AxiosError, vm: Vue) {
        let statusCode = 500
        if ('response' in error && typeof error.response !== 'undefined') {
          statusCode = error.response.status
        }
        // Show error page
        vm.$nuxt.error({
          statusCode,
          message: error.message
        })
      }
    }
  }
}

/**
 * Private environment variables
 */
const privateEnvironmentValues = {
  NUXT_PRIVATE_ENV_CONTENT_API_KEY:
    process.env.NUXT_PRIVATE_ENV_CONTENT_API_KEY || '',
  NUXT_PRIVATE_ENV_FORM_API_KEY: process.env.NUXT_PRIVATE_ENV_FORM_API_KEY || ''
}
// Don't expose to client
if (process.env.NODE_ENV === 'production') {
  config.privateRuntimeConfig = privateEnvironmentValues
}
// Expose to client because asyncData is run in development
else if (process.env.NODE_ENV === 'development') {
  config.env = privateEnvironmentValues
}

export default config
