<template>
  <div>
    <h1 class="title">{{ pageContent.title.ja_jp }}</h1>
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
      `${this.pageContent.title.ja_jp} | ${this.$siteDataContent.title.ja_jp}`,
      this.pageContent.description.ja_jp,
      this.$siteDataContent.ogImage.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>
