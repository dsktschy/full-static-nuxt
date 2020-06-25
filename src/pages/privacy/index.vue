<template>
  <div class="page-privacy">
    <h1>{{ $t(pageContent.title.id) }}</h1>

    <div v-html="$t('page-privacy-body')" />
  </div>
</template>

<script>
import { getPageContent } from '~/assets/js/pages-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { createPageMessage } from '~/assets/js/message-creator'

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

  created() {
    // Running in fetch causes error in template
    // Because message ($t) has no fields until running mergeLocaleMessage
    for (const locale of this.$i18n.locales) {
      this.$i18n.mergeLocaleMessage(locale.code, this.messages[locale.code])
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
.page-privacy {
  width: 764px;
  margin: 0 auto;
}
</style>
