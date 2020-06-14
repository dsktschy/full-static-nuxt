/**
 * In client side, dotenv must not be imported
 * So dotenv is imported not in this module but nuxt.config.js
 *
 * On server side, if objects are exported, they will occur errors
 * Because they are read before dotenv.config() in nuxt.config.js
 * So this module exports functions
 */

import { postsPerRequestToPage, categoriesPerRequest } from '../json/variables'

function createGetFetcherConfig() {
  return {
    timeout: 0,
    headers: { 'X-API-KEY': process.env.NUXT_ENV_API_KEY }
  }
}

export function createSiteDataFetcherConfig({ fields } = {}) {
  return {
    ...createGetFetcherConfig(),
    baseURL: `${process.env.NUXT_ENV_API_URL}/site-data`,
    params: {
      fields: fields || 'title,description,ogImage'
    }
  }
}

export function createPagesFetcherConfig({ fields } = {}) {
  return {
    ...createGetFetcherConfig(),
    baseURL: `${process.env.NUXT_ENV_API_URL}/pages`,
    params: {
      fields: fields || 'title,description,ogImage,texts,images'
    }
  }
}

export function createPostsFetcherConfig({
  fields,
  offset,
  limit,
  filters
} = {}) {
  return {
    ...createGetFetcherConfig(),
    baseURL: `${process.env.NUXT_ENV_API_URL}/posts`,
    params: {
      fields:
        fields ||
        'id,createdAt,title,description,featuredImage,content,category,tags,author',
      offset: offset || 0,
      limit: limit || postsPerRequestToPage,
      filters: filters || null
    }
  }
}

export function createCategoriesFetcherConfig({ fields, offset, limit } = {}) {
  return {
    ...createGetFetcherConfig(),
    baseURL: `${process.env.NUXT_ENV_API_URL}/categories`,
    params: {
      fields: fields || 'id,name',
      offset: offset || 0,
      limit: limit || categoriesPerRequest
    }
  }
}

export function createContactFetcherConfig() {
  return {
    timeout: 0,
    // Contact form endpoint of Netlify is site origin
    baseURL: process.env.BASE_URL
  }
}
