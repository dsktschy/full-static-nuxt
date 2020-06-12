import { getTotalPosts } from '~/assets/js/posts-fetcher'

export default async (context, inject) => {
  const totalPosts = await getTotalPosts()
  inject('totalPosts', totalPosts)
}
