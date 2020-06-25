import { createMessage } from '~/assets/js/message-creator.js'

export default async () => {
  const message = await createMessage('en')
  return message
}
