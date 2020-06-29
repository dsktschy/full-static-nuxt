<template>
  <header class="the-header">
    <NuxtLink :tag="titleTag" :to="localePath('/')" class="title">
      {{ $t('site-data-title') }}
    </NuxtLink>

    <ul v-if="showingNav" class="nav">
      <li class="nav-item">
        <NuxtLink :to="localePath(aboutPageContent.path)">
          {{ $t(aboutPageContent.title.id) }}
        </NuxtLink>
        <ul>
          <NuxtLink
            v-for="aboutLowerPageContent of aboutLowerPageContentList"
            :key="aboutLowerPageContent.id"
            :to="localePath(aboutLowerPageContent.path)"
            tag="li"
            class="nav-lower-item"
          >
            {{ $t(aboutLowerPageContent.title.id) }}
          </NuxtLink>
        </ul>
      </li>
      <li class="nav-item">
        <NuxtLink :to="localePath(blogPageContent.path)">
          {{ $t(blogPageContent.title.id) }}
        </NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink :to="localePath(contactPageContent.path)">
          {{ $t(contactPageContent.title.id) }}
        </NuxtLink>
      </li>
    </ul>

    <ul class="language">
      <NuxtLink
        v-for="locale of $i18n.locales"
        :key="locale.code"
        :to="createLanguageLink(locale.code)"
        tag="li"
        class="language-item"
      >
        {{ locale.code }}
      </NuxtLink>
    </ul>
  </header>
</template>

<script>
export default {
  props: {
    titleTag: { type: String, default: 'div' }
  },

  computed: {
    showingNav() {
      return (
        this.aboutPageContent != null &&
        this.blogPageContent != null &&
        this.contactPageContent != null
      )
    },

    aboutPageContent() {
      return this.$global.allPageContentsForNav.find(
        (pageContent) => pageContent.path === '/about'
      )
    },

    blogPageContent(state) {
      return this.$global.allPageContentsForNav.find(
        (pageContent) => pageContent.path === '/blog'
      )
    },

    contactPageContent(state) {
      return this.$global.allPageContentsForNav.find(
        (pageContent) => pageContent.path === '/contact'
      )
    },

    aboutLowerPageContentList(state) {
      return this.$global.allPageContentsForNav.filter((pageContent) =>
        pageContent.path.startsWith('/about/')
      )
    }
  },

  methods: {
    createLanguageLink(localeCode) {
      return localeCode === this.$i18n.locale
        ? this.$route.path
        : localeCode === this.$i18n.defaultLocale
        ? '/'
        : `/${localeCode}`
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
.language {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 7%;
}
.language-item {
  cursor: pointer;
}
</style>
