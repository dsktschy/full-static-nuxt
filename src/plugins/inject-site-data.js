import { getSiteDataContent } from '~/assets/js/site-data-fetcher'

export default async (context, inject) => {
  const siteDataContent = await getSiteDataContent()
  inject('siteData', siteDataContent)
}
