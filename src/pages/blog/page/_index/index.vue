<template>
  <div class="page-blog-page-_index">
    <h1>Page {{ pageIndex }} | {{ $t(pageContent.title.id) }}</h1>

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
import { mapState } from 'vuex'
import BasePager from '~/components/BasePager'
import { postsPerRequestToPage } from '~/assets/json/variables'
import { getPageContent } from '~/assets/js/pages-fetcher'
import { getPostContentList } from '~/assets/js/posts-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { convertIsoToDotSeparatedYmd } from '~/assets/js/common-utility'

export default {
  components: {
    BasePager
  },

  validate({ app, params, store }) {
    const pageIndex = parseInt(params.index, 10)
    const maxIndex = Math.ceil(store.state.totalPosts / postsPerRequestToPage)
    return pageIndex > 0 && (pageIndex <= maxIndex || maxIndex === 0)
  },

  async asyncData({ app, route, params, payload }) {
    const pageContent = await getPageContent('/blog')
    const pageIndex = parseInt(params.index, 10)
    const offset = postsPerRequestToPage * (pageIndex - 1)
    const fields = 'id,createdAt,title,category.name'
    const options = { offset, fields }
    const postContentList =
      payload?.postContentList || (await getPostContentList(options))
    return {
      pageContent,
      postContentList,
      pageIndex
    }
  },

  computed: {
    ...mapState(['siteDataContent', 'totalPosts', 'allCategoryContents']),

    maxIndex() {
      return Math.ceil(this.totalPosts / postsPerRequestToPage)
    }
  },

  methods: {
    convertIsoToDotSeparatedYmd,

    goToBlogPage({ index: pageIndex }) {
      this.$router.push(this.localePath(`/blog/page/${pageIndex}`))
    }
  },

  head() {
    const siteTitle = this.$t(this.siteDataContent.title.id)
    return createHead(
      `Page ${this.pageIndex} | ${siteTitle}`,
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
