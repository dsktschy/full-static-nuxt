import axios from 'axios'
import { postsPerRequestToGenerate } from '../json/variables'
import { createPostsFetcherConfig } from './fetcher-config-creator'

export async function getPostContent(id) {
  if (!id) {
    const error = new Error('Page ID to request is missing.')
    return Promise.reject(error)
  }
  const config = createPostsFetcherConfig()
  const response = await axios.get(id, config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}

export async function getPostContentList({ fields, offset, limit } = {}) {
  const config = createPostsFetcherConfig({ fields, offset, limit })
  const response = await axios.get('', config)
  if (!response.data || !response.data.contents)
    throw new Error('API response is invalid.')
  return response.data.contents
}

export async function getAllPostContents() {
  const allPostContents = []
  let postContentList = []
  do {
    const offset = allPostContents.length
    const options = { limit: postsPerRequestToGenerate, offset }
    postContentList = await getPostContentList(options)
    allPostContents.push(...postContentList)
  } while (postContentList.length === postsPerRequestToGenerate)
  return allPostContents
}

export async function getTotalPosts() {
  const config = createPostsFetcherConfig({ fields: 'id', limit: 1 })
  const response = await axios.get('', config)
  if (!response.data || !response.data.totalCount)
    throw new Error('API response is invalid.')
  return response.data.totalCount
}
