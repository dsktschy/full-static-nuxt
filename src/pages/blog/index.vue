<template>
  <div>
    <h1 class="title">{{ pageContent.title.ja_jp }}</h1>
    <ul>
      <NuxtLink
        v-for="postContent of postContentList"
        :key="postContent.id"
        :to="`/blog/${postContent.id}`"
        tag="li"
        class="item"
      >
        <h2>{{ postContent.title.ja_jp }}</h2>
      </NuxtLink>
    </ul>
    <NuxtLink to="/blog/page/1">More</NuxtLink>
  </div>
</template>

<script>
import { getPageContent } from '~/assets/js/pages-fetcher'
import { getPostContentList } from '~/assets/js/posts-fetcher'
import { createHead } from '~/assets/js/head-creator'

export default {
  async asyncData({ route }) {
    return {
      pageContent: await getPageContent(route.name),
      postContentList: await getPostContentList()
    }
  },

  head() {
    return createHead(
      `${this.pageContent.title.ja_jp} | ${this.$siteDataContent.title.ja_jp}`,
      this.pageContent.description.ja_jp,
      this.$siteDataContent.ogImage.url,
      `${process.env.BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style scoped>
.item {
  cursor: pointer;
}
</style>
