import fs from 'fs-extra'
import { Module } from '@nuxt/types'
import { postsPerRequestToPage } from '../assets/json/variables.json'
import {
  getAllPostContentsPerLocale,
  PostContent
} from '../assets/scripts/posts'
import {
  getAllCategoryContents,
  CategoryContent
} from '../assets/scripts/categories'
import { localeCodes, defaultLocale } from '../assets/scripts/nuxt-i18n-options'

interface Options {}

const createDynamicRoutes: Module<Options> = function() {
  this.nuxt.hook('build:compile', _createDynamicRoutes)
}

// prettier-ignore
async function _createDynamicRoutes() {
  await fs.emptyDir(`src/assets/json/payloads/`)
  await fs.emptyDir(`src/assets/json/routes/`)

  const [allPostContentsPerLocale, allCategoryContents] = await Promise.all([
    getAllPostContentsPerLocale(),
    getAllCategoryContents()
  ])
  const localizedPageRoutes = []

  for (const localeCode of localeCodes) {
    const allLocalizedPostContents = allPostContentsPerLocale[localeCode]
    const allLocalizedPostContentsPerCategory: { [category: string]: PostContent[] } = {}
    const maxLocalizedPageIndex =
      Math.ceil(allLocalizedPostContents.length / postsPerRequestToPage)
    const allLocalizedCategoryContents: CategoryContent[] = []
    const localePath = localeCode === defaultLocale ? '' : `/${localeCode}`

    for (const categoryContent of allCategoryContents) {
      allLocalizedPostContentsPerCategory[categoryContent.id] = []
    }

    const localizedPostContentListsPerPage = Array(
      Math.ceil(allLocalizedPostContents.length / postsPerRequestToPage)
    ).fill([])
    for (let i = 0; i < allLocalizedPostContents.length; i++) {
      const postContent = allLocalizedPostContents[i]

      // Create blog post page routes
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
      const payloadPath = `src/assets/json/payloads/blog-id___${localeCode}-${postContent.id}.json`
      localizedPageRoutes.push({ route, payload, payloadPath })

      // Create blog index page routes
      const pageIndex = Math.floor(i / postsPerRequestToPage)
      const postIndexInPage = i % postsPerRequestToPage
      localizedPostContentListsPerPage[pageIndex][postIndexInPage] = postContent

      // Categorize
      const categoryId = postContent.category.id
      allLocalizedPostContentsPerCategory[categoryId].push(postContent)
    }

    // Create blog index page routes
    for (let i = 0; i < localizedPostContentListsPerPage.length; i++) {
      const postContentList = localizedPostContentListsPerPage[i]

      const pageIndex = i + 1
      const route = `${localePath}/blog/page/${pageIndex}`
      const payload = {
        postContentList,
        maxLocalizedPageIndex,
        allLocalizedCategoryContents
      }
      const payloadPath = `src/assets/json/payloads/blog-page-index___${localeCode}-${pageIndex}.json`
      localizedPageRoutes.push({ route, payload, payloadPath })

      // Create index page route
      if (!i) {
        const route = localePath || '/'
        const payloadPath = `src/assets/json/payloads/index___${localeCode}.json`
        localizedPageRoutes.push({ route, payload, payloadPath })
      }
    }

    // Create blog index page routes per category

    for (let i = 0; i < allCategoryContents.length; i++) {
      const categoryContent = allCategoryContents[i]

      const categoryId = categoryContent.id
      const allLocalizedCategorizedPostContents = allLocalizedPostContentsPerCategory[categoryId]
      const maxLocalizedCategorizedPageIndex =
        Math.ceil(allLocalizedCategorizedPostContents.length / postsPerRequestToPage)
      if (allLocalizedCategorizedPostContents.length)
        allLocalizedCategoryContents.push(categoryContent)

      const localizedCategorizedPostContentListsPerPage = Array(
        Math.ceil(allLocalizedCategorizedPostContents.length / postsPerRequestToPage)
      ).fill([])
      for (let j = 0; j < allLocalizedCategorizedPostContents.length; j++) {
        const postContent = allLocalizedCategorizedPostContents[j]

        // Create blog index page routes
        const pageIndex = Math.floor(j / postsPerRequestToPage)
        const postIndexInPage = j % postsPerRequestToPage
        localizedCategorizedPostContentListsPerPage[pageIndex][postIndexInPage] = postContent
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
        const payloadPath = `src/assets/json/payloads/blog-category-id-page-index___${localeCode}-${categoryId}-${pageIndex}.json`
        localizedPageRoutes.push({ route, payload, payloadPath })
      }
    }
  }

  const promises = []
  const dynamicRoutes = []
  for (const { route, payload, payloadPath } of localizedPageRoutes) {
    promises.push(fs.outputJSON(payloadPath, payload))
    dynamicRoutes.push(route)
  }
  promises.push(fs.outputJSON('src/assets/json/routes/dynamic.json', dynamicRoutes))
  await Promise.all(promises)
}

export default createDynamicRoutes
