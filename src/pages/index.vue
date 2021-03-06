<template>
  <div>
    <client-only placeholder="Loading...">
      <VueAgile autoplay class="slider">
        <div
          v-for="(sliderImage, i) of sliderImageList"
          :key="sliderImage.id"
          :style="{
            'background-image': `url(${sliderImage.value.url})`
          }"
          class="slider-item"
        >
          <p class="slider-item-text">
            {{ $t(`page-index-slider-${i + 1}`) }}
          </p>
        </div>
      </VueAgile>
    </client-only>

    <div class="body">
      <section>
        <h2>{{ $t('page-index-about-heading') }}</h2>
        <p>{{ $t('page-index-about-body') }}</p>
      </section>

      <section>
        <h2>{{ $t('page-index-blog-heading') }}</h2>
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
            <h2 class="post-item-title">
              {{ postContent.title[$i18n.locale] }}
            </h2>
          </NuxtLink>
          <li v-if="!postContentList.length">
            {{ $t('page-index-blog-none') }}
          </li>
        </ul>
        <NuxtLink :to="localePath('/blog/page/1')">{{
          $t('page-index-blog-more')
        }}</NuxtLink>
      </section>
    </div>
  </div>
</template>

<script>
import { VueAgile } from 'vue-agile'
import { getSiteDataContent } from '~/model/content/site-data.ts'
import {
  getAllPartialPageContents,
  getPageContent
} from '~/model/content/pages.ts'
import {
  convertIsoToDotSeparatedYmd,
  capitalize,
  createHead,
  filterWithIdPrefix,
  sortById
} from '~/utilities/index.ts'

export default {
  components: {
    VueAgile
  },

  async asyncData({ app, route }) {
    // For global
    const allPartialPageContents = await getAllPartialPageContents()

    // For page
    const siteDataContent = await getSiteDataContent()
    const routeName = app.getRouteBaseName()
    const pageContent = await getPageContent(routeName)
    const { postContentList } = await import(
      /* webpackChunkName: "[request]" */
      `~/assets/json/payloads/${route.name}.json`
    )

    return {
      siteDataContent,
      allPartialPageContents,
      pageContent,
      postContentList
    }
  },

  computed: {
    sliderImageList() {
      const list = this.pageContent.images
      const idPrefix = 'page-index-slider-'
      return sortById(filterWithIdPrefix(list, idPrefix))
    }
  },

  created() {
    // Assign value to global
    this.$navState.allPartialPageContents = this.allPartialPageContents
  },

  methods: {
    convertIsoToDotSeparatedYmd,
    capitalize
  },

  head() {
    return createHead(
      this.$t('site-data-title'),
      this.$t('site-data-description'),
      this.siteDataContent.ogImage.value.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style lang="scss" scoped>
.slider-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.slider-item-text {
  font-size: 30px;
  font-weight: bold;
  color: #fff;
}
.body {
  width: 764px;
  margin: 0 auto;
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
