<template>
  <div class="page-blog-category-_id-page-_index">
    <h1>
      Page {{ pageIndex }} - {{ $t(categoryContent.name.id) }} |
      {{ $t(pageContent.title.id) }}
    </h1>

    <ul class="category-list">
      <NuxtLink
        v-for="categoryContent of allCategoryContents"
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
      :current-index="pageIndex"
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
import { getTotalPosts, getPostContentList } from '~/assets/js/posts-fetcher'
import {
  getAllCategoryContents,
  getCategoryContent
} from '~/assets/js/categories-fetcher'
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
    const categoryValid = allCategoryContents.some(
      (categoryContent) => categoryContent.id === categoryId
    )
    if (!categoryValid) {
      error({ statusCode: 404, message: '' })
      return {}
    }
    const pageIndex = parseInt(params.index, 10)
    const totalCategorizedPosts = {}
    for (const categoryContent of allCategoryContents) {
      const filters = `category[equals]${categoryContent.id}`
      const options = { filters }
      totalCategorizedPosts[categoryContent.id] = await getTotalPosts(options)
    }
    const totalCategorizedPost = totalCategorizedPosts[categoryId]
    const maxIndex = Math.ceil(totalCategorizedPost / postsPerRequestToPage)
    if (pageIndex < 1 || (pageIndex > maxIndex && maxIndex !== 0)) {
      error({ statusCode: 404, message: '' })
      return {}
    }

    // For global
    const allPageContentsForNav = await getAllPageContentsForNav()

    // For page
    const siteDataContent = await getSiteDataContent()
    const pageContent = await getPageContent('/blog')
    const offset = postsPerRequestToPage * (pageIndex - 1)
    const filters = `category[equals]${categoryId}`
    const fields = 'id,createdAt,title,category.name'
    const options = { offset, filters, fields }
    const postContentList =
      payload?.postContentList || (await getPostContentList(options))
    const categoryContent = await getCategoryContent(categoryId)

    return {
      allCategoryContents,
      siteDataContent,
      allPageContentsForNav,
      pageContent,
      postContentList,
      categoryContent,
      categoryId,
      pageIndex,
      maxIndex
    }
  },

  created() {
    // Assign value to global
    this.$global.allPageContentsForNav = this.allPageContentsForNav
  },

  methods: {
    convertIsoToDotSeparatedYmd,

    goToBlogPage({ index: pageIndex }) {
      this.$router.push(
        this.localePath(`/blog/category/${this.categoryId}/page/${pageIndex}`)
      )
    }
  },

  head() {
    const siteTitle = this.$t(this.siteDataContent.title.id)
    const categoryName = this.$t(this.categoryContent.name.id)
    return createHead(
      `Page ${this.pageIndex} - ${categoryName} | ${siteTitle}`,
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
