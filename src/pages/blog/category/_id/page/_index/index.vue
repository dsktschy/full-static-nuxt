<template>
  <div>
    <h1 class="title">
      Page {{ pageIndex }} - {{ categoryContent.name.ja_jp }} |
      {{ pageContent.title.ja_jp }}
    </h1>
    <ul class="category-list">
      <NuxtLink
        v-for="categoryContent of $allCategoryContents"
        :key="categoryContent.id"
        :to="`/blog/category/${categoryContent.id}/page/1`"
        tag="li"
        class="category-item"
      >
        {{ categoryContent.name.ja_jp }}
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
        <h2>{{ postContent.title.ja_jp }}</h2>
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
    goToBlogPage({ index: pageIndex }) {
      this.$router.push(`/blog/category/${this.categoryId}/page/${pageIndex}`)
    }
  },

  head() {
    return createHead(
      `Page ${this.pageIndex} - ${this.categoryContent.name.ja_jp} | ${this.$siteDataContent.title.ja_jp}`,
      this.pageContent.description.ja_jp,
      this.$siteDataContent.ogImage.url,
      `${process.env.BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style scoped>
.category-list {
  display: flex;
}
.category-item {
  margin-right: 30px;
  cursor: pointer;
}
.post-item {
  cursor: pointer;
}
.pager {
  width: 320px;
  margin: 0 auto;
}
</style>
