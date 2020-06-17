<template>
  <div>
    <h1 class="title">{{ pageContent.title.ja_jp }}</h1>
    <client-only placeholder="Loading...">
      <VueAgile autoplay class="slider">
        <div
          v-for="(item, index) of pageContent.images"
          :key="item.id"
          :style="{ 'background-image': `url(${item.value.url})` }"
          class="slide"
        >
          <p class="slide-text">{{ pageContent.texts[index].value.ja_jp }}</p>
        </div>
      </VueAgile>
    </client-only>
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
    <NuxtLink to="/blog/page/1">More</NuxtLink>
  </div>
</template>

<script>
import { VueAgile } from 'vue-agile'
import { getPageContent } from '~/assets/js/pages-fetcher'
import { getPostContentList } from '~/assets/js/posts-fetcher'
import { createHead } from '~/assets/js/head-creator'

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
.slide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.slide-text {
  font-size: 30px;
  font-weight: bold;
  color: gray;
}
.post-item {
  cursor: pointer;
}
</style>
