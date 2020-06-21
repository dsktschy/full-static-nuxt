import { getAllPageContentsForNav } from '~/assets/js/pages-fetcher'

export default async (context, inject) => {
  const allPageContentsForNav = await getAllPageContentsForNav()
  inject('allPageContentsForNav', allPageContentsForNav)
}
