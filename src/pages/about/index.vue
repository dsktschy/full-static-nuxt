<template>
  <div>
    <div class="header">
      <h1 class="primary-heading">{{ pageContent.title.value.ja }}</h1>
    </div>

    <section>
      <h2>{{ missionHeadingText.value.ja }}</h2>
      <p>{{ missionSummaryText.value.ja }}</p>
      <p>{{ missionBodyText.value.ja }}</p>
    </section>

    <section>
      <h2>{{ companyHeadingText.value.ja }}</h2>
      <dl>
        <div
          v-for="(companyTermText, i) of companyTermTextList"
          :key="companyTermText.id"
          class="company-item"
        >
          <dt>{{ companyTermText.value.ja }}</dt>
          <template
            v-if="isRichEditor(companyDefinitionTextList[i].value.fieldId)"
          >
            <dd v-html="companyDefinitionTextList[i].value.ja" />
          </template>
          <template v-else>
            <dd>{{ companyDefinitionTextList[i].value.ja }}</dd>
          </template>
        </div>
      </dl>
    </section>

    <ul class="nav">
      <NuxtLink
        v-for="lowerPageContent of lowerPageContentList"
        :key="lowerPageContent.id"
        :to="lowerPageContent.path"
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
import { padWithZero } from '~/assets/js/utility'
import { richEditorFieldId } from '~/assets/json/variables'

export default {
  async asyncData({ app, route }) {
    const lowerPageContentList = app.$allPageContentsForNav.filter(
      (pageContent) => pageContent.path.startsWith('/about/')
    )
    return {
      pageContent: await getPageContent(route.name),
      lowerPageContentList
    }
  },

  computed: {
    missionHeadingText() {
      const id = 'page-about-mission-heading'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    missionSummaryText() {
      const id = 'page-about-mission-summary'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    missionBodyText() {
      const id = 'page-about-mission-body'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    companyHeadingText() {
      const id = 'page-about-company-heading'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
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
