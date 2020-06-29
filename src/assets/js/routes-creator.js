import path from 'path'
import fs from 'fs-extra'
import {
  postsPerRequestToPage,
  locales,
  defaultLocale
} from '../json/variables'
import { getAllPostContentsPerLocale } from './posts-fetcher'
import { getAllCategoryContents } from './categories-fetcher'

// prettier-ignore
export async function createDynamicRoutes() {
  const [allPostContentsPerLocale, allCategoryContents] = await Promise.all([
    getAllPostContentsPerLocale(),
    getAllCategoryContents()
  ])
  const localizedPageRoutes = []
  const outputJsonParamsList = []

  for (const locale of locales) {
    const allLocalizedPostContents = allPostContentsPerLocale[locale.code]
    const allLocalizedPostContentsPerCategory = {}
    const maxLocalizedPageIndex =
      Math.ceil(allLocalizedPostContents.length / postsPerRequestToPage)
    const allLocalizedCategoryContents = []
    const localePath = locale.code === defaultLocale ? '' : `/${locale.code}`

    for (const categoryContent of allCategoryContents) {
      allLocalizedPostContentsPerCategory[categoryContent.id] = []
    }

    const localizedPostContentListsPerPage = []
    for (let i = 0; i < allLocalizedPostContents.length; i++) {
      const postContent = allLocalizedPostContents[i]

      // Create blog post page routes
      const prevPostContent = i ? allLocalizedPostContents[i - 1] : null
      const nextPostContent =
        i === allLocalizedPostContents.length - 1
          ? null
          : allLocalizedPostContents[i + 1]
      const payload = {
        postContent,
        prevPostContent,
        nextPostContent
      }
      localizedPageRoutes.push({
        route: `${localePath}/blog/${postContent.id}`,
        payload
      })

      if (!i) {
        // For development mode, output payload as json file
        outputJsonParamsList.push([
          path.resolve(`src/assets/json/payload/${locale.code}-blog-post-page-payload.json`),
          payload
        ])
      }

      // Create blog index page routes
      const pageIndex = Math.floor(i / postsPerRequestToPage)
      const postIndexInPage = i % postsPerRequestToPage
      if (!postIndexInPage) localizedPostContentListsPerPage[pageIndex] = []
      localizedPostContentListsPerPage[pageIndex][postIndexInPage] = postContent

      // Categorize
      const categoryId = postContent.category.id
      allLocalizedPostContentsPerCategory[categoryId].push(postContent)
    }

    // Create blog index page routes
    for (let i = 0; i < localizedPostContentListsPerPage.length; i++) {
      const postContentList = localizedPostContentListsPerPage[i]

      const payload = {
        postContentList,
        maxLocalizedPageIndex,
        allLocalizedCategoryContents
      }
      localizedPageRoutes.push({
        route: `${localePath}/blog/page/${i + 1}`,
        payload
      })

      if (!i) {
        // Create index page route
        localizedPageRoutes.push({
          route: localePath || '/',
          payload
        })
        // For development mode, output payload as json file
        outputJsonParamsList.push([
          path.resolve(`src/assets/json/payload/${locale.code}-blog-index-page-payload.json`),
          payload
        ])
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

      const localizedCategorizedPostContentListsPerPage = []
      for (let j = 0; j < allLocalizedCategorizedPostContents.length; j++) {
        const postContent = allLocalizedCategorizedPostContents[j]

        // Create blog index page routes
        const pageIndex = Math.floor(j / postsPerRequestToPage)
        const postIndexInPage = j % postsPerRequestToPage
        if (!postIndexInPage) localizedCategorizedPostContentListsPerPage[pageIndex] = []
        localizedCategorizedPostContentListsPerPage[pageIndex][postIndexInPage] = postContent
      }

      for (let j = 0; j < localizedCategorizedPostContentListsPerPage.length; j++) {
        const postContentList = localizedCategorizedPostContentListsPerPage[j]

        const payload = {
          postContentList,
          maxLocalizedCategorizedPageIndex,
          allLocalizedCategoryContents,
          categoryContent
        }
        localizedPageRoutes.push({
          route: `${localePath}/blog/category/${categoryId}/page/${j + 1}`,
          payload
        })

        if (!i && !j) {
          // For development mode, output payload as json file
          outputJsonParamsList.push([
            path.resolve(`src/assets/json/payload/${locale.code}-blog-categorized-index-page-payload.json`),
            payload
          ])
        }
      }
    }
  }

  // For development mode, output payload as json file
  const outputJsonPromiseList = outputJsonParamsList.map(
    outputJsonParams => fs.outputJson(...outputJsonParams)
  )
  await Promise.all(outputJsonPromiseList)

  return localizedPageRoutes
}
