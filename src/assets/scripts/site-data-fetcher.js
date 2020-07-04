import axios from 'axios'
import { createSiteDataFetcherConfig } from './fetcher-config-creator.ts'

export async function getSiteDataContent() {
  const config = createSiteDataFetcherConfig()
  const response = await axios.get('', config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}
