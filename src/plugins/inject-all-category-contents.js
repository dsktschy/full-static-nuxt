import { getAllCategoryContents } from '~/assets/js/categories-fetcher'

export default async (context, inject) => {
  const allCategoryContents = await getAllCategoryContents()
  inject('allCategoryContents', allCategoryContents)
}
