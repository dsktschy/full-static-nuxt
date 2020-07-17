import axios from 'axios'
import { ContactRequestBody } from '../contact'
import { createContactRequestConfig } from './request-config'

export async function postContactValues(requestBody: ContactRequestBody) {
  const config = createContactRequestConfig()
  await axios.post<void>('', requestBody, config)
}
