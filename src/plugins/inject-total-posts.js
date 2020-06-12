import { getTotal } from '~/assets/js/posts-fetcher'

export default async (context, inject) => {
  const total = await getTotal()
  inject('totalPosts', total)
}
