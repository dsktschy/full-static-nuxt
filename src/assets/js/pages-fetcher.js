import axios from 'axios'
import { pagesPerRequestToGenerate } from '../json/variables'
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

export async function getPageContentList({
  fields,
  offset,
  limit,
  filters
} = {}) {
  const config = createPagesFetcherConfig({ fields, offset, limit, filters })
  const response = await axios.get('', config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data.contents
}

export async function getAllPageContentsForNav() {
  const limit = pagesPerRequestToGenerate
  const fields = 'id,path,title'
  const allPageContentsForNav = []
  let pageContentList = []
  do {
    const offset = allPageContentsForNav.length
    const options = { limit, offset, fields }
    pageContentList = await getPageContentList(options)
    allPageContentsForNav.push(...pageContentList)
  } while (pageContentList.length === pagesPerRequestToGenerate)
  return allPageContentsForNav
}
