<template>
  <div>
    <div class="header">
      <h1 class="primary-heading">
        <span>{{ pageContent.title.ja_jp }}</span>
        <span>{{ pageContent.title.en_us }}</span>
      </h1>
    </div>

    <section>
      <h2>
        <span>ミッション</span>
        <span>Mission</span>
      </h2>
      <p>{{ missionCopyText.values[0].ja_jp }}</p>
      <p>{{ missionBodyText.values[0].ja_jp }}</p>
    </section>

    <section>
      <h2>
        <span>指針</span>
        <span>Guideline</span>
      </h2>
      <ol>
        <li
          v-for="(guidelineText, i) of guidelineTextList"
          :key="guidelineText.id"
          class="guideline-item"
        >
          <span>{{ padWithZero(i, 2) }}</span>
          <span>{{ guidelineText.key.ja_jp }}</span>
          <p>{{ guidelineText.values[0].ja_jp }}</p>
        </li>
      </ol>
    </section>

    <section>
      <h2>
        <span>会社概要</span>
        <span>Company</span>
      </h2>
      <dl>
        <div
          v-for="companyText of companyTextList"
          :key="companyText.id"
          class="company-item"
        >
          <dt>{{ companyText.key.ja_jp }}</dt>
          <template v-if="isRichEditor(companyText.values[0].fieldId)">
            <dd v-html="companyText.values[0].ja_jp" />
          </template>
          <template v-else>
            <dd>{{ companyText.values[0].ja_jp }}</dd>
          </template>
        </div>
      </dl>
    </section>

    <ul class="nav">
      <NuxtLink to="/about/message" tag="li" class="nav-item"
        >代表あいさつ</NuxtLink
      >
      <NuxtLink to="/about/history" tag="li" class="nav-item">沿革</NuxtLink>
    </ul>
  </div>
</template>

<script>
import { getPageContent } from '~/assets/js/pages-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { padWithZero } from '~/assets/js/utility'
import { richEditorFieldId } from '~/assets/json/variables'

export default {
  async asyncData({ route }) {
    return {
      pageContent: await getPageContent(route.name)
    }
  },

  computed: {
    missionCopyText() {
      const id = 'about-mission-copy'
      return this.pageContent.texts.find((text) => text.id === id) || ''
    },
    missionBodyText() {
      const id = 'about-mission-body'
      return this.pageContent.texts.find((text) => text.id === id) || ''
    },
    guidelineTextList() {
      const id = 'about-guideline-'
      return this.pageContent.texts.filter((text) => text.id.startsWith(id))
    },
    companyTextList() {
      const id = 'about-company-'
      return this.pageContent.texts.filter((text) => text.id.startsWith(id))
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
      `${this.pageContent.title.ja_jp} | ${this.$siteDataContent.title.ja_jp}`,
      this.pageContent.description.ja_jp,
      this.$siteDataContent.ogImage.url,
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
