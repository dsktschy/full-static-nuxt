import axios from 'axios'
import { categoriesPerRequest } from '../json/variables'
import { createCategoriesFetcherConfig } from './fetcher-config-creator'

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
