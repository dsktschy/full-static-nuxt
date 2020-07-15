import axios from 'axios'
import { InputFieldContent } from '../input-fields'
import { MAX_API_GET_REQUEST_LIMIT } from '../constants'
import { createInputFieldsRequestConfig } from './request-config'
import { MicroCmsQuery } from './query'
import { MicroCmsListResponse } from './response'

async function getInputFieldContentList(params: MicroCmsQuery = {}) {
  const config = createInputFieldsRequestConfig(params)
  const response = await axios.get<MicroCmsListResponse<InputFieldContent>>(
    '',
    config
  )
  return response.data.contents
}

export async function getAllInputFieldContents() {
  const allInputFieldContents: InputFieldContent[] = []
  let inputFieldContentList: InputFieldContent[] = []
  do {
    inputFieldContentList = await getInputFieldContentList({
      limit: MAX_API_GET_REQUEST_LIMIT,
      offset: allInputFieldContents.length
    })
    allInputFieldContents.push(...inputFieldContentList)
  } while (inputFieldContentList.length === MAX_API_GET_REQUEST_LIMIT)
  return allInputFieldContents
}
