<template>
  <header class="the-header">
    <NuxtLink :tag="titleTag" to="/" class="title">
      {{ $siteDataContent.title.value.ja }}
    </NuxtLink>

    <ul class="nav">
      <li class="nav-item">
        <NuxtLink :to="aboutPageContent.path">
          {{ aboutPageContent.title.value.ja }}
        </NuxtLink>
        <ul>
          <NuxtLink
            v-for="aboutLowerPageContent of aboutLowerPageContentList"
            :key="aboutLowerPageContent.id"
            :to="aboutLowerPageContent.path"
            tag="li"
            class="nav-lower-item"
          >
            {{ aboutLowerPageContent.title.value.ja }}
          </NuxtLink>
        </ul>
      </li>
      <li class="nav-item">
        <NuxtLink :to="blogPageContent.path">
          {{ blogPageContent.title.value.ja }}
        </NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink :to="contactPageContent.path">
          {{ contactPageContent.title.value.ja }}
        </NuxtLink>
      </li>
    </ul>
  </header>
</template>

<script>
export default {
  props: {
    titleTag: { type: String, default: 'div' }
  },

  computed: {
    aboutPageContent() {
      return this.$allPageContentsForNav.find(
        (pageContent) => pageContent.path === '/about'
      )
    },
    aboutLowerPageContentList() {
      return this.$allPageContentsForNav.filter((pageContent) =>
        pageContent.path.startsWith('/about/')
      )
    },
    blogPageContent() {
      return this.$allPageContentsForNav.find(
        (pageContent) => pageContent.path === '/blog'
      )
    },
    contactPageContent() {
      return this.$allPageContentsForNav.find(
        (pageContent) => pageContent.path === '/contact'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.the-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  cursor: pointer;
}
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
}
.nav-lower-item {
  cursor: pointer;
}
</style>
