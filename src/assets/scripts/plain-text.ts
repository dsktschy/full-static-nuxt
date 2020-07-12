import axios from 'axios'
import { plainTextPerRequest } from '../json/variables.json'
import { createPlainTextRequestConfig } from './request-config'
import { MicroCmsQuery, MicroCmsListResponse } from './micro-cms'
import { defaultLocale } from './nuxt-i18n-options'

export interface PlainTextContent {
  id: string
  value: {
    [defaultLocale]: string
    [locale: string]: string
  }
}

export async function getPlainTextContentList(params: MicroCmsQuery = {}) {
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
      limit: plainTextPerRequest,
      offset: allPlainTextContents.length
    })
    allPlainTextContents.push(...plainTextContentList)
  } while (plainTextContentList.length === plainTextPerRequest)
  return allPlainTextContents
}
