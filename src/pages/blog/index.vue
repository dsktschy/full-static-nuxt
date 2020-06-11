<template>
  <div>
    <h1 class="title">
      {{ content.title.ja_jp }}
    </h1>
  </div>
</template>

<script>
import { getContent } from '~/assets/js/pages-fetcher'
import { create as createHead } from '~/assets/js/head-creator'

export default {
  async asyncData({ route }) {
    return {
      content: await getContent(route.name)
    }
  },

  head() {
    return createHead(
      this.content.title.ja_jp,
      this.content.description.ja_jp,
      this.$siteData.ogImage.url,
      `${process.env.BASE_URL}${this.$route.path}`
    )
  }
}
</script>
