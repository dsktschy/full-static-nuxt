import fs from 'fs-extra'
import { Module } from '@nuxt/types'
import {
  getAllPostContentsPerLocale,
  PostContent
} from '../assets/scripts/posts'
import {
  getAllCategoryContents,
  CategoryContent
} from '../assets/scripts/categories'
import {
  LOCALE_CODE_LIST,
  DEFAULT_LOCALE,
  TOTAL_POSTS_PER_PAGE
} from '../assets/scripts/constants'

interface LocalizedPostDetailPayload {
  postContent: PostContent
  prevPostContent: PostContent | null
  nextPostContent: PostContent | null
}

interface LocalizedPostListPayload {
  postContentList: PostContent[]
  maxLocalizedPageIndex: number
  allLocalizedCategoryContents: CategoryContent[]
}

interface LocalizedCategorizedPostListPayload {
  postContentList: PostContent[]
  maxLocalizedCategorizedPageIndex: number
  allLocalizedCategoryContents: CategoryContent[]
  categoryContent: CategoryContent
}

interface LocalizedRoute {
  route: string
  payload?:
    | LocalizedPostDetailPayload
    | LocalizedPostListPayload
    | LocalizedCategorizedPostListPayload
  payloadPath?: string
}

interface Options {}

const createDynamicRouteList: Module<Options> = function() {
  this.nuxt.hook('build:compile', _createDynamicRouteList)
}

// prettier-ignore
async function _createDynamicRouteList() {
  await fs.emptyDir(`src/assets/json/payloads/`)
  await fs.emptyDir(`src/assets/json/routes/`)

  const [allPostContentsPerLocale, allCategoryContents] = await Promise.all([
    getAllPostContentsPerLocale(),
    getAllCategoryContents()
  ])
  const localizedRouteList: LocalizedRoute[] = []

  for (const LOCALE_CODE of LOCALE_CODE_LIST) {
    const localePath = LOCALE_CODE === DEFAULT_LOCALE ? '' : `/${LOCALE_CODE}`
    const allLocalizedPostContents = allPostContentsPerLocale[LOCALE_CODE]
    const allLocalizedPostContentsPerCategory: { [category: string]: PostContent[] } = {}
    const maxLocalizedPageIndex =
      Math.ceil(allLocalizedPostContents.length / TOTAL_POSTS_PER_PAGE)
    const allLocalizedCategoryContents: CategoryContent[] = []

    for (const categoryContent of allCategoryContents) {
      allLocalizedPostContentsPerCategory[categoryContent.id] = []
    }

    const localizedPostContentListsPerPage: PostContent[][] = []
    for (let i = 0; i < allLocalizedPostContents.length / TOTAL_POSTS_PER_PAGE; i++)
      localizedPostContentListsPerPage[i] = []
    for (let i = 0; i < allLocalizedPostContents.length; i++) {
      const postContent = allLocalizedPostContents[i]

      // Create post detail routes
      const prevPostContent = i ? allLocalizedPostContents[i - 1] : null
      const nextPostContent =
        i === allLocalizedPostContents.length - 1
          ? null
          : allLocalizedPostContents[i + 1]
      const route = `${localePath}/blog/${postContent.id}`
      const payload = {
        postContent,
        prevPostContent,
        nextPostContent
      }
      const payloadPath = `src/assets/json/payloads/blog-id___${LOCALE_CODE}-${postContent.id}.json`
      localizedRouteList.push({ route, payload, payloadPath })

      // Paging
      const pageIndex = Math.floor(i / TOTAL_POSTS_PER_PAGE)
      localizedPostContentListsPerPage[pageIndex].push(postContent)

      // Categorizing
      const categoryId = postContent.category.id
      allLocalizedPostContentsPerCategory[categoryId].push(postContent)
    }

    // Create post list routes
    for (let i = 0; i < localizedPostContentListsPerPage.length; i++) {
      const postContentList = localizedPostContentListsPerPage[i]

      const pageIndex = i + 1
      const route = `${localePath}/blog/page/${pageIndex}`
      const payload = {
        postContentList,
        maxLocalizedPageIndex,
        allLocalizedCategoryContents
      }
      const payloadPath = `src/assets/json/payloads/blog-page-index___${LOCALE_CODE}-${pageIndex}.json`
      localizedRouteList.push({ route, payload, payloadPath })

      // Create site index route
      if (!i) {
        const route = localePath || '/'
        const payloadPath = `src/assets/json/payloads/index___${LOCALE_CODE}.json`
        localizedRouteList.push({ route, payload, payloadPath })
      }
    }

    // Create post list routes per category
    for (let i = 0; i < allCategoryContents.length; i++) {
      const categoryContent = allCategoryContents[i]

      // Create post list routes per category, that have no page index
      const categoryId = categoryContent.id
      const route = `${localePath}/blog/category/${categoryId}`
      localizedRouteList.push({ route })

      const allLocalizedCategorizedPostContents = allLocalizedPostContentsPerCategory[categoryId]
      const maxLocalizedCategorizedPageIndex =
        Math.ceil(allLocalizedCategorizedPostContents.length / TOTAL_POSTS_PER_PAGE)
      if (allLocalizedCategorizedPostContents.length)
        allLocalizedCategoryContents.push(categoryContent)

      const localizedCategorizedPostContentListsPerPage: PostContent[][] = []
      for (let j = 0; j < allLocalizedCategorizedPostContents.length / TOTAL_POSTS_PER_PAGE; j++)
        localizedCategorizedPostContentListsPerPage[j] = []
      for (let j = 0; j < allLocalizedCategorizedPostContents.length; j++) {
        const postContent = allLocalizedCategorizedPostContents[j]

        // Paging
        const pageIndex = Math.floor(j / TOTAL_POSTS_PER_PAGE)
        localizedCategorizedPostContentListsPerPage[pageIndex].push(postContent)
      }

      for (let j = 0; j < localizedCategorizedPostContentListsPerPage.length; j++) {
        const postContentList = localizedCategorizedPostContentListsPerPage[j]

        const pageIndex = j + 1
        const route = `${localePath}/blog/category/${categoryId}/page/${pageIndex}`
        const payload = {
          postContentList,
          maxLocalizedCategorizedPageIndex,
          allLocalizedCategoryContents,
          categoryContent
        }
        const payloadPath = `src/assets/json/payloads/blog-category-id-page-index___${LOCALE_CODE}-${categoryId}-${pageIndex}.json`
        localizedRouteList.push({ route, payload, payloadPath })
      }
    }
  }

  const promises: Promise<void>[] = []
  const dynamicRouteList: string[] = []
  for (const { route, payload, payloadPath } of localizedRouteList) {
    dynamicRouteList.push(route)
    if (!payload || !payloadPath) continue
    promises.push(fs.outputJSON(payloadPath, payload))
  }
  promises.push(fs.outputJSON('src/assets/json/routes/dynamic.json', dynamicRouteList))
  await Promise.all(promises)
}

export default createDynamicRouteList
