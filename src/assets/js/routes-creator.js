import { postsPerRequestToPage } from '../json/variables'

export function createBlogPostPageRoutes(allPostContents) {
  return allPostContents.map((postContent) => ({
    route: `/blog/${postContent.id}`,
    payload: { content: postContent }
  }))
}

export function createBlogPostListPageRoutes(allPostContents) {
  const postContentListsPerPage = []
  for (let i = 0; i < allPostContents.length; i++) {
    const page = Math.floor(i / postsPerRequestToPage)
    const post = i % postsPerRequestToPage
    if (!post) postContentListsPerPage[page] = []
    postContentListsPerPage[page][post] = allPostContents[i]
  }
  return postContentListsPerPage.map((postContentList, i) => ({
    route: `/blog/page/${i + 1}`,
    payload: { postContentList }
  }))
}
