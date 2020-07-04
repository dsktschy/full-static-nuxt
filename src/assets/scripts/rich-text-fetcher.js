import axios from 'axios'
import { richTextPerRequest } from '../json/variables.json'
import { createRichTextFetcherConfig } from './fetcher-config-creator'

export async function getRichTextContentList({ fields, offset, limit } = {}) {
  const config = createRichTextFetcherConfig({ fields, offset, limit })
  const response = await axios.get('', config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data.contents
}

export async function getAllRichTextContents() {
  const allRichTextContents = []
  let richTextContentList = []
  do {
    const offset = allRichTextContents.length
    const options = { limit: richTextPerRequest, offset }
    richTextContentList = await getRichTextContentList(options)
    allRichTextContents.push(...richTextContentList)
  } while (richTextContentList.length === richTextPerRequest)
  return allRichTextContents
}
