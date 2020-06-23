import { getAllPageContentsForNav } from '~/assets/js/pages-fetcher'
import { createAllPagesMessageForNav } from '~/assets/js/message-creator'

export default async ({ app }, inject) => {
  const allPageContentsForNav = await getAllPageContentsForNav()
  inject('allPageContentsForNav', allPageContentsForNav)

  const messages = {}
  for (const locale of app.i18n.locales) {
    messages[locale] = createAllPagesMessageForNav(
      locale,
      allPageContentsForNav
    )
  }
  inject('allPageMessagesForNav', messages)
}
