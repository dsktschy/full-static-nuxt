<template>
  <article class="page-blog-id">
    <h1 class="title">{{ postContent.title.value.ja }}</h1>
    <img
      :src="postContent.featuredImage.value.url"
      :alt="postContent.title.value.ja"
      class="featured-image"
    />
    <div class="content" v-html="postContent.content.value.ja" />
    <div class="link-list">
      <div class="link-item">
        <NuxtLink
          v-if="prevPostContent"
          :to="`/blog/${prevPostContent.id}`"
          tag="h2"
        >
          {{ prevPostContent.title.value.ja }}
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
          {{ nextPostContent.title.value.ja }}
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
      `${this.postContent.title.value.ja} | ${this.$siteDataContent.title.value.ja}`,
      this.postContent.description.value.ja,
      this.postContent.featuredImage.value.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style lang="scss" scoped>
.page-blog-id {
  width: 864px;
  margin: 0 auto;
}
.featured-image {
  width: 100%;
  object-fit: cover;
}
.content {
  & ::v-deep img {
    display: block;
    width: 100%;
    object-fit: cover;
  }
  & ::v-deep iframe {
    display: block;
    margin: 0 auto;
  }
}
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
