import axios from 'axios'
import { createSiteDataRequestConfig } from './request-config'

export async function getSiteDataContent() {
  const config = createSiteDataRequestConfig()
  const response = await axios.get('', config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}
