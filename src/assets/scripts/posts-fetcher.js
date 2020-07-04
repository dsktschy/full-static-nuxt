import axios from 'axios'
import { postsPerRequestToGenerate, locales } from '../json/variables.json'
import { createPostsFetcherConfig } from './fetcher-config-creator'

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
    const postContentList = []
    for (const postContent of allPostContents) {
      if (locale.code in postContent.title) postContentList.push(postContent)
    }
    allPostContentsPerLocale[locale.code] = postContentList
  }
  return allPostContentsPerLocale
}
