<template>
  <div class="page-about-history">
    <h1>{{ $t(pageContent.title.id) }}</h1>

    <dl>
      <div
        v-for="(historyTermText, i) of historyTermTextList"
        :key="historyTermText.id"
      >
        <dt>{{ $t(historyTermText.id) }}</dt>
        <template
          v-if="isRichEditor(historyDefinitionTextList[i].value.fieldId)"
        >
          <dd v-html="$t(historyDefinitionTextList[i].id)" />
        </template>
        <template v-else>
          <dd>{{ $t(historyDefinitionTextList[i].id) }}</dd>
        </template>
      </div>
    </dl>
  </div>
</template>

<script>
import { getPageContent } from '~/assets/js/pages-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { createPageMessage } from '~/assets/js/message-creator'
import { richEditorFieldId } from '~/assets/json/variables'

export default {
  async asyncData({ app, route }) {
    const routeName = app.getRouteBaseName()
    const pageContent = await getPageContent(routeName)
    const messages = {}
    for (const locale of app.i18n.locales) {
      messages[locale.code] = createPageMessage(locale.code, pageContent)
    }
    return {
      pageContent,
      messages
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
    // Running in fetch causes error in template
    // Because message ($t) has no fields until running mergeLocaleMessage
    for (const locale of this.$i18n.locales) {
      this.$i18n.mergeLocaleMessage(locale.code, this.messages[locale.code])
    }
  },

  methods: {
    isRichEditor(fieldId) {
      return fieldId === richEditorFieldId
    }
  },

  head() {
    const siteTitle = this.$t(this.$siteDataContent.title.id)
    return createHead(
      `${this.$t(this.pageContent.title.id)} | ${siteTitle}`,
      this.$t(this.pageContent.description.id),
      this.$siteDataContent.ogImage.value.url,
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
