import axios from 'axios'
import { categoriesPerRequest } from '../json/variables'
import { createCategoriesFetcherConfig } from './fetcher-config-creator'

export async function getCategoryContent(id) {
  if (!id) {
    const error = new Error('Page ID to request is missing.')
    return Promise.reject(error)
  }
  const config = createCategoriesFetcherConfig()
  const response = await axios.get(id, config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}

export async function getCategoryContentList({ fields, offset, limit } = {}) {
  const config = createCategoriesFetcherConfig({ fields, offset, limit })
  const response = await axios.get('', config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data.contents
}

export async function getAllCategoryContents() {
  const allCategoryContents = []
  let categoryContentList = []
  do {
    const offset = allCategoryContents.length
    const options = { limit: categoriesPerRequest, offset }
    categoryContentList = await getCategoryContentList(options)
    allCategoryContents.push(...categoryContentList)
  } while (categoryContentList.length === categoriesPerRequest)
  return allCategoryContents
}
