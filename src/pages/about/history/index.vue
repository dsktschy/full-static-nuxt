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
import { getSiteDataContent } from '~/assets/scripts/site-data.ts'
import {
  getAllPageContentsForNav,
  getPageContent
} from '~/assets/scripts/pages.ts'
import { createHead } from '~/assets/scripts/head.ts'

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

  computed: {
    historyTermTextList() {
      const prefix = 'page-about-history-body-term-'
      const historyTermTextList = this.pageContent.plainText.filter((text) =>
        text.id.startsWith(prefix)
      )
      const sortedHistoryTermTextList = []
      for (let i = 0; i < historyTermTextList.length; i++) {
        const id = `${prefix}${i + 1}`
        sortedHistoryTermTextList[i] = historyTermTextList.find(
          (text) => text.id === id
        )
      }
      return sortedHistoryTermTextList
    },

    historyDefinitionTextList() {
      const prefix = 'page-about-history-body-definition-'
      const historyDefinitionTextList = [
        ...this.pageContent.plainText.filter((text) =>
          text.id.startsWith(prefix)
        ),
        ...this.pageContent.richText.filter((text) =>
          text.id.startsWith(prefix)
        )
      ]
      const sortedHistoryDefinitionTextList = []
      for (let i = 0; i < historyDefinitionTextList.length; i++) {
        const id = `${prefix}${i + 1}`
        sortedHistoryDefinitionTextList[i] = historyDefinitionTextList.find(
          (text) => text.id === id
        )
      }
      return sortedHistoryDefinitionTextList
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
.page-about-history {
  width: 764px;
  margin: 0 auto;
}
</style>
