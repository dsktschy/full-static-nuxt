<template>
  <div class="page-blog-category-_id-page-_index">
    <h1>
      {{
        $t(pageContent.title.id, {
          categoryName: capitalize($t(currentCategoryContent.name.id))
        })
      }}
    </h1>

    <ul class="category-list">
      <NuxtLink
        v-for="categoryContent of allLocalizedCategoryContents"
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
import BasePager from '~/components/BasePager'
import { getSiteDataContent } from '~/assets/scripts/site-data-fetcher'
import {
  getAllPageContentsForNav,
  getPageContent
} from '~/assets/scripts/pages-fetcher'
import { createHead } from '~/assets/scripts/head-creator'
import {
  convertIsoToDotSeparatedYmd,
  capitalize
} from '~/assets/scripts/common-utility'

export default {
  components: {
    BasePager
  },

  async asyncData({ params, route, isDev, error }) {
    // Validation
    // If requested path has a generated static HTML file, asyncData is not run on client
    // So 404 error, if asyncData is run on client
    if (!isDev && process.client) {
      error({ statusCode: 404, message: '' })
      return {}
    }

    const categoryId = params.id
    const currentIndex = parseInt(params.index, 10)
    const {
      postContentList,
      maxLocalizedCategorizedPageIndex: maxIndex,
      allLocalizedCategoryContents,
      categoryContent: currentCategoryContent
    } = await import(
      /* webpackChunkName: "[request]" */
      `~/assets/json/payloads/${route.name}-${categoryId}-${currentIndex}.json`
    )

    if (currentIndex < 1 || currentIndex > maxIndex) {
      error({ statusCode: 404, message: '' })
      return {}
    }

    // For global
    const allPageContentsForNav = await getAllPageContentsForNav()

    // For page
    const siteDataContent = await getSiteDataContent()
    const pageContent = await getPageContent('blog-category-_id-page-_index')

    return {
      postContentList,
      maxIndex,
      allLocalizedCategoryContents,
      currentCategoryContent,
      currentIndex,
      allPageContentsForNav,
      siteDataContent,
      pageContent,
      categoryId
    }
  },

  created() {
    // Assign value to global
    this.$global.allPageContentsForNav = this.allPageContentsForNav
  },

  methods: {
    convertIsoToDotSeparatedYmd,
    capitalize,

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
    const pageTitle = this.$t(this.pageContent.title.id, {
      categoryName: capitalize(categoryName)
    })
    return createHead(
      `${pageTitle} | ${siteTitle}`,
      this.$t(this.pageContent.description.id, { categoryName }),
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
