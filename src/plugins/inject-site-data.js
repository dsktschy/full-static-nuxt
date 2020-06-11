import { getContent } from '~/assets/js/site-data-fetcher'

export default async (context, inject) => {
  const response = await getContent()
  inject('siteData', response)
}
