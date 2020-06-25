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
              {{ $t(postContent.category.name.id) }}
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
import { getPageContent } from '~/assets/js/pages-fetcher'
import { getPostContentList } from '~/assets/js/posts-fetcher'
import { createHead } from '~/assets/js/head-creator'
import {
  createPageMessage,
  createPostsMessage
} from '~/assets/js/message-creator'
import { convertIsoToDotSeparatedYmd } from '~/assets/js/common-utility'

export default {
  components: {
    VueAgile
  },

  async asyncData({ app, route }) {
    const routeName = app.getRouteBaseName()
    const pageContent = await getPageContent(routeName)
    const options = { fields: 'id,createdAt,title,category' }
    const postContentList = await getPostContentList(options)
    const messages = {}
    for (const locale of app.i18n.locales) {
      messages[locale.code] = {
        ...createPageMessage(locale.code, pageContent),
        ...createPostsMessage(locale.code, postContentList)
      }
    }
    return {
      pageContent,
      postContentList,
      messages
    }
  },

  computed: {
    sliderImageList() {
      const prefix = 'page-index-slider-'
      const sliderImageList = this.pageContent.images.filter((image) =>
        image.id.startsWith(prefix)
      )
      const sortedSliderImageList = []
      for (let i = 0; i < sliderImageList.length; i++) {
        const id = `${prefix}${i + 1}`
        sortedSliderImageList[i] = sliderImageList.find(
          (image) => image.id === id
        )
      }
      return sortedSliderImageList
    }
  },

  created() {
    // Running in fetch causes error in template
    // Because message ($t) has no fields until running mergeLocaleMessage
    for (const locale of this.$i18n.locales) {
      this.$i18n.mergeLocaleMessage(locale.code, this.messages[locale.code])
    }
  },

  methods: {
    convertIsoToDotSeparatedYmd
  },

  head() {
    return createHead(
      this.$t('site-data-title'),
      this.$t('site-data-description'),
      this.$siteDataContent.ogImage.value.url,
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
