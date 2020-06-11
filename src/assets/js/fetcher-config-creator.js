/**
 * In client side, dotenv must not be imported
 * So dotenv is imported not in this module but nuxt.config.js
 *
 * On server side, if objects are exported, they will occur errors
 * Because they are read before dotenv.config() in nuxt.config.js
 * So this module exports functions
 */

function createBase() {
  return {
    timeout: 0,
    headers: { 'X-API-KEY': process.env.NUXT_ENV_API_KEY }
  }
}

export function createForSiteData() {
  return {
    ...createBase(),
    baseURL: `${process.env.NUXT_ENV_API_URL}/site-data`,
    params: {
      fields: 'title,description,ogImage'
    }
  }
}

export function createForPages() {
  return {
    ...createBase(),
    baseURL: `${process.env.NUXT_ENV_API_URL}/pages`,
    params: {
      fields: 'title,description,ogImage,texts,images'
    }
  }
}

export function createForPosts() {
  return {
    ...createBase(),
    baseURL: `${process.env.NUXT_ENV_API_URL}/posts`,
    params: {
      fields: 'title,description,featuredImage,content,category,tags,author'
    }
  }
}
