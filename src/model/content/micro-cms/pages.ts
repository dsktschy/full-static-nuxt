import axios from 'axios'
import { PageContent, PartialPageContent } from '../pages'
import { MAX_API_GET_REQUEST_LIMIT } from '../../../constants/index'
import { createPagesRequestConfig } from './request-config'
import { MicroCmsQuery } from './query'
import { MicroCmsListResponse } from './response'

export async function getPageContent(id: string) {
  const config = createPagesRequestConfig()
  const response = await axios.get<PageContent>(id, config)
  return response.data
}

async function getPageContentList<T>(params: MicroCmsQuery = {}) {
  const config = createPagesRequestConfig(params)
  const response = await axios.get<MicroCmsListResponse<T>>('', config)
  return response.data.contents
}

export async function getAllPartialPageContents() {
  const allPartialPageContents: PartialPageContent[] = []
  let pageContentList: PartialPageContent[] = []
  do {
    pageContentList = await getPageContentList<PartialPageContent>({
      limit: MAX_API_GET_REQUEST_LIMIT,
      offset: allPartialPageContents.length,
      fields: 'id,path,title.id'
    })
    allPartialPageContents.push(...pageContentList)
  } while (pageContentList.length === MAX_API_GET_REQUEST_LIMIT)
  return allPartialPageContents
}
