<template>
  <div class="page-privacy">
    <h1>{{ $t(pageContent.title.id) }}</h1>

    <div v-html="$t('page-privacy-body')" />
  </div>
</template>

<script>
import { getSiteDataContent } from '~/assets/scripts/site-data.ts'
import {
  getAllPageContentsForNav,
  getPageContent
} from '~/assets/scripts/pages-fetcher'
import { createHead } from '~/assets/scripts/head-creator'

export default {
  async asyncData({ app }) {
    // For global
    const allPageContentsForNav = await getAllPageContentsForNav()

    // For page
    const siteDataContent = await getSiteDataContent()
    const routeName = app.getRouteBaseName()
    const pageContent = await getPageContent(routeName)

    return {
      siteDataContent,
      allPageContentsForNav,
      pageContent
    }
  },

  created() {
    // Assign value to global
    this.$global.allPageContentsForNav = this.allPageContentsForNav
  },

  head() {
    const siteTitle = this.$t(this.siteDataContent.title.id)
    return createHead(
      `${this.$t(this.pageContent.title.id)} | ${siteTitle}`,
      this.$t(this.pageContent.description.id),
      this.siteDataContent.ogImage.value.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style lang="scss" scoped>
.page-privacy {
  width: 764px;
  margin: 0 auto;
}
</style>
