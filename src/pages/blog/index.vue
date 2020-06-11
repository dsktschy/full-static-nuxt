<template>
  <div>
    <h1 class="title">
      {{ pageContent.title.ja_jp }}
    </h1>
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
  </div>
</template>

<script>
import { getContent as getPageContent } from '~/assets/js/pages-fetcher'
import { getContentList as getPostContentList } from '~/assets/js/posts-fetcher'
import { create as createHead } from '~/assets/js/head-creator'

export default {
  async asyncData({ route }) {
    return {
      pageContent: await getPageContent(route.name),
      postContentList: await getPostContentList()
    }
  },

  head() {
    return createHead(
      `${this.pageContent.title.ja_jp} | ${this.$siteData.title.ja_jp}`,
      this.pageContent.description.ja_jp,
      this.$siteData.ogImage.url,
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
