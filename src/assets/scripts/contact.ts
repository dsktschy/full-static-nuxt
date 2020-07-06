import axios from 'axios'
import { createContactRequestConfig } from './request-config'

export interface ContactRequestBody {
  'form-name': string
  honeypot: string
  agreement: boolean
  [name: string]: string | boolean | string[]
}

export async function postContactValues(requestBody: ContactRequestBody) {
  const config = createContactRequestConfig()
  await axios.post<void>('', requestBody, config)
}
