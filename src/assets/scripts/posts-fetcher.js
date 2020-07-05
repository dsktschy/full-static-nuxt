import axios from 'axios'
import { postsPerRequestToGenerate } from '../json/variables.json'
import { localeCodes } from './nuxt-i18n-options.ts'
import { createPostsRequestConfig } from './request-config.ts'

export async function getPostContentList({
  fields,
  offset,
  limit,
  filters
} = {}) {
  const config = createPostsRequestConfig({ fields, offset, limit, filters })
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
  for (const localeCode of localeCodes) {
    const postContentList = []
    for (const postContent of allPostContents) {
      if (localeCode in postContent.title) postContentList.push(postContent)
    }
    allPostContentsPerLocale[localeCode] = postContentList
  }
  return allPostContentsPerLocale
}
