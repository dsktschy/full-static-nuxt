<template>
  <div>
    <h1 class="title">Page {{ pageIndex }} | {{ pageContent.title.ja_jp }}</h1>
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
import { createHead } from '~/assets/js/head-creator'

export default {
  components: {
    BasePager
  },

  validate({ app, params }) {
    const pageIndex = parseInt(params.index, 10)
    const maxIndex = Math.ceil(app.$totalPosts / postsPerRequestToPage)
    return pageIndex > 0 && (pageIndex <= maxIndex || maxIndex === 0)
  },

  async asyncData({ route, params, payload }) {
    const pageIndex = parseInt(params.index, 10)
    const offset = postsPerRequestToPage * (pageIndex - 1)
    const options = { offset }
    const postContentList =
      payload?.postContentList || (await getPostContentList(options))
    return {
      pageContent: await getPageContent('/blog'),
      postContentList,
      pageIndex
    }
  },

  computed: {
    maxIndex() {
      return Math.ceil(this.$totalPosts / postsPerRequestToPage)
    }
  },

  methods: {
    goToBlogPage({ index: pageIndex }) {
      this.$router.push(`/blog/page/${pageIndex}`)
    }
  },

  head() {
    return createHead(
      `Page ${this.pageIndex} | ${this.$siteDataContent.title.ja_jp}`,
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
