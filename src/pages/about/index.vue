<template>
  <div>
    <h1>{{ $t(pageContent.title.id) }}</h1>

    <section>
      <h2>{{ $t('page-about-mission-heading') }}</h2>
      <p>{{ $t('page-about-mission-summary') }}</p>
      <p>{{ $t('page-about-mission-body') }}</p>
    </section>

    <section>
      <h2>{{ $t('page-about-company-heading') }}</h2>
      <dl>
        <div
          v-for="(companyTermText, i) of companyTermTextList"
          :key="companyTermText.id"
        >
          <dt>{{ $t(companyTermText.id) }}</dt>
          <template
            v-if="isRichEditor(companyDefinitionTextList[i].value.fieldId)"
          >
            <dd v-html="$t(companyDefinitionTextList[i].id)" />
          </template>
          <template v-else>
            <dd>{{ $t(companyDefinitionTextList[i].id) }}</dd>
          </template>
        </div>
      </dl>
    </section>

    <ul class="nav">
      <NuxtLink
        v-for="lowerPageContent of lowerPageContentList"
        :key="lowerPageContent.id"
        :to="localePath(lowerPageContent.path)"
        tag="li"
        class="nav-item"
      >
        {{ lowerPageContent.title.value.ja }}
      </NuxtLink>
    </ul>
  </div>
</template>

<script>
import { getPageContent } from '~/assets/js/pages-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { createPageMessage } from '~/assets/js/message-creator'
import { padWithZero } from '~/assets/js/common-utility'
import { richEditorFieldId } from '~/assets/json/variables'

export default {
  async asyncData({ app, route }) {
    const routeName = app.getRouteBaseName()
    const pageContent = await getPageContent(routeName)
    const lowerPageContentList = app.$allPageContentsForNav.filter(
      (pageContent) => pageContent.path.startsWith('/about/')
    )
    const messages = {}
    for (const locale of app.i18n.locales) {
      messages[locale] = createPageMessage(locale, pageContent)
    }
    return {
      pageContent,
      lowerPageContentList,
      messages
    }
  },

  computed: {
    companyTermTextList() {
      const prefix = 'page-about-company-body-term-'
      const companyTermTextList = this.pageContent.plainText.filter((text) =>
        text.id.startsWith(prefix)
      )
      const sortedCompanyTermTextList = []
      for (let i = 0; i < companyTermTextList.length; i++) {
        const id = `${prefix}${i + 1}`
        sortedCompanyTermTextList[i] = companyTermTextList.find(
          (text) => text.id === id
        )
      }
      return sortedCompanyTermTextList
    },
    companyDefinitionTextList() {
      const prefix = 'page-about-company-body-definition-'
      const companyDefinitionTextList = [
        ...this.pageContent.plainText.filter((text) =>
          text.id.startsWith(prefix)
        ),
        ...this.pageContent.richText.filter((text) =>
          text.id.startsWith(prefix)
        )
      ]
      const sortedCompanyDefinitionTextList = []
      for (let i = 0; i < companyDefinitionTextList.length; i++) {
        const id = `${prefix}${i + 1}`
        sortedCompanyDefinitionTextList[i] = companyDefinitionTextList.find(
          (text) => text.id === id
        )
      }
      return sortedCompanyDefinitionTextList
    }
  },

  created() {
    // Running in fetch causes error in template
    // Because message ($t) has no fields until running mergeLocaleMessage
    for (const locale of this.$i18n.locales) {
      this.$i18n.mergeLocaleMessage(locale, this.messages[locale])
    }
  },

  methods: {
    padWithZero,
    isRichEditor(fieldId) {
      return fieldId === richEditorFieldId
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

<style lang="scss" scoped>
.nav-item {
  cursor: pointer;
}
</style>
