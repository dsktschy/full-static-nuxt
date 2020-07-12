import axios from 'axios'
import { createPostsRequestConfig } from './request-config'
import { MicroCmsQuery, MicroCmsListResponse } from './micro-cms'
import { CategoryContent } from './categories'
import {
  MAX_API_GET_REQUEST_LIMIT,
  LOCALE_CODE_LIST,
  DEFAULT_LOCALE
} from './constants'

export interface PostContent {
  id: string
  createdAt: string
  title: {
    [DEFAULT_LOCALE]: string
    [locale: string]: string
  }
  description: {
    [DEFAULT_LOCALE]: string
    [locale: string]: string
  }
  featuredImage: {
    url: string
  }
  content: {
    [DEFAULT_LOCALE]: string
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
  const allPostContents: PostContent[] = []
  let postContentList: PostContent[] = []
  do {
    postContentList = await getPostContentList({
      limit: MAX_API_GET_REQUEST_LIMIT,
      offset: allPostContents.length
    })
    allPostContents.push(...postContentList)
  } while (postContentList.length === MAX_API_GET_REQUEST_LIMIT)
  return allPostContents
}

export async function getAllPostContentsPerLocale() {
  const allPostContents = await getAllPostContents()
  const allPostContentsPerLocale: { [locale: string]: PostContent[] } = {}
  for (const LOCALE_CODE of LOCALE_CODE_LIST) {
    const postContentList: PostContent[] = []
    for (const postContent of allPostContents) {
      if (LOCALE_CODE in postContent.title) postContentList.push(postContent)
    }
    allPostContentsPerLocale[LOCALE_CODE] = postContentList
  }
  return allPostContentsPerLocale
}
