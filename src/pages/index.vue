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
            {{ sliderTextList[i].value.ja }}
          </p>
        </div>
      </VueAgile>
    </client-only>

    <section>
      <h2>{{ aboutHeadingText.value.ja }}</h2>
      <p>{{ aboutBodyText.value.ja }}</p>
    </section>

    <section>
      <h2>{{ blogHeadingText.value.ja }}</h2>
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
        <li v-if="!postContentList.length">{{ blogNoneText.value.ja }}</li>
      </ul>
      <NuxtLink to="/blog/page/1">{{ blogMoreText.value.ja }}</NuxtLink>
    </section>
  </div>
</template>

<script>
import { VueAgile } from 'vue-agile'
import { getPageContent } from '~/assets/js/pages-fetcher'
import { getPostContentList } from '~/assets/js/posts-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { convertIsoToDotSeparatedYmd } from '~/assets/js/common-utility'

export default {
  components: {
    VueAgile
  },

  async asyncData({ route }) {
    return {
      pageContent: await getPageContent(route.name),
      postContentList: await getPostContentList()
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
    },
    sliderTextList() {
      const prefix = 'page-index-slider-'
      const sliderTextList = this.pageContent.plainText.filter((text) =>
        text.id.startsWith(prefix)
      )
      const sortedSliderTextList = []
      for (let i = 0; i < sliderTextList.length; i++) {
        const id = `${prefix}${i + 1}`
        sortedSliderTextList[i] = sliderTextList.find((text) => text.id === id)
      }
      return sortedSliderTextList
    },
    aboutHeadingText() {
      const id = 'page-index-about-heading'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    aboutBodyText() {
      const id = 'page-index-about-body'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    blogHeadingText() {
      const id = 'page-index-blog-heading'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    blogNoneText() {
      const id = 'page-index-blog-none'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    blogMoreText() {
      const id = 'page-index-blog-more'
      return this.pageContent.plainText.find((text) => text.id === id)
    }
  },

  methods: {
    convertIsoToDotSeparatedYmd
  },

  head() {
    return createHead(
      this.$siteDataContent.title.value.ja,
      this.$siteDataContent.description.value.ja,
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
