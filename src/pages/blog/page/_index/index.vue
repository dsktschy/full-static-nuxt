<template>
  <div>
    <h1 class="title">{{ pageIndex }} | {{ pageContent.title.ja_jp }}</h1>
    <ul>
      <NuxtLink
        v-for="postContent of postContentList"
        :key="postContent.id"
        :to="`/blog/${postContent.id}`"
        tag="li"
        class="item"
      >
        <h2>{{ postContent.title.ja_jp }}</h2>
      </NuxtLink>
    </ul>
    <BasePager
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
import { getContent as getPageContent } from '~/assets/js/pages-fetcher'
import { getContentList as getPostContentList } from '~/assets/js/posts-fetcher'
import { create as createHead } from '~/assets/js/head-creator'

export default {
  components: {
    BasePager
  },

  async asyncData({ route, params, payload }) {
    const pageIndex = parseInt(params.index, 10)
    const offset = postsPerRequestToPage * (pageIndex - 1)
    const postContentList =
      payload?.postContentList || (await getPostContentList({ offset }))
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
    goToBlogPage({ index }) {
      this.$router.push(`/blog/page/${index}`)
    }
  },

  head() {
    return createHead(
      `${this.pageContent.title.ja_jp} | ${this.$siteData.title.ja_jp}`,
      this.pageContent.description.ja_jp,
      this.$siteData.ogImage.url,
      `${process.env.BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style scoped>
.item {
  cursor: pointer;
}
.pager {
  width: 200px;
  margin: 0 auto;
}
</style>
