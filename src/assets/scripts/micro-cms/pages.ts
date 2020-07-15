import axios from 'axios'
import { PageContent } from '../pages'
import { MAX_API_GET_REQUEST_LIMIT } from '../constants'
import { createPagesRequestConfig } from './request-config'
import { MicroCmsQuery } from './query'
import { MicroCmsListResponse } from './response'

export async function getPageContent(id: string) {
  const config = createPagesRequestConfig()
  const response = await axios.get(id, config)
  return response.data
}

async function getPageContentList(params: MicroCmsQuery = {}) {
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
      limit: MAX_API_GET_REQUEST_LIMIT,
      offset: allPageContentsForNav.length,
      fields: 'id,path,title.id'
    })
    allPageContentsForNav.push(...pageContentList)
  } while (pageContentList.length === MAX_API_GET_REQUEST_LIMIT)
  return allPageContentsForNav
}
