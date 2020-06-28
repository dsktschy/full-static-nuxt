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
import { getSiteDataContent } from '~/assets/js/site-data-fetcher'
import {
  getAllPageContentsForNav,
  getPageContent
} from '~/assets/js/pages-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { padWithZero } from '~/assets/js/common-utility'

export default {
  async asyncData({ app }) {
    // For global
    const allPageContentsForNav = await getAllPageContentsForNav()

    // For page
    const siteDataContent = await getSiteDataContent()
    const routeName = app.getRouteBaseName()
    const pageContent = await getPageContent(routeName)
    const lowerPageContentList = allPageContentsForNav.filter((pageContent) =>
      pageContent.path.startsWith('/about/')
    )

    return {
      siteDataContent,
      allPageContentsForNav,
      pageContent,
      lowerPageContentList
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
    // Assign value to global
    this.$global.allPageContentsForNav = this.allPageContentsForNav
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
