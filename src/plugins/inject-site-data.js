import { getContent } from '~/assets/js/site-data-fetcher'

export default async (context, inject) => {
  const content = await getContent()
  inject('siteData', content)
}
