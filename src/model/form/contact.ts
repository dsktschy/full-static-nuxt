import { FormValue } from './value'

export interface ContactValues {
  'form-name': string
  honeypot: string
  agreement: boolean
  [name: string]: FormValue
}

interface Child {
  postContactValues(contactValues: ContactValues): Promise<void>
}

let child: Child | null = null

async function getChild() {
  if (child) return child
  child = (await import(
    `./${process.env.NUXT_ENV_FORM_API_DIR_NAME}/contact.ts`
  )) as Child
  return child
}

export async function postContactValues(contactValues: ContactValues) {
  const { postContactValues } = await getChild()
  const result = await postContactValues(contactValues)
  return result
}
