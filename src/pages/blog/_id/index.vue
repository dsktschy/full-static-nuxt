<template>
  <div>
    <h1 class="title">{{ content.title.ja_jp }}</h1>
    <img :src="content.featuredImage.url" alt />
    <div v-html="content.content.ja_jp" />
  </div>
</template>

<script>
import { getPostContent } from '~/assets/js/posts-fetcher'
import { createHead } from '~/assets/js/head-creator'

export default {
  async asyncData({ payload, params }) {
    return {
      content: payload?.content || (await getPostContent(params.id))
    }
  },

  head() {
    return createHead(
      `${this.content.title.ja_jp} | ${this.$siteDataContent.title.ja_jp}`,
      this.content.description.ja_jp,
      this.content.featuredImage.url,
      `${process.env.BASE_URL}${this.$route.path}`
    )
  }
}
</script>