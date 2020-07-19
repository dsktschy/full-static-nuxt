<template>
  <div class="page-about-history">
    <h1>{{ $t(pageContent.title.id) }}</h1>

    <dl>
      <div
        v-for="(historyTermText, i) of historyTermTextList"
        :key="historyTermText.id"
      >
        <dt>{{ $t(historyTermText.id) }}</dt>
        <dd v-html="$t(historyDefinitionTextList[i].id)" />
      </div>
    </dl>
  </div>
</template>

<script>
import { getSiteDataContent } from '~/model/content/site-data.ts'
import {
  getAllPartialPageContents,
  getPageContent
} from '~/model/content/pages.ts'
import { createHead, filterWithIdPrefix, sortById } from '~/utilities/index.ts'

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

  computed: {
    historyTermTextList() {
      const list = this.pageContent.plainText
      const idPrefix = 'page-about-history-body-term-'
      return sortById(filterWithIdPrefix(list, idPrefix))
    },

    historyDefinitionTextList() {
      const list = [...this.pageContent.plainText, ...this.pageContent.richText]
      const idPrefix = 'page-about-history-body-definition-'
      return sortById(filterWithIdPrefix(list, idPrefix))
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
.page-about-history {
  width: 764px;
  margin: 0 auto;
}
</style>
