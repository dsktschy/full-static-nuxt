import { getSiteDataContent } from '~/assets/js/site-data-fetcher'
import { getAllPageContentsForNav } from '~/assets/js/pages-fetcher'
import { getAllCategoryContents } from '~/assets/js/categories-fetcher'
import { getTotalPosts } from '~/assets/js/posts-fetcher'

export const state = () => ({
  siteDataContent: {},
  allPageContentsForNav: [],
  allCategoryContents: [],
  totalPosts: 0,
  totalCategorizedPosts: {}
})

export const getters = {
  aboutPageContent(state) {
    return state.allPageContentsForNav.find(
      (pageContent) => pageContent.path === '/about'
    )
  },
  blogPageContent(state) {
    return state.allPageContentsForNav.find(
      (pageContent) => pageContent.path === '/blog'
    )
  },
  contactPageContent(state) {
    return state.allPageContentsForNav.find(
      (pageContent) => pageContent.path === '/contact'
    )
  },
  aboutLowerPageContentList(state) {
    return state.allPageContentsForNav.filter((pageContent) =>
      pageContent.path.startsWith('/about/')
    )
  }
}

// prettier-ignore
export const mutations = {
  setSiteDataContent(state, { value }) { state.siteDataContent = value },
  setAllPageContentsForNav(state, { value }) { state.allPageContentsForNav = value },
  setAllCategoryContents(state, { value }) { state.allCategoryContents = value },
  setTotalPosts(state, { value }) { state.totalPosts = value },
  setTotalCategorizedPosts(state, { value }) { state.totalCategorizedPosts = value },
}

export const actions = {
  async nuxtServerInit({ commit }) {
    const siteDataContent = await getSiteDataContent()
    const allPageContentsForNav = await getAllPageContentsForNav()
    const allCategoryContents = await getAllCategoryContents()
    const totalPosts = await getTotalPosts()
    const totalCategorizedPosts = {}
    for (const categoryContent of allCategoryContents) {
      const filters = `category[equals]${categoryContent.id}`
      const options = { filters }
      totalCategorizedPosts[categoryContent.id] = await getTotalPosts(options)
    }

    commit('setSiteDataContent', { value: siteDataContent })
    commit('setAllPageContentsForNav', { value: allPageContentsForNav })
    commit('setAllCategoryContents', { value: allCategoryContents })
    commit('setTotalPosts', { value: totalPosts })
    commit('setTotalCategorizedPosts', { value: totalCategorizedPosts })
  }
}
