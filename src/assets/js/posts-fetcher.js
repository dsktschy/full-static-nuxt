import axios from 'axios'
import { postsPerRequestToGenerate, locales } from '../json/variables'
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

export async function getPostContentList({
  fields,
  offset,
  limit,
  filters
} = {}) {
  const config = createPostsFetcherConfig({ fields, offset, limit, filters })
  const response = await axios.get('', config)
  if (!response.data) throw new Error('API response is invalid.')
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

export async function getAllPostContentsPerLocale() {
  const allPostContents = await getAllPostContents()
  const allPostContentsPerLocale = {}
  for (const locale of locales) {
    const postContentsPerLocale = []
    for (const postContent of allPostContents) {
      if (locale.code in postContent.title)
        postContentsPerLocale.push(postContent)
    }
    allPostContentsPerLocale[locale.code] = postContentsPerLocale
  }
  return allPostContentsPerLocale
}

export async function getTotalPosts({ filters } = {}) {
  const config = createPostsFetcherConfig({ fields: 'id', limit: 1, filters })
  const response = await axios.get('', config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data.totalCount
}
