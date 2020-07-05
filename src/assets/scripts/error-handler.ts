import Vue from 'vue'
import { AxiosError } from 'axios'

export function handleError(error: Error | AxiosError, vm: Vue) {
  let statusCode = 500
  if ('response' in error && typeof error.response !== 'undefined') {
    statusCode = error.response.status
  }

  vm.$nuxt.error({
    statusCode,
    message: error.message
  })
}
