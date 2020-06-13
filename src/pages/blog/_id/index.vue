<template>
  <article>
    <h1 class="title">{{ postContent.title.ja_jp }}</h1>
    <img :src="postContent.featuredImage.url" alt />
    <div v-html="postContent.content.ja_jp" />
    <div class="link-list">
      <div class="link-item">
        <NuxtLink
          v-if="prevPostContent"
          :to="`/blog/${prevPostContent.id}`"
          tag="h2"
        >
          {{ prevPostContent.title.ja_jp }}
        </NuxtLink>
      </div>
      <NuxtLink :to="`/blog/page/1`" class="link-item">
        Go to list
      </NuxtLink>
      <div class="link-item">
        <NuxtLink
          v-if="nextPostContent"
          :to="`/blog/${nextPostContent.id}`"
          tag="h2"
        >
          {{ nextPostContent.title.ja_jp }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script>
import { getPostContent, getPostContentList } from '~/assets/js/posts-fetcher'
import { createHead } from '~/assets/js/head-creator'

export default {
  async asyncData({ payload, params }) {
    const postContent =
      payload?.postContent || (await getPostContent(params.id))
    const fields = 'id,createdAt,title'
    const limit = 1
    const createdAt = postContent.createdAt
    const prevFilters = `createdAt[less_than]${createdAt}`
    const nextFilters = `createdAt[greater_than]${createdAt}`
    const prevOptions = { fields, limit, filters: prevFilters }
    const prevPostContent = (await getPostContentList(prevOptions))[0]
    const nextOptions = { fields, limit, filters: nextFilters }
    const nextPostContent = (await getPostContentList(nextOptions))[0]
    return {
      postContent,
      prevPostContent,
      nextPostContent
    }
  },

  head() {
    return createHead(
      `${this.postContent.title.ja_jp} | ${this.$siteDataContent.title.ja_jp}`,
      this.postContent.description.ja_jp,
      this.postContent.featuredImage.url,
      `${process.env.BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style scoped>
.link-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 320px;
  margin: 0 auto;
}
.link-item {
  display: flex;
  justify-content: center;
  width: 320px;
  cursor: pointer;
}
</style>
