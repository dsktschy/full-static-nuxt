import axios from 'axios'
import { postsPerRequestToGenerate } from '../json/variables.json'
import { localeCodes } from './nuxt-i18n-options'
import { createPostsRequestConfig } from './request-config'
import { MicroCmsQuery, MicroCmsListResponse } from './micro-cms'
import { CategoryContent } from './categories'
import { defaultLocale } from './nuxt-i18n-options'

export interface PostContent {
  id: string
  createdAt: string
  title: {
    [defaultLocale]: string
    [locale: string]: string
  }
  description: {
    [defaultLocale]: string
    [locale: string]: string
  }
  featuredImage: {
    url: string
  }
  content: {
    [defaultLocale]: string
    [locale: string]: string
  }
  category: CategoryContent
}

export async function getPostContentList(params: MicroCmsQuery = {}) {
  const config = createPostsRequestConfig(params)
  const response = await axios.get<MicroCmsListResponse<PostContent>>(
    '',
    config
  )
  return response.data.contents
}

export async function getAllPostContents() {
  const allPostContents = []
  let postContentList = []
  do {
    postContentList = await getPostContentList({
      limit: postsPerRequestToGenerate,
      offset: allPostContents.length
    })
    allPostContents.push(...postContentList)
  } while (postContentList.length === postsPerRequestToGenerate)
  return allPostContents
}

export async function getAllPostContentsPerLocale() {
  const allPostContents = await getAllPostContents()
  const allPostContentsPerLocale: { [locale: string]: PostContent[] } = {}
  for (const localeCode of localeCodes) {
    const postContentList = []
    for (const postContent of allPostContents) {
      if (localeCode in postContent.title) postContentList.push(postContent)
    }
    allPostContentsPerLocale[localeCode] = postContentList
  }
  return allPostContentsPerLocale
}
