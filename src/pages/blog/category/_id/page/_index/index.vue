<template>
  <div>
    <h1 class="title">
      Page {{ pageIndex }} - {{ categoryContent.name.value.ja }} |
      {{ pageContent.title.value.ja }}
    </h1>

    <ul class="category-list">
      <NuxtLink
        v-for="categoryContent of $allCategoryContents"
        :key="categoryContent.id"
        :to="`/blog/category/${categoryContent.id}/page/1`"
        tag="li"
        class="category-item"
      >
        {{ categoryContent.name.value.ja }}
      </NuxtLink>
    </ul>

    <ul>
      <NuxtLink
        v-for="postContent of postContentList"
        :key="postContent.id"
        :to="`/blog/${postContent.id}`"
        tag="li"
        class="post-item"
      >
        <time :datetime="postContent.createdAt" class="post-item-date">{{
          convertIsoToDotSeparatedYmd(postContent.createdAt)
        }}</time>
        <div class="post-item-category">
          {{ postContent.category.name.value.ja }}
        </div>
        <h2 class="post-item-title">{{ postContent.title.value.ja }}</h2>
      </NuxtLink>
      <li v-if="!postContentList.length">No content</li>
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
import { getPageContent } from '~/assets/js/pages-fetcher'
import { getPostContentList } from '~/assets/js/posts-fetcher'
import { getCategoryContent } from '~/assets/js/categories-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { convertIsoToDotSeparatedYmd } from '~/assets/js/utility'

export default {
  components: {
    BasePager
  },

  validate({ app, params }) {
    const categoryId = params.id
    const categoryValid = app.$allCategoryContents.some(
      (categoryContent) => categoryContent.id === categoryId
    )
    if (!categoryValid) return false
    const pageIndex = parseInt(params.index, 10)
    const totalPosts = app.$totalCategorizedPosts[categoryId]
    const maxIndex = Math.ceil(totalPosts / postsPerRequestToPage)
    return pageIndex > 0 && (pageIndex <= maxIndex || maxIndex === 0)
  },

  async asyncData({ route, params, payload }) {
    const categoryId = params.id
    const pageIndex = parseInt(params.index, 10)
    const offset = postsPerRequestToPage * (pageIndex - 1)
    const filters = `category[equals]${categoryId}`
    const options = { offset, filters }
    const postContentList =
      payload?.postContentList || (await getPostContentList(options))
    return {
      pageContent: await getPageContent('/blog'),
      postContentList,
      categoryContent: await getCategoryContent(categoryId),
      categoryId,
      pageIndex
    }
  },

  computed: {
    maxIndex() {
      const totalPosts = this.$totalCategorizedPosts[this.categoryId]
      return Math.ceil(totalPosts / postsPerRequestToPage)
    }
  },

  methods: {
    convertIsoToDotSeparatedYmd,
    goToBlogPage({ index: pageIndex }) {
      this.$router.push(`/blog/category/${this.categoryId}/page/${pageIndex}`)
    }
  },

  head() {
    return createHead(
      `Page ${this.pageIndex} - ${this.categoryContent.name.value.ja} | ${this.$siteDataContent.title.value.ja}`,
      this.pageContent.description.value.ja,
      this.$siteDataContent.ogImage.value.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style lang="scss" scoped>
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
