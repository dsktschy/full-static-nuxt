<template>
  <div>
    <client-only placeholder="Loading...">
      <VueAgile autoplay class="slider">
        <div
          v-for="(sliderImage, i) of sliderImageList"
          :key="sliderImage.id"
          :style="{
            'background-image': `url(${sliderImage.values[0].image.url})`
          }"
          class="slider-item"
        >
          <p class="slider-item-text">
            {{ sliderTextList[i].values[0].ja_jp }}
          </p>
        </div>
      </VueAgile>
    </client-only>

    <section>
      <h2>
        <span>私たちの思い</span>
        <span>About us</span>
      </h2>
      <p>{{ thoughtText.values[0].ja_jp }}</p>
    </section>

    <section>
      <h2>
        <span>ブログ</span>
        <span>Blog</span>
      </h2>
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
            {{ postContent.category.name.ja_jp }}
          </div>
          <h2 class="post-item-title">{{ postContent.title.ja_jp }}</h2>
        </NuxtLink>
        <li v-if="!postContentList.length">No content</li>
      </ul>
      <NuxtLink to="/blog/page/1">More</NuxtLink>
    </section>
  </div>
</template>

<script>
import { VueAgile } from 'vue-agile'
import { getPageContent } from '~/assets/js/pages-fetcher'
import { getPostContentList } from '~/assets/js/posts-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { convertIsoToDotSeparatedYmd } from '~/assets/js/utility'

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
    thoughtText() {
      const id = 'index-thought'
      return this.pageContent.texts.find((text) => text.id === id) || ''
    },
    sliderImageList() {
      const id = 'index-slider-'
      return this.pageContent.images.filter((image) => image.id.startsWith(id))
    },
    sliderTextList() {
      const id = 'index-slider-'
      return this.pageContent.texts.filter((text) => text.id.startsWith(id))
    }
  },

  methods: {
    convertIsoToDotSeparatedYmd
  },

  head() {
    return createHead(
      this.$siteDataContent.title.ja_jp,
      this.$siteDataContent.description.ja_jp,
      this.$siteDataContent.ogImage.url,
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
