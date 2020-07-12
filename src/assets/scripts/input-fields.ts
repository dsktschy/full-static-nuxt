import axios from 'axios'
import { createInputFieldsRequestConfig } from './request-config'
import { MicroCmsQuery, MicroCmsListResponse } from './micro-cms'
import { PlainTextContent } from './plain-text'
import { MAX_API_GET_REQUEST_LIMIT } from './constants'

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

export function isRadio(inputFieldContent: InputFieldContent) {
  return inputFieldContent.type === 'radio'
}

export function isCheckbox(inputFieldContent: InputFieldContent) {
  return inputFieldContent.type === 'checkbox'
}

export function isSelect(inputFieldContent: InputFieldContent) {
  return inputFieldContent.type === 'select'
}

export function isTextarea(inputFieldContent: InputFieldContent) {
  return inputFieldContent.type === 'textarea'
}

export function isRadioOrCheckbox(inputFieldContent: InputFieldContent) {
  return ['radio', 'checkbox'].includes(inputFieldContent.type)
}

export function isRadioOrSelect(inputFieldContent: InputFieldContent) {
  return ['radio', 'select'].includes(inputFieldContent.type)
}

export function isTextOrTextarea(inputFieldContent: InputFieldContent) {
  return ['text', 'textarea'].includes(inputFieldContent.type)
}

export function isSingleOptionCheckbox(inputFieldContent: InputFieldContent) {
  return isCheckbox(inputFieldContent) && inputFieldContent.options.length === 1
}

export function createDefaultValue(inputFieldContent: InputFieldContent) {
  let value: string | string[] | boolean = ''
  if (isCheckbox(inputFieldContent)) {
    if (!inputFieldContent.options.length) {
      value = false
    } else if (inputFieldContent.options.length === 1) {
      value = inputFieldContent.options[0].selected
    } else {
      const options = inputFieldContent.options.filter(
        (option) => option.selected
      )
      value = options.map((option) => option.value || '')
    }
  } else if (isRadioOrSelect(inputFieldContent)) {
    if (!inputFieldContent.options.length) value = ''
    else {
      const option = inputFieldContent.options.find((option) => option.selected)
      value = option ? option.value || '' : ''
    }
  }
  return value
}
