<template>
  <div class="page-blog-page-_index">
    <h1>{{ $t(pageContent.title.id) }}</h1>

    <ul class="category-list">
      <NuxtLink
        v-for="categoryContent of localizedAllCategoryContents"
        :key="categoryContent.id"
        :to="localePath(`/blog/category/${categoryContent.id}/page/1`)"
        tag="li"
        class="category-item"
      >
        {{ capitalize($t(categoryContent.name.id)) }}
      </NuxtLink>
    </ul>

    <ul>
      <NuxtLink
        v-for="postContent of postContentList"
        :key="postContent.id"
        :to="localePath(`/blog/${postContent.id}`)"
        tag="li"
        class="post-item"
      >
        <time :datetime="postContent.createdAt" class="post-item-date">{{
          convertIsoToDotSeparatedYmd(postContent.createdAt)
        }}</time>
        <div class="post-item-category">
          {{ capitalize($t(postContent.category.name.id)) }}
        </div>
        <h2 class="post-item-title">{{ postContent.title[$i18n.locale] }}</h2>
      </NuxtLink>
      <li v-if="!postContentList.length">
        {{ $t('page-blog-page-_index-none') }}
      </li>
    </ul>

    <BasePager
      v-if="maxIndex"
      :current-index="currentIndex"
      :max-index="maxIndex"
      class="pager"
      @click-prev="goToBlogPage"
      @click-next="goToBlogPage"
    />
  </div>
</template>

<script>
import { getSiteDataContent } from '~/api/content/site-data.ts'
import {
  getAllPartialPageContents,
  getPageContent
} from '~/api/content/pages.ts'
import {
  convertIsoToDotSeparatedYmd,
  capitalize,
  createHead
} from '~/utilities/index.ts'

export default {
  async asyncData({ params, route, isDev, error }) {
    // Validation
    // If requested path has a generated static HTML file, asyncData is not run on client
    // So 404 error, if asyncData is run on client
    if (!isDev && process.client) {
      error({ statusCode: 404, message: '' })
      return {}
    }

    const currentIndex = parseInt(params.index, 10)
    const {
      postContentList,
      localizedMaxPageIndex: maxIndex,
      localizedAllCategoryContents
    } = await import(
      /* webpackChunkName: "[request]" */
      `~/assets/json/payloads/${route.name}-${currentIndex}.json`
    )

    if (currentIndex < 1 || currentIndex > maxIndex) {
      error({ statusCode: 404, message: '' })
      return {}
    }

    // For global
    const allPartialPageContents = await getAllPartialPageContents()

    // For page
    const siteDataContent = await getSiteDataContent()
    const pageContent = await getPageContent('blog-page-_index')

    return {
      postContentList,
      maxIndex,
      localizedAllCategoryContents,
      currentIndex,
      allPartialPageContents,
      siteDataContent,
      pageContent
    }
  },

  created() {
    // Assign value to global
    this.$navState.allPartialPageContents = this.allPartialPageContents
  },

  methods: {
    convertIsoToDotSeparatedYmd,
    capitalize,

    goToBlogPage({ index: currentIndex }) {
      this.$router.push(this.localePath(`/blog/page/${currentIndex}`))
    }
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
.page-blog-page-_index {
  width: 764px;
  margin: 0 auto;
}
.category-list {
  display: flex;
}
.category-item {
  margin-right: 30px;
  cursor: pointer;
}
.post-item {
  display: flex;
  align-content: space-between;
  cursor: pointer;
}
.post-item-date {
  flex: 20%;
}
.post-item-category {
  width: 20%;
}
.post-item-title {
  width: 60%;
}
.pager {
  width: 320px;
  margin: 0 auto;
}
</style>
