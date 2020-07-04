export function createHead(title, description, imageUrl, pageUrl) {
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
