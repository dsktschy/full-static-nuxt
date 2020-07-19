import axios from 'axios'
import { PlainTextContent } from '../plain-text'
import { MAX_API_GET_REQUEST_LIMIT } from '../../../constants/index'
import { createPlainTextRequestConfig } from './request-config'
import { MicroCmsQuery } from './query'
import { MicroCmsListResponse } from './response'

async function getPlainTextContentList(params: MicroCmsQuery = {}) {
  const config = createPlainTextRequestConfig(params)
  const response = await axios.get<MicroCmsListResponse<PlainTextContent>>(
    '',
    config
  )
  return response.data.contents
}

export async function getAllPlainTextContents() {
  const allPlainTextContents: PlainTextContent[] = []
  let plainTextContentList: PlainTextContent[] = []
  do {
    plainTextContentList = await getPlainTextContentList({
      limit: MAX_API_GET_REQUEST_LIMIT,
      offset: allPlainTextContents.length
    })
    allPlainTextContents.push(...plainTextContentList)
  } while (plainTextContentList.length === MAX_API_GET_REQUEST_LIMIT)
  return allPlainTextContents
}
