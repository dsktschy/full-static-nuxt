import { stringify } from 'querystring'
import axios from 'axios'
import { ContactValues } from '../contact'
import { createContactRequestConfig } from './request-config'

export async function postContactValues(contactValues: ContactValues) {
  const stringifiedContactValues = stringify(contactValues)
  const config = createContactRequestConfig()
  await axios.post<void>('', stringifiedContactValues, config)
}
