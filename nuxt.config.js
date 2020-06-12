import { config } from 'dotenv'
import { getAllContents } from './src/assets/js/posts-fetcher'

config()

export default {
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
  plugins: ['~/plugins/inject-site-data', '~/plugins/inject-total-posts'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    ['@nuxtjs/dotenv', { path: __dirname }]
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
    transpile: ['vue-agile']
  },
  /*
   ** Generating configuration
   */
  generate: {
    async routes() {
      const contentList = await getAllContents()
      return contentList.map((content) => ({
        route: `/blog/${content.id}`,
        payload: { content }
      }))
    },
    // To show blog post list pages without generating
    // If no file matches, must redirect to 404.html
    fallback: '404.html'
  }
}
