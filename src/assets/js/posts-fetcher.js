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

export async function getAllPostContents({ filters } = {}) {
  const allPostContents = []
  let postContentList = []
  do {
    const offset = allPostContents.length
    const options = { limit: postsPerRequestToGenerate, offset, filters }
    postContentList = await getPostContentList(options)
    allPostContents.push(...postContentList)
  } while (postContentList.length === postsPerRequestToGenerate)
  return allPostContents
}

export async function getAllPostContentsPerLocale({ filters } = {}) {
  const allPostContents = await getAllPostContents({ filters })
  const allPostContentsPerLocale = {}
  for (const locale of locales) {
    const postContentList = []
    for (const postContent of allPostContents) {
      if (locale.code in postContent.title) postContentList.push(postContent)
    }
    allPostContentsPerLocale[locale.code] = postContentList
  }
  return allPostContentsPerLocale
}

export async function getTotalPostsPerLocale({ filters } = {}) {
  const allPostContentsPerLocale = await getAllPostContentsPerLocale({
    fields: 'id',
    filters
  })
  const totalPostsPerLocale = {}
  for (const locale of locales) {
    totalPostsPerLocale[locale.code] =
      allPostContentsPerLocale[locale.code].length
  }
  return totalPostsPerLocale
}
