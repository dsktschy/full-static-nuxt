export function createSiteDataMessage(locale, siteDataContent) {
  const message = {}
  trySettingProperty(locale, message, siteDataContent.title)
  trySettingProperty(locale, message, siteDataContent.description)
  return message
}

export function createAllPagesMessageForNav(locale, allPageContentsForNav) {
  const message = {}
  for (const pageContentsForNav of allPageContentsForNav)
    trySettingProperty(locale, message, pageContentsForNav.title)
  return message
}

export function createAllCategoriesMessage(locale, allCategoryContents) {
  const message = {}
  for (const categoryContent of allCategoryContents)
    trySettingProperty(locale, message, categoryContent.name)
  return message
}

export function createPageMessage(locale, pageContent) {
  const message = {}
  trySettingProperty(locale, message, pageContent.title)
  if (pageContent.description)
    trySettingProperty(locale, message, pageContent.description)
  for (const plainText of pageContent.plainText)
    trySettingProperty(locale, message, plainText)
  for (const richText of pageContent.richText)
    trySettingProperty(locale, message, richText)
  for (const image of pageContent.images)
    if (image.alt) trySettingProperty(locale, message, image.alt)
  return message
}

export function createPostMessage(locale, postContent) {
  const message = {}
  trySettingProperty(locale, message, postContent.category.name)
  for (const tag of postContent.tags)
    trySettingProperty(locale, message, tag.name)
  trySettingProperty(locale, message, postContent.author.name)
  trySettingProperty(locale, message, postContent.author.description)
  if (postContent.author.image.alt)
    trySettingProperty(locale, message, postContent.author.image.alt)
  return message
}

export function createPostsMessage(locale, postContentList) {
  const message = {}
  for (const postContent of postContentList) {
    trySettingProperty(locale, message, postContent.category.name)
  }
  return message
}

export function createCategoryMessage(locale, categoryContent) {
  const message = {}
  trySettingProperty(locale, message, categoryContent.name)
  return message
}

export function createInputFieldsMessage(locale, inputFieldContentList) {
  const message = {}
  for (const inputFieldContent of inputFieldContentList) {
    trySettingProperty(locale, message, inputFieldContent.label)
    for (const option of inputFieldContent.options)
      if (option.label) trySettingProperty(locale, message, option.label)
  }
  return message
}

function trySettingProperty(locale, message, { id, value }) {
  if (value[locale]) message[id] = value[locale]
}
