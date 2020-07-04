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
        {{ $t('page-blog-_id-back') }}
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
import { getSiteDataContent } from '~/assets/js/site-data-fetcher'
import { getAllPageContentsForNav } from '~/assets/js/pages-fetcher'
import { createHead } from '~/assets/js/head-creator'

export default {
  async asyncData({ app, route, params, isDev, error }) {
    // Validation
    // If requested path has a generated static HTML file, asyncData is not run on client
    // So 404 error, if asyncData is run on client
    if (!isDev && process.client) {
      error({ statusCode: 404, message: '' })
      return {}
    }

    // For global
    const allPageContentsForNav = await getAllPageContentsForNav()

    // For page
    const siteDataContent = await getSiteDataContent()
    const { postContent, prevPostContent, nextPostContent } = await import(
      /* webpackChunkName: "[request]" */
      `~/assets/json/payloads/${route.name}-${params.id}.json`
    )

    return {
      siteDataContent,
      allPageContentsForNav,
      postContent,
      prevPostContent,
      nextPostContent
    }
  },

  created() {
    // Assign value to global
    this.$global.allPageContentsForNav = this.allPageContentsForNav
  },

  head() {
    const siteTitle = this.$t(this.siteDataContent.title.id)
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
