import axios from 'axios'
import { inputFieldsPerRequest } from '../json/variables'
import { createInputFieldsFetcherConfig } from './fetcher-config-creator'

export async function getCInputFieldContent(id) {
  if (!id) {
    const error = new Error('Page ID to request is missing.')
    return Promise.reject(error)
  }
  const config = createInputFieldsFetcherConfig()
  const response = await axios.get(id, config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}

export async function getCInputFieldContentList({
  fields,
  offset,
  limit
} = {}) {
  const config = createInputFieldsFetcherConfig({ fields, offset, limit })
  const response = await axios.get('', config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data.contents
}

export async function getAllInputFieldContents() {
  const allInputFieldContents = []
  let inputFieldContentList = []
  do {
    const offset = allInputFieldContents.length
    const options = { limit: inputFieldsPerRequest, offset }
    inputFieldContentList = await getCInputFieldContentList(options)
    allInputFieldContents.push(...inputFieldContentList)
  } while (inputFieldContentList.length === inputFieldsPerRequest)
  return allInputFieldContents
}
