import axios from 'axios'
import { postsPerRequestToGenerate } from '../json/variables'
import { createForPosts as createConfig } from './fetcher-config-creator'

export async function getContent(id) {
  if (!id) {
    const error = new Error('Page ID to request is missing.')
    return Promise.reject(error)
  }
  const config = createConfig()
  const response = await axios.get(id, config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}

export async function getContentList({ fields, offset, limit } = {}) {
  const config = createConfig({ fields, offset, limit })
  const response = await axios.get('', config)
  if (!response.data || !response.data.contents)
    throw new Error('API response is invalid.')
  return response.data.contents
}

export async function getAllContents() {
  const allContents = []
  let contentList = []
  do {
    const offset = allContents.length
    const options = { limit: postsPerRequestToGenerate, offset }
    contentList = await getContentList(options)
    allContents.push(...contentList)
  } while (contentList.length === postsPerRequestToGenerate)
  return allContents
}

export async function getTotal() {
  const config = createConfig({ fields: 'id', limit: 1 })
  const response = await axios.get('', config)
  if (!response.data || !response.data.totalCount)
    throw new Error('API response is invalid.')
  return response.data.totalCount
}
