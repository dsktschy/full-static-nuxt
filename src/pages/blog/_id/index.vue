<template>
  <article class="page-blog-id">
    <h1>{{ postContent.title[$i18n.locale] }}</h1>

    <img
      :src="postContent.featuredImage.url"
      :alt="postContent.title[$i18n.locale]"
      class="featured-image"
    />
    <div class="content" v-html="postContent.content[$i18n.locale]" />
    <div class="link-list">
      <div class="link-item">
        <NuxtLink
          v-if="prevPostContent"
          :to="localePath(`/blog/${prevPostContent.id}`)"
          tag="h2"
        >
          {{ prevPostContent.title[$i18n.locale] }}
        </NuxtLink>
      </div>
      <NuxtLink :to="localePath(`/blog/page/1`)" class="link-item">
        {{ $t('page-blog-post-list') }}
      </NuxtLink>
      <div class="link-item">
        <NuxtLink
          v-if="nextPostContent"
          :to="localePath(`/blog/${nextPostContent.id}`)"
          tag="h2"
        >
          {{ nextPostContent.title[$i18n.locale] }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script>
import { getPageContent } from '~/assets/js/pages-fetcher'
import { getPostContent, getPostContentList } from '~/assets/js/posts-fetcher'
import { createHead } from '~/assets/js/head-creator'
import {
  createPageMessage,
  createPostMessage,
  createPostsMessage
} from '~/assets/js/message-creator'

export default {
  async asyncData({ app, payload, params }) {
    const pageContent = await getPageContent('blog')
    const postContent =
      payload?.postContent || (await getPostContent(params.id))
    const fields = 'id,createdAt,title,category'
    const limit = 1
    const createdAt = postContent.createdAt
    const prevFilters = `createdAt[less_than]${createdAt}`
    const nextFilters = `createdAt[greater_than]${createdAt}`
    const prevOptions = { fields, limit, filters: prevFilters }
    const prevPostContent = (await getPostContentList(prevOptions))[0]
    const nextOptions = { fields, limit, filters: nextFilters }
    const nextPostContent = (await getPostContentList(nextOptions))[0]
    const adjacentPostContents = []
    if (prevPostContent) adjacentPostContents.push(prevPostContent)
    if (nextPostContent) adjacentPostContents.push(nextPostContent)
    const messages = {}
    for (const locale of app.i18n.locales) {
      messages[locale] = {
        ...createPageMessage(locale, pageContent),
        ...createPostMessage(locale, postContent),
        ...createPostsMessage(locale, adjacentPostContents)
      }
    }
    return {
      postContent,
      prevPostContent,
      nextPostContent,
      messages
    }
  },

  created() {
    // Running in fetch causes error in template
    // Because message ($t) has no fields until running mergeLocaleMessage
    for (const locale of this.$i18n.locales) {
      this.$i18n.mergeLocaleMessage(locale, this.messages[locale])
    }
  },

  head() {
    const siteTitle = this.$t(this.$siteDataContent.title.id)
    return createHead(
      `${this.postContent.title[this.$i18n.locale]} | ${siteTitle}`,
      this.postContent.description[this.$i18n.locale],
      this.postContent.featuredImage.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style lang="scss" scoped>
.page-blog-id {
  width: 764px;
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
