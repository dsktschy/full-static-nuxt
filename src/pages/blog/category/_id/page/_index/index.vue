<template>
  <div class="page-blog-category-_id-page-_index">
    <h1>
      Page {{ currentIndex }} - {{ $t(currentCategoryContent.name.id) }} |
      {{ $t(pageContent.title.id) }}
    </h1>

    <ul class="category-list">
      <NuxtLink
        v-for="categoryContent of allCurrentLocaleCategoryContents"
        :key="categoryContent.id"
        :to="localePath(`/blog/category/${categoryContent.id}/page/1`)"
        tag="li"
        class="category-item"
      >
        {{ $t(categoryContent.name.id) }}
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
          {{ $t(postContent.category.name.id) }}
        </div>
        <h2 class="post-item-title">{{ postContent.title[$i18n.locale] }}</h2>
      </NuxtLink>
      <li v-if="!postContentList.length">{{ $t('page-blog-none') }}</li>
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
import BasePager from '~/components/BasePager'
import { postsPerRequestToPage } from '~/assets/json/variables'
import { getSiteDataContent } from '~/assets/js/site-data-fetcher'
import {
  getAllPageContentsForNav,
  getPageContent
} from '~/assets/js/pages-fetcher'
import {
  getTotalPostsPerLocale,
  getPostContentList
} from '~/assets/js/posts-fetcher'
import { getAllCategoryContents } from '~/assets/js/categories-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { convertIsoToDotSeparatedYmd } from '~/assets/js/common-utility'

export default {
  components: {
    BasePager
  },

  async asyncData({ app, params, payload, error }) {
    // Validation
    const categoryId = params.id
    const allCategoryContents = await getAllCategoryContents()
    const allCurrentLocaleCategoryContents = []
    let currentCategoryContent = null
    let totalCurrentLocaleCategorizedPosts = 0
    for (const categoryContent of allCategoryContents) {
      if (categoryContent.id === categoryId)
        currentCategoryContent = categoryContent
      const categorizedTotalPostsPerLocale = await getTotalPostsPerLocale({
        filters: `category[equals]${categoryContent.id}`
      })
      const totalPosts = categorizedTotalPostsPerLocale[app.i18n.locale]
      if (!totalPosts) continue
      if (categoryContent.id === categoryId)
        totalCurrentLocaleCategorizedPosts = totalPosts
      allCurrentLocaleCategoryContents.push(categoryContent)
    }
    const currentIndex = parseInt(params.index, 10)
    const maxIndex = Math.ceil(
      totalCurrentLocaleCategorizedPosts / postsPerRequestToPage
    )
    const currentIndexValid =
      currentIndex > 0 && (currentIndex <= maxIndex || maxIndex === 0)
    if (!totalCurrentLocaleCategorizedPosts || !currentIndexValid) {
      error({ statusCode: 404, message: '' })
      return {}
    }

    // For global
    const allPageContentsForNav = await getAllPageContentsForNav()

    // For page
    const siteDataContent = await getSiteDataContent()
    const pageContent = await getPageContent('/blog')
    const offset = postsPerRequestToPage * (currentIndex - 1)
    const filters = `category[equals]${categoryId}`
    const fields = 'id,createdAt,title,category.name'
    const options = { offset, filters, fields }
    const postContentList =
      payload?.postContentList || (await getPostContentList(options))

    return {
      categoryId,
      allCurrentLocaleCategoryContents,
      currentCategoryContent,
      currentIndex,
      maxIndex,
      allPageContentsForNav,
      siteDataContent,
      pageContent,
      postContentList
    }
  },

  created() {
    // Assign value to global
    this.$global.allPageContentsForNav = this.allPageContentsForNav
  },

  methods: {
    convertIsoToDotSeparatedYmd,

    goToBlogPage({ index: currentIndex }) {
      this.$router.push(
        this.localePath(
          `/blog/category/${this.categoryId}/page/${currentIndex}`
        )
      )
    }
  },

  head() {
    const siteTitle = this.$t(this.siteDataContent.title.id)
    const categoryName = this.$t(this.currentCategoryContent.name.id)
    return createHead(
      `Page ${this.currentIndex} - ${categoryName} | ${siteTitle}`,
      this.$t(this.pageContent.description.id),
      this.siteDataContent.ogImage.value.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style lang="scss" scoped>
.page-blog-category-_id-page-_index {
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
.pager {
  width: 320px;
  margin: 0 auto;
}
</style>
