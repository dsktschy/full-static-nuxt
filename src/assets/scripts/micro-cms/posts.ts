import axios from 'axios'
import { PostContent } from '../posts'
import { MAX_API_GET_REQUEST_LIMIT, LOCALE_CODE_LIST } from '../constants'
import { createPostsRequestConfig } from './request-config'
import { MicroCmsQuery } from './query'
import { MicroCmsListResponse } from './response'

async function getPostContentList(params: MicroCmsQuery = {}) {
  const config = createPostsRequestConfig(params)
  const response = await axios.get<MicroCmsListResponse<PostContent>>(
    '',
    config
  )
  return response.data.contents
}

async function getAllPostContents() {
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
