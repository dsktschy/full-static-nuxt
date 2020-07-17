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
  child = (await import(
    `./${process.env.NUXT_ENV_FORM_API_DIR_NAME}/contact.ts`
  )) as Child
  return child
}

export async function postContactValues(requestBody: ContactRequestBody) {
  const { postContactValues } = await getChild()
  const result = await postContactValues(requestBody)
  return result
}
