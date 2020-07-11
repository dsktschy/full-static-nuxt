import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { PageContent } from '~/assets/scripts/pages'

interface PageContentsForNav {
  all: PageContent[]
  about: PageContent | null
  blog: PageContent | null
  contact: PageContent | null
  firstLowerLevelExisting: boolean
  aboutSecondLowerLevel: PageContent[]
}

interface InternalPageContentsForNav {
  all: PageContentsForNav['all']
}

declare module 'vue/types/vue' {
  interface Vue {
    $pageContentsForNav: PageContentsForNav
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $pageContentsForNav: PageContentsForNav
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $pageContentsForNav: PageContentsForNav
  }
}

const injectPageContentsForNav: Plugin = (context, inject) => {
  const _pageContentsForNav = Vue.observable<InternalPageContentsForNav>({
    all: []
  })

  inject('pageContentsForNav', {
    /* eslint accessor-pairs: ['error', { 'setWithoutGet': false }] */
    set all(value: PageContent[]) {
      _pageContentsForNav.all = value
    },

    get about() {
      return (
        _pageContentsForNav.all.find(
          (pageContent) => pageContent.path === '/about'
        ) || null
      )
    },

    get blog() {
      return (
        _pageContentsForNav.all.find(
          (pageContent) => pageContent.path === '/blog'
        ) || null
      )
    },

    get contact() {
      return (
        _pageContentsForNav.all.find(
          (pageContent) => pageContent.path === '/contact'
        ) || null
      )
    },

    get firstLowerLevelExisting() {
      return ['/about', '/blog', '/contact']
        .map(
          (path) =>
            _pageContentsForNav.all.find(
              (pageContent) => pageContent.path === path
            ) || null
        )
        .every((pageContent) => !!pageContent)
    },

    get aboutSecondLowerLevel() {
      return _pageContentsForNav.all.filter(
        (pageContent) =>
          pageContent.path && pageContent.path.startsWith('/about/')
      )
    }
  })
}

export default injectPageContentsForNav
