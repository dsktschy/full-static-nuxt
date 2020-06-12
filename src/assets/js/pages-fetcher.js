import axios from 'axios'
import { createPagesFetcherConfig } from './fetcher-config-creator'

export async function getPageContent(id) {
  if (!id) {
    const error = new Error('Page ID to request is missing.')
    return Promise.reject(error)
  }
  const config = createPagesFetcherConfig()
  const response = await axios.get(id, config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}
