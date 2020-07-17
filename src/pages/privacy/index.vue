<template>
  <div class="page-privacy">
    <h1>{{ $t(pageContent.title.id) }}</h1>

    <div v-html="$t('page-privacy-body')" />
  </div>
</template>

<script>
import { getSiteDataContent } from '~/api/content/site-data.ts'
import {
  getAllPartialPageContents,
  getPageContent
} from '~/api/content/pages.ts'
import { createHead } from '~/utilities/index.ts'

export default {
  async asyncData({ app }) {
    // For global
    const allPartialPageContents = await getAllPartialPageContents()

    // For page
    const siteDataContent = await getSiteDataContent()
    const routeName = app.getRouteBaseName()
    const pageContent = await getPageContent(routeName)

    return {
      siteDataContent,
      allPartialPageContents,
      pageContent
    }
  },

  created() {
    // Assign value to global
    this.$navState.allPartialPageContents = this.allPartialPageContents
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
