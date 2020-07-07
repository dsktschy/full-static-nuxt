import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { PageContent } from '~/assets/scripts/pages'

interface Grobal {
  allPageContentsForNav: PageContent[]
}

declare module 'vue/types/vue' {
  interface Vue {
    $global: Grobal
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $global: Grobal
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $global: Grobal
  }
}

const injectGlobal: Plugin = (context, inject) => {
  const global: Grobal = {
    allPageContentsForNav: []
  }

  inject('global', Vue.observable(global))
}

export default injectGlobal
