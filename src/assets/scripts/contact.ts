export interface ContactRequestBody {
  'form-name': string
  honeypot: string
  agreement: boolean
  [name: string]: string | boolean | string[]
}

interface Child {
  postContactValues(requestBody: ContactRequestBody): Promise<void>
}

let child: Child | null = null

async function getChild() {
  if (child) return child
  if (!process.env.NUXT_ENV_CONTACT_API_TYPE)
    throw new Error('Content API type is not defined')
  child = (await import(
    `./${process.env.NUXT_ENV_CONTACT_API_TYPE}/contact.ts`
  )) as Child
  return child
}

export async function postContactValues(requestBody: ContactRequestBody) {
  const { postContactValues } = await getChild()
  const result = await postContactValues(requestBody)
  return result
}
