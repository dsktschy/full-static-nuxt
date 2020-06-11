import axios from 'axios'
import { createForPages as createConfig } from '~/assets/js/fetcher-config-creator'

export async function getContent(id) {
  if (!id) {
    const error = new Error('Page ID to request is missing.')
    return Promise.reject(error)
  }
  const config = createConfig()
  const fetcher = axios.create(config)
  const response = await fetcher.get(id)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}
