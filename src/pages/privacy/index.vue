<template>
  <div>
    <h1 class="title">{{ pageContent.title.value.ja }}</h1>
  </div>
</template>

<script>
import { getPageContent } from '~/assets/js/pages-fetcher'
import { createHead } from '~/assets/js/head-creator'

export default {
  async asyncData({ route }) {
    return {
      pageContent: await getPageContent(route.name)
    }
  },

  head() {
    return createHead(
      `${this.pageContent.title.value.ja} | ${this.$siteDataContent.title.value.ja}`,
      this.pageContent.description.value.ja,
      this.$siteDataContent.ogImage.value.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>
