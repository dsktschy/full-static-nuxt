import axios from 'axios'
import { createContactRequestConfig } from './request-config.ts'

export async function postContactValues(stringifiedValues) {
  if (!stringifiedValues) {
    const error = new Error('Values to send is missing.')
    return Promise.reject(error)
  }
  const config = createContactRequestConfig()
  const response = await axios.post('', stringifiedValues, config)
  if (!response.data) throw new Error('API response is invalid.')
  return response.data
}
