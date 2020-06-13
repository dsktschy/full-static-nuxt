import { getTotalPosts } from '~/assets/js/posts-fetcher'

export default async ({ app }, inject) => {
  const totalPosts = await getTotalPosts()
  const totalCategorizedPosts = {}
  for (const categoryContent of app.$allCategoryContents) {
    const filters = `category[equals]${categoryContent.id}`
    const options = { filters }
    totalCategorizedPosts[categoryContent.id] = await getTotalPosts(options)
  }
  inject('totalPosts', totalPosts)
  inject('totalCategorizedPosts', totalCategorizedPosts)
}
