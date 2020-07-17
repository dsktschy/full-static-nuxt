/**
 * Pad with zero
 */
export function padWithZero(target: number, length: number) {
  return `${target}`.padStart(length, '0')
}

/**
 * Convert from ISO to YYYY.MM.DD
 */
export function convertIsoToDotSeparatedYmd(iso: string) {
  return iso.slice(0, 10).replace(/-/g, '.')
}

/**
 * Capitalize
 */
export function capitalize(target: string) {
  if (!target) return target
  return target.charAt(0).toUpperCase() + target.slice(1)
}

/**
 * Create head object for page components
 */
export function createHead(
  title: string,
  description: string,
  imageUrl: string,
  pageUrl: string
) {
  return {
    title,
    description,
    meta: [
      {
        property: 'og:title',
        hid: 'og:title',
        content: title
      },
      {
        property: 'og:description',
        hid: 'og:description',
        content: description
      },
      {
        property: 'og:image',
        hid: 'og:image',
        content: imageUrl
      },
      {
        property: 'og:url',
        hid: 'og:url',
        content: pageUrl
      }
    ]
  }
}
