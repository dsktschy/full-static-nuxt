import { getAllCategoryContents } from '~/assets/js/categories-fetcher'
import { createAllCategoriesMessage } from '~/assets/js/message-creator'

export default async ({ app }, inject) => {
  const allCategoryContents = await getAllCategoryContents()
  inject('allCategoryContents', allCategoryContents)

  const messages = {}
  for (const locale of app.i18n.locales) {
    messages[locale] = createAllCategoriesMessage(locale, allCategoryContents)
  }
  inject('allCategoryMessages', messages)
}
