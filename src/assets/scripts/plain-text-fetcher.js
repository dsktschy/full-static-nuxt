import axios from 'axios'
import { plainTextPerRequest } from '../json/variables.json'
import { createPlainTextFetcherConfig } from './fetcher-config-creator'

export async function getPlainTextContentList({ fields, offset, limit } = {}) {
  const config = createPlainTextFetcherConfig({ fields, offset, limit })
  const response = await axios.get('', config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data.contents
}

export async function getAllPlainTextContents() {
  const allPlainTextContents = []
  let plainTextContentList = []
  do {
    const offset = allPlainTextContents.length
    const options = { limit: plainTextPerRequest, offset }
    plainTextContentList = await getPlainTextContentList(options)
    allPlainTextContents.push(...plainTextContentList)
  } while (plainTextContentList.length === plainTextPerRequest)
  return allPlainTextContents
}
