import { config } from 'dotenv'
import { getAllPostContents } from './src/assets/js/posts-fetcher'
import {
  createBlogPostPageRoutes,
  createBlogPostListPageRoutes
} from './src/assets/js/routes-creator'

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
    // Generate dynamic routes
    async routes() {
      const allPostContents = await getAllPostContents()
      const blogPostPageRoutes = createBlogPostPageRoutes(allPostContents)
      // Show blog post list pages without generating
      if (process.env.NUXT_ENV_GENERATING_BLOG_POST_LIST_PAGES == null)
        return blogPostPageRoutes
      // Generate blog post list pages
      const create = createBlogPostListPageRoutes
      const blogPostListPageRoutes = create(allPostContents)
      return [...blogPostPageRoutes, ...blogPostListPageRoutes]
    },

    // To show blog post list pages without generating
    // If no file matches, request must be redirected to 404.html
    fallback: process.env.NUXT_ENV_GENERATE_FALLBACK_FILE_NAME || true
  }
}
