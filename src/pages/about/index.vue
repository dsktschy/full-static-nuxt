<template>
  <div class="page-about">
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
          <dd v-html="$t(companyDefinitionTextList[i].id)" />
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
        {{ $t(lowerPageContent.title.id) }}
      </NuxtLink>
    </ul>
  </div>
</template>

<script>
import { getSiteDataContent } from '~/model/content/site-data.ts'
import {
  getAllPartialPageContents,
  getPageContent
} from '~/model/content/pages.ts'
import {
  padWithZero,
  createHead,
  filterWithIdPrefix,
  sortById
} from '~/utilities/index.ts'

export default {
  async asyncData({ app }) {
    // For global
    const allPartialPageContents = await getAllPartialPageContents()

    // For page
    const siteDataContent = await getSiteDataContent()
    const routeName = app.getRouteBaseName()
    const pageContent = await getPageContent(routeName)
    const lowerPageContentList = allPartialPageContents.filter(
      (pageContent) =>
        pageContent.path && pageContent.path.startsWith('/about/')
    )

    return {
      siteDataContent,
      allPartialPageContents,
      pageContent,
      lowerPageContentList
    }
  },

  computed: {
    companyTermTextList() {
      const list = this.pageContent.plainText
      const idPrefix = 'page-about-company-body-term-'
      return sortById(filterWithIdPrefix(list, idPrefix))
    },

    companyDefinitionTextList() {
      const list = [...this.pageContent.plainText, ...this.pageContent.richText]
      const idPrefix = 'page-about-company-body-definition-'
      return sortById(filterWithIdPrefix(list, idPrefix))
    }
  },

  created() {
    // Assign value to global
    this.$navState.allPartialPageContents = this.allPartialPageContents
  },

  methods: {
    padWithZero
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
.page-about {
  width: 764px;
  margin: 0 auto;
}
.nav-item {
  cursor: pointer;
}
</style>
