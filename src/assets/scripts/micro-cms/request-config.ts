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
  DEFAULT_API_GET_REQUEST_TIMEOUT,
  DEFAULT_API_GET_REQUEST_DEPTH,
  DEFAULT_API_GET_REQUEST_LIMIT
} from '../constants'
import { MicroCmsQuery } from './query'

function createGetRequestConfig(params: MicroCmsQuery = {}) {
  const getRequestConfig: AxiosRequestConfig = {
    timeout: DEFAULT_API_GET_REQUEST_TIMEOUT,
    params: {
      depth: DEFAULT_API_GET_REQUEST_DEPTH,
      limit: DEFAULT_API_GET_REQUEST_LIMIT,
      offset: 0,
      ...params
    }
  }

  // Micro CMS requires API key
  if (!process.env.NUXT_ENV_CONTENT_API_KEY)
    throw new Error('Content API key is not defined')
  getRequestConfig.headers = {
    'X-API-KEY': process.env.NUXT_ENV_CONTENT_API_KEY
  }

  return getRequestConfig
}

export function createSiteDataRequestConfig(params: MicroCmsQuery = {}) {
  const defaultFields = 'title.id,description.id,ogImage.value'
  const siteDataRequestConfig: AxiosRequestConfig = {
    ...createGetRequestConfig({ fields: defaultFields, ...params }),
    baseURL: `${process.env.NUXT_ENV_CONTENT_API_URL}/site-data`
  }
  return siteDataRequestConfig
}

export function createPagesRequestConfig(params: MicroCmsQuery = {}) {
  const defaultFields =
    'id,title.id,description.id,ogImage.value,plainText.id,richText.id,images'
  const pagesRequestConfig: AxiosRequestConfig = {
    ...createGetRequestConfig({ fields: defaultFields, ...params }),
    baseURL: `${process.env.NUXT_ENV_CONTENT_API_URL}/pages`
  }
  return pagesRequestConfig
}

export function createPostsRequestConfig(params: MicroCmsQuery = {}) {
  const defaultFields =
    'id,createdAt,title,description,featuredImage,content,category'
  const postsRequestConfig: AxiosRequestConfig = {
    ...createGetRequestConfig({ fields: defaultFields, ...params }),
    baseURL: `${process.env.NUXT_ENV_CONTENT_API_URL}/posts`
  }
  return postsRequestConfig
}

export function createCategoriesRequestConfig(params: MicroCmsQuery = {}) {
  const defaultFields = 'id,name.id'
  const categoriesRequestConfig: AxiosRequestConfig = {
    ...createGetRequestConfig({ fields: defaultFields, ...params }),
    baseURL: `${process.env.NUXT_ENV_CONTENT_API_URL}/categories`
  }
  return categoriesRequestConfig
}

export function createInputFieldsRequestConfig(params: MicroCmsQuery = {}) {
  const defaultFields = 'id,label.id,name,type,options,rules'
  const inputFieldsRequestConfig: AxiosRequestConfig = {
    ...createGetRequestConfig({ fields: defaultFields, ...params }),
    baseURL: `${process.env.NUXT_ENV_CONTENT_API_URL}/input-fields`
  }
  return inputFieldsRequestConfig
}

export function createPlainTextRequestConfig(params: MicroCmsQuery = {}) {
  const defaultFields = 'id,value'
  const plainTextRequestConfig: AxiosRequestConfig = {
    ...createGetRequestConfig({ fields: defaultFields, ...params }),
    baseURL: `${process.env.NUXT_ENV_CONTENT_API_URL}/plain-text`
  }
  return plainTextRequestConfig
}

export function createRichTextRequestConfig(params: MicroCmsQuery = {}) {
  const defaultFields = 'id,value'
  const richTextRequestConfig: AxiosRequestConfig = {
    ...createGetRequestConfig({ fields: defaultFields, ...params }),
    baseURL: `${process.env.NUXT_ENV_CONTENT_API_URL}/rich-text`
  }
  return richTextRequestConfig
}
