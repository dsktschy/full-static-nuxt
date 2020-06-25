/**
 * In client side, dotenv must not be imported
 * So dotenv is imported not in this module but nuxt.config.js
 *
 * On server side, if objects are exported, they will occur errors
 * Because they are read before dotenv.config() in nuxt.config.js
 * So this module exports functions
 */

import {
  postsPerRequestToPage,
  pagesPerRequestToPage,
  categoriesPerRequest,
  inputFieldsPerRequest,
  plainTextPerRequest,
  richTextPerRequest,
  apiGetRequestTimeout,
  apiGetRequestDepth
} from '../json/variables'

function createGetFetcherConfig(params) {
  return {
    timeout: apiGetRequestTimeout,
    headers: { 'X-API-KEY': process.env.NUXT_ENV_API_KEY },
    params: {
      depth: apiGetRequestDepth,
      ...params
    }
  }
}

export function createSiteDataFetcherConfig({ fields } = {}) {
  const params = {
    fields: fields || 'title.id,description.id,ogImage.value'
  }
  return {
    ...createGetFetcherConfig(params),
    baseURL: `${process.env.NUXT_ENV_API_URL}/site-data`
  }
}

export function createPagesFetcherConfig({
  fields,
  offset,
  limit,
  filters
} = {}) {
  const params = {
    fields:
      fields ||
      'id,title.id,description.id,ogImage.value,plainText.id,richText.id,images',
    offset: offset || 0,
    limit: limit || pagesPerRequestToPage,
    filters: filters || null
  }
  return {
    ...createGetFetcherConfig(params),
    baseURL: `${process.env.NUXT_ENV_API_URL}/pages`
  }
}

export function createPostsFetcherConfig({
  fields,
  offset,
  limit,
  filters
} = {}) {
  const params = {
    fields:
      fields ||
      'id,createdAt,title,description,featuredImage,content,category,tags.name,author',
    offset: offset || 0,
    limit: limit || postsPerRequestToPage,
    filters: filters || null
  }
  return {
    ...createGetFetcherConfig(params),
    baseURL: `${process.env.NUXT_ENV_API_URL}/posts`
  }
}

export function createCategoriesFetcherConfig({ fields, offset, limit } = {}) {
  const params = {
    fields: fields || 'id,name.id',
    offset: offset || 0,
    limit: limit || categoriesPerRequest
  }
  return {
    ...createGetFetcherConfig(params),
    baseURL: `${process.env.NUXT_ENV_API_URL}/categories`
  }
}

export function createInputFieldsFetcherConfig({ fields, offset, limit } = {}) {
  const params = {
    fields: fields || 'id,label.id,name,type,options,rules',
    offset: offset || 0,
    limit: limit || inputFieldsPerRequest
  }
  return {
    ...createGetFetcherConfig(params),
    baseURL: `${process.env.NUXT_ENV_API_URL}/input-fields`
  }
}

export function createPlainTextFetcherConfig({ fields, offset, limit } = {}) {
  const params = {
    fields: fields || 'id,value',
    offset: offset || 0,
    limit: limit || plainTextPerRequest
  }
  return {
    ...createGetFetcherConfig(params),
    baseURL: `${process.env.NUXT_ENV_API_URL}/plain-text`
  }
}

export function createRichTextFetcherConfig({ fields, offset, limit } = {}) {
  const params = {
    fields: fields || 'id,value',
    offset: offset || 0,
    limit: limit || richTextPerRequest
  }
  return {
    ...createGetFetcherConfig(params),
    baseURL: `${process.env.NUXT_ENV_API_URL}/rich-text`
  }
}

export function createContactFetcherConfig() {
  return {
    timeout: 0,
    // Contact form endpoint of Netlify is site origin
    baseURL: process.env.NUXT_ENV_BASE_URL
  }
}
