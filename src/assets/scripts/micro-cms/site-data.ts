import axios from 'axios'
import { SiteDataContent } from '../site-data'
import { createSiteDataRequestConfig } from './request-config'

export async function getSiteDataContent() {
  const config = createSiteDataRequestConfig()
  const response = await axios.get<SiteDataContent>('', config)
  return response.data
}
