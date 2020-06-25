import {
  postsPerRequestToPage,
  locales,
  defaultLocale
} from '../json/variables'
import { getAllPostContentsPerLocale } from './posts-fetcher'
import { getAllCategoryContents } from './categories-fetcher'

const localePaths = {}
for (const locale of locales) {
  localePaths[locale.code] =
    locale.code === defaultLocale ? '' : `/${locale.code}`
}

function createBlogPostPageRoute(postContent, i, postContentList) {
  const prevPostContent = i ? postContentList[i - 1] : null
  const nextPostContent =
    i === postContentList.length - 1 ? null : postContentList[i + 1]
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

function createCategorizedBlogPostListPageRoute(postContentList, i) {
  const categoryId = postContentList[0].category.id
  return {
    route: `/blog/category/${categoryId}/page/${i + 1}`,
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
    // Route for path doesn't have '/page/{n}'
    if (blogPostListPageRoutes.length) {
      const route = blogPostListPageRoutes[0].route.replace('/page/1', '')
      blogPostListPageRoutes.push({ route })
    }
    categorizedBlogPostListPageRoutes.push(...blogPostListPageRoutes)
  }
  return categorizedBlogPostListPageRoutes
}

export async function createDynamicRoutes() {
  let create, params
  // If flase, blog post list pages are shown with SPA fallback
  const generatingBlogPostListPages =
    process.env.NUXT_ENV_GENERATING_BLOG_POST_LIST_PAGES != null
  /** @type {{ [locale: string]: PostContent[] }} */
  const allPostContentsPerLocale = await getAllPostContentsPerLocale()
  const allCategoryContents = generatingBlogPostListPages
    ? await getAllCategoryContents()
    : []
  /** @type { NuxtConfigurationGenerateRoute[] } */
  const localizedPageRoutes = []
  for (const locale of locales) {
    // Generate blog post pages
    create = createBlogPostPageRoutes
    params = [allPostContentsPerLocale[locale.code]]
    const pageRoutes = create(...params)
    if (generatingBlogPostListPages) {
      // Generate blog post list pages
      create = createBlogPostListPageRoutes
      params = [allPostContentsPerLocale[locale.code]]
      pageRoutes.push(...create(...params))
      // Generate categorized blog post list pages
      create = createCategorizedBlogPostListPageRoutes
      params = [allPostContentsPerLocale[locale.code], allCategoryContents]
      pageRoutes.push(...create(...params))
    }
    // Make route property localized
    for (const pageRoute of pageRoutes) {
      const route = localePaths[locale.code] + pageRoute.route
      localizedPageRoutes.push({ ...pageRoute, ...{ route } })
    }
  }
  return localizedPageRoutes
}
