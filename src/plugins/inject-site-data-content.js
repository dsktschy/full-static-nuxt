import { getSiteDataContent } from '~/assets/js/site-data-fetcher'
import { createSiteDataMessage } from '~/assets/js/message-creator'

export default async ({ app }, inject) => {
  const siteDataContent = await getSiteDataContent()
  inject('siteDataContent', siteDataContent)

  const messages = {}
  for (const locale of app.i18n.locales) {
    messages[locale.code] = createSiteDataMessage(locale.code, siteDataContent)
  }
  inject('siteDataMessages', messages)
}
