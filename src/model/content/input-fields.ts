import { FormValue } from '../form/value'
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

interface Child {
  getAllInputFieldContents(): Promise<InputFieldContent[]>
}

let child: Child | null = null

async function getChild() {
  if (child) return child
  child = (await import(
    `./${process.env.NUXT_ENV_CONTENT_API_DIR_NAME}/input-fields.ts`
  )) as Child
  return child
}

export async function getAllInputFieldContents() {
  const { getAllInputFieldContents } = await getChild()
  const result = await getAllInputFieldContents()
  return result
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

export function createValidationProviderTag(
  inputFieldContent: InputFieldContent
) {
  const type = inputFieldContent.type
  return ['radio', 'checkbox'].includes(type) ? 'div' : 'label'
}

export function createValidationProviderRules(
  inputFieldContent: InputFieldContent
) {
  const rules = inputFieldContent.rules
  if (!rules) return ''
  const ruleList = []
  if (rules.required) ruleList.push('required')
  if (rules.email) ruleList.push('email')
  if (rules.max != null) ruleList.push(`max:${rules.max}`)
  if (rules.min != null) ruleList.push(`min:${rules.min}`)
  return ruleList.join('|')
}

export function createDefaultValue(inputFieldContent: InputFieldContent) {
  let value: FormValue = ''
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

export function getOptionLabelTextId(
  inputFieldContent: InputFieldContent,
  formValue: FormValue
) {
  const option = inputFieldContent.options.find(
    (option) => option.value === formValue
  )
  return option && option.label ? option.label.id : ''
}
