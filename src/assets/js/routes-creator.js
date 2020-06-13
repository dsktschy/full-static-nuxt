import { postsPerRequestToPage } from '../json/variables'
import { getAllPostContents } from './posts-fetcher'
import { getAllCategoryContents } from './categories-fetcher'

function createBlogPostPageRoute(postContent, i, postContentList) {
  const prevPostContent = i ? postContentList[i - 1] : null
  const nextPostContent =
    i === postContentList.length - 1 ? postContentList[i + 1] : null
  return {
    route: `/blog/${postContent.id}`,
    payload: {
      postContent,
      prevPostContent,
      nextPostContent
    }
  }
}

function createBlogPostListPageRoute(postContentList, i) {
  return {
    route: `/blog/page/${i + 1}`,
    payload: { postContentList }
  }
}

function createCategorizedBlogIndexPageRoute(categoryContent) {
  const categoryId = categoryContent.id
  return {
    route: `/blog/category/${categoryId}`
  }
}

function createCategorizedBlogPostListPageRoute(postContentList, i) {
  const categoryId = postContentList[0].category.id
  return {
    route: `/blog/category/${categoryId}/page/${i + 1}/`,
    payload: { postContentList }
  }
}

function _createBlogPostListPageRoutes(postContentList, createRoute) {
  const postContentListsPerPage = []
  for (let i = 0; i < postContentList.length; i++) {
    const page = Math.floor(i / postsPerRequestToPage)
    const post = i % postsPerRequestToPage
    if (!post) postContentListsPerPage[page] = []
    postContentListsPerPage[page][post] = postContentList[i]
  }
  return postContentListsPerPage.map(createRoute)
}

function createBlogPostPageRoutes(postContentList) {
  return postContentList.map(createBlogPostPageRoute)
}

function createBlogPostListPageRoutes(postContentList) {
  return _createBlogPostListPageRoutes(
    postContentList,
    createBlogPostListPageRoute
  )
}

function createCategorizedBlogIndexPageRoutes(categoryContentList) {
  return categoryContentList.map(createCategorizedBlogIndexPageRoute)
}

function createCategorizedBlogPostListPageRoutes(
  postContentList,
  categoryContentList
) {
  /** @type {{ [categoryName: string]: PostContent[] }} */
  const categorizedPostContentLists = {}
  for (const categoryContent of categoryContentList) {
    categorizedPostContentLists[categoryContent.id] = []
  }
  for (const postContent of postContentList) {
    categorizedPostContentLists[postContent.category.id].push(postContent)
  }
  /** @type { NuxtConfigurationGenerateRoute[] } */
  const categorizedBlogPostListPageRoutes = []
  const postContentLists = Object.values(categorizedPostContentLists)
  for (const categorizedPostContentList of postContentLists) {
    const blogPostListPageRoutes = _createBlogPostListPageRoutes(
      categorizedPostContentList,
      createCategorizedBlogPostListPageRoute
    )
    categorizedBlogPostListPageRoutes.push(...blogPostListPageRoutes)
  }
  return categorizedBlogPostListPageRoutes
}

export async function createDynamicRoutes() {
  let create, params
  const allPostContents = await getAllPostContents()
  create = createBlogPostPageRoutes
  params = [allPostContents]
  const blogPostPageRoutes = create(...params)
  // Show blog post list pages without generating
  if (process.env.NUXT_ENV_GENERATING_BLOG_POST_LIST_PAGES == null)
    return blogPostPageRoutes
  // Generate blog post list pages
  create = createBlogPostListPageRoutes
  params = [allPostContents]
  const blogPostListPageRoutes = create(...params)
  // Generate categorized blog index pages
  const allCategoryContents = await getAllCategoryContents()
  create = createCategorizedBlogIndexPageRoutes
  params = [allCategoryContents]
  const categorizedBlogIndexPageRoutes = create(...params)
  // Generate categorized blog post list pages
  create = createCategorizedBlogPostListPageRoutes
  params = [allPostContents, allCategoryContents]
  const categorizedBlogPostListPageRoutes = create(...params)
  return [
    ...blogPostPageRoutes,
    ...blogPostListPageRoutes,
    ...categorizedBlogIndexPageRoutes,
    ...categorizedBlogPostListPageRoutes
  ]
}
