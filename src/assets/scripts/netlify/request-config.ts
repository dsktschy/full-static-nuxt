/**
 * In client side, dotenv must not be imported
 * So dotenv is imported not in this module but nuxt.config.js
 *
 * On server side, if objects are exported, they will occur errors
 * Because they are read before dotenv.config() in nuxt.config.js
 * So this module exports functions
 */

import { AxiosRequestConfig } from 'axios'
import { DEFAULT_API_GET_REQUEST_TIMEOUT } from '../constants'

export function createContactRequestConfig() {
  const contactRequestConfig: AxiosRequestConfig = {
    timeout: DEFAULT_API_GET_REQUEST_TIMEOUT,
    // Contact form endpoint of Netlify is site origin
    baseURL: process.env.NUXT_ENV_BASE_URL
  }
  return contactRequestConfig
}
