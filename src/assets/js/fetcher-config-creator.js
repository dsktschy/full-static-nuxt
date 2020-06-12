/**
 * In client side, dotenv must not be imported
 * So dotenv is imported not in this module but nuxt.config.js
 *
 * On server side, if objects are exported, they will occur errors
 * Because they are read before dotenv.config() in nuxt.config.js
 * So this module exports functions
 */

import { postsPerRequestToPage } from '../json/variables'

function createBaseFetcherConfig() {
  return {
    timeout: 0,
    headers: { 'X-API-KEY': process.env.NUXT_ENV_API_KEY }
  }
}

export function createSiteDataFetcherConfig({ fields } = {}) {
  return {
    ...createBaseFetcherConfig(),
    baseURL: `${process.env.NUXT_ENV_API_URL}/site-data`,
    params: {
      fields: fields || 'title,description,ogImage'
    }
  }
}

export function createPagesFetcherConfig({ fields } = {}) {
  return {
    ...createBaseFetcherConfig(),
    baseURL: `${process.env.NUXT_ENV_API_URL}/pages`,
    params: {
      fields: fields || 'title,description,ogImage,texts,images'
    }
  }
}

export function createPostsFetcherConfig({ fields, offset, limit } = {}) {
  return {
    ...createBaseFetcherConfig(),
    baseURL: `${process.env.NUXT_ENV_API_URL}/posts`,
    params: {
      fields:
        fields ||
        'id,title,description,featuredImage,content,category,tags,author',
      offset: offset || 0,
      limit: limit || postsPerRequestToPage
    }
  }
}
