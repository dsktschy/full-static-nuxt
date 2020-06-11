import axios from 'axios'
import { createForSiteData as createConfig } from './fetcher-config-creator'

export async function getContent() {
  const config = createConfig()
  const fetcher = axios.create(config)
  const response = await fetcher.get()
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}
