import axios from 'axios'
import { createSiteDataRequestConfig } from './request-config'
import { PlainTextContent } from './plain-text'
import { ImageContent } from './images'

export interface SiteDataContent {
  title: PlainTextContent
  description: PlainTextContent
  ogImage: ImageContent
}

export async function getSiteDataContent() {
  const config = createSiteDataRequestConfig()
  const response = await axios.get<SiteDataContent>('', config)
  return response.data
}
