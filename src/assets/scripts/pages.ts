import axios from 'axios'
import { pagesPerRequestToGenerate } from '../json/variables.json'
import { createPagesRequestConfig } from './request-config'
import { MicroCmsQuery, MicroCmsListResponse } from './micro-cms'
import { PlainTextContent } from './plain-text'
import { RichTextContent } from './rich-text'
import { ImageContent } from './images'

export interface PageContent {
  id: string
  path?: string
  title: PlainTextContent
  description: PlainTextContent | null
  ogImage: ImageContent | null
  plainText: PlainTextContent[]
  richText: RichTextContent[]
  images: ImageContent[]
}

export async function getPageContent(id: string) {
  const config = createPagesRequestConfig()
  const response = await axios.get(id, config)
  return response.data
}

export async function getPageContentList(params: MicroCmsQuery = {}) {
  const config = createPagesRequestConfig(params)
  const response = await axios.get<MicroCmsListResponse<PageContent>>(
    '',
    config
  )
  return response.data.contents
}

export async function getAllPageContentsForNav() {
  const allPageContentsForNav: PageContent[] = []
  let pageContentList: PageContent[] = []
  do {
    pageContentList = await getPageContentList({
      limit: pagesPerRequestToGenerate,
      offset: allPageContentsForNav.length,
      fields: 'id,path,title.id'
    })
    allPageContentsForNav.push(...pageContentList)
  } while (pageContentList.length === pagesPerRequestToGenerate)
  return allPageContentsForNav
}
