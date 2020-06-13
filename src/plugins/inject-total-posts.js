import { getTotalPosts } from '~/assets/js/posts-fetcher'
import { getAllCategoryContents } from '~/assets/js/categories-fetcher'

export default async (context, inject) => {
  const totalPosts = await getTotalPosts()
  const allCategoryContents = await getAllCategoryContents()
  const totalCategorizedPosts = {}
  for (const categoryContent of allCategoryContents) {
    const filters = `category[equals]${categoryContent.id}`
    const options = { filters }
    totalCategorizedPosts[categoryContent.id] = await getTotalPosts(options)
  }
  inject('totalPosts', totalPosts)
  inject('totalCategorizedPosts', totalCategorizedPosts)
}
