/**
 * In client side, dotenv must not be imported
 * So dotenv is imported not in this module but nuxt.config.js
 *
 * On server side, if objects are exported, they will occur errors
 * Because they are read before dotenv.config() in nuxt.config.js
 * So this module exports functions
 */

import { AxiosRequestConfig } from 'axios'
import {
  postsPerRequestToPage,
  pagesPerRequestToPage,
  categoriesPerRequest,
  inputFieldsPerRequest,
  plainTextPerRequest,
  richTextPerRequest,
  apiGetRequestTimeout,
  apiGetRequestDepth
} from '../json/variables.json'
import { MicroCmsQuery } from './micro-cms'

function createGetRequestConfig(params: MicroCmsQuery = {}) {
  const getRequestConfig = {
    timeout: apiGetRequestTimeout,
    params: {
      depth: apiGetRequestDepth,
      ...params
    }
  } as AxiosRequestConfig
  if (process.env.NUXT_ENV_API_KEY) {
    getRequestConfig.headers = { 'X-API-KEY': process.env.NUXT_ENV_API_KEY }
  }
  return getRequestConfig
}

export function createSiteDataRequestConfig(params: MicroCmsQuery = {}) {
  const defaultParams = {
    fields: 'title.id,description.id,ogImage.value'
  }
  return {
    ...createGetRequestConfig({ ...defaultParams, ...params }),
    baseURL: `${process.env.NUXT_ENV_API_URL}/site-data`
  } as AxiosRequestConfig
}

export function createPagesRequestConfig(params: MicroCmsQuery = {}) {
  const defaultParams = {
    fields:
      'id,title.id,description.id,ogImage.value,plainText.id,richText.id,images',
    offset: 0,
    limit: pagesPerRequestToPage
  }
  return {
    ...createGetRequestConfig({ ...defaultParams, ...params }),
    baseURL: `${process.env.NUXT_ENV_API_URL}/pages`
  } as AxiosRequestConfig
}

export function createPostsRequestConfig(params: MicroCmsQuery = {}) {
  const defaultParams = {
    fields:
      'id,createdAt,title,description,featuredImage,content,category,tags.name,author',
    offset: 0,
    limit: postsPerRequestToPage
  }
  return {
    ...createGetRequestConfig({ ...defaultParams, ...params }),
    baseURL: `${process.env.NUXT_ENV_API_URL}/posts`
  } as AxiosRequestConfig
}

export function createCategoriesRequestConfig(params: MicroCmsQuery = {}) {
  const defaultParams = {
    fields: 'id,name.id',
    offset: 0,
    limit: categoriesPerRequest
  }
  return {
    ...createGetRequestConfig({ ...defaultParams, ...params }),
    baseURL: `${process.env.NUXT_ENV_API_URL}/categories`
  } as AxiosRequestConfig
}

export function createInputFieldsRequestConfig(params: MicroCmsQuery = {}) {
  const defaultParams = {
    fields: 'id,label.id,name,type,options,rules',
    offset: 0,
    limit: inputFieldsPerRequest
  }
  return {
    ...createGetRequestConfig({ ...defaultParams, ...params }),
    baseURL: `${process.env.NUXT_ENV_API_URL}/input-fields`
  } as AxiosRequestConfig
}

export function createPlainTextRequestConfig(params: MicroCmsQuery = {}) {
  const defaultParams = {
    fields: 'id,value',
    offset: 0,
    limit: plainTextPerRequest
  }
  return {
    ...createGetRequestConfig({ ...defaultParams, ...params }),
    baseURL: `${process.env.NUXT_ENV_API_URL}/plain-text`
  } as AxiosRequestConfig
}

export function createRichTextRequestConfig(params: MicroCmsQuery = {}) {
  const defaultParams = {
    fields: 'id,value',
    offset: 0,
    limit: richTextPerRequest
  }
  return {
    ...createGetRequestConfig({ ...defaultParams, ...params }),
    baseURL: `${process.env.NUXT_ENV_API_URL}/rich-text`
  } as AxiosRequestConfig
}

export function createContactRequestConfig() {
  return {
    timeout: 0,
    // Contact form endpoint of Netlify is site origin
    baseURL: process.env.NUXT_ENV_BASE_URL
  } as AxiosRequestConfig
}
