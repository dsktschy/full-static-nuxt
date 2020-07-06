import axios from 'axios'
import { inputFieldsPerRequest } from '../json/variables.json'
import { createInputFieldsRequestConfig } from './request-config'
import { MicroCmsQuery, MicroCmsListResponse } from './micro-cms'
import { PlainTextContent } from './plain-text'

interface InputFieldContentOption {
  label?: PlainTextContent
  value?: string
  selected: boolean
  disabled: boolean
}

interface InputFieldContentRule {
  required: boolean
  email: boolean
  max?: number
  min?: number
}

export interface InputFieldContent {
  id: string
  label: PlainTextContent
  name: string
  type: string
  options: InputFieldContentOption[]
  rules: InputFieldContentRule | null
}

export async function getInputFieldContentList(params: MicroCmsQuery = {}) {
  const config = createInputFieldsRequestConfig(params)
  const response = await axios.get<MicroCmsListResponse<InputFieldContent>>(
    '',
    config
  )
  return response.data.contents
}

export async function getAllInputFieldContents() {
  const allInputFieldContents = []
  let inputFieldContentList = []
  do {
    inputFieldContentList = await getInputFieldContentList({
      limit: inputFieldsPerRequest,
      offset: allInputFieldContents.length
    })
    allInputFieldContents.push(...inputFieldContentList)
  } while (inputFieldContentList.length === inputFieldsPerRequest)
  return allInputFieldContents
}
