import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { PartialPageContent } from '~/api/content/pages'

interface NavState {
  allPartialPageContents: PartialPageContent[]
  aboutPartialPageContent: PartialPageContent | null
  blogPartialPageContent: PartialPageContent | null
  contactPartialPageContent: PartialPageContent | null
  aboutSecondLowerLevelPartialPageContentList: PartialPageContent[]
  firstLowerLevelPartialPageContentListExisting: boolean
}

interface InternalNavState {
  allPartialPageContents: NavState['allPartialPageContents']
}

declare module 'vue/types/vue' {
  interface Vue {
    $navState: NavState
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $navState: NavState
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $navState: NavState
  }
}

const injectNavState: Plugin = (context, inject) => {
  const _navState = Vue.observable<InternalNavState>({
    allPartialPageContents: []
  })

  inject('navState', {
    /* eslint accessor-pairs: ['error', { 'setWithoutGet': false }] */
    set allPartialPageContents(value: PartialPageContent[]) {
      _navState.allPartialPageContents = value
    },

    get aboutPartialPageContent() {
      return (
        _navState.allPartialPageContents.find(
          (partialPageContent) => partialPageContent.path === '/about'
        ) || null
      )
    },

    get blogPartialPageContent() {
      return (
        _navState.allPartialPageContents.find(
          (partialPageContent) => partialPageContent.path === '/blog'
        ) || null
      )
    },

    get contactPartialPageContent() {
      return (
        _navState.allPartialPageContents.find(
          (partialPageContent) => partialPageContent.path === '/contact'
        ) || null
      )
    },

    get firstLowerLevelPartialPageContentListExisting() {
      return ['/about', '/blog', '/contact']
        .map(
          (path) =>
            _navState.allPartialPageContents.find(
              (partialPageContent) => partialPageContent.path === path
            ) || null
        )
        .every((partialPageContent) => !!partialPageContent)
    },

    get aboutSecondLowerLevelPartialPageContentList() {
      return _navState.allPartialPageContents.filter(
        (partialPageContent) =>
          partialPageContent.path &&
          partialPageContent.path.startsWith('/about/')
      )
    }
  })
}

export default injectNavState
