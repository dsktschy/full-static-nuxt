import { PlainTextContent } from './plain-text'

export interface ImageContent {
  id: string
  value: {
    url: string
  }
  alt: PlainTextContent
}
