import axios from 'axios'
import { postsPerRequestToGenerate } from '../json/variables'
import { createForPosts as createConfig } from './fetcher-config-creator'

export async function getContent(id) {
  if (!id) {
    const error = new Error('Page ID to request is missing.')
    return Promise.reject(error)
  }
  const config = createConfig()
  const fetcher = axios.create(config)
  const response = await fetcher.get(id)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}

export async function getContentList({ offset, limit } = {}) {
  const config = createConfig()
  if (offset) config.params.offset = offset
  if (limit) config.params.limit = limit
  const fetcher = axios.create(config)
  const response = await fetcher.get()
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
