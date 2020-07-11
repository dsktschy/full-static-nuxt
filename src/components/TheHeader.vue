<template>
  <header class="the-header">
    <NuxtLink :tag="titleTag" :to="localePath('/')" class="title">
      {{ $t('site-data-title') }}
    </NuxtLink>

    <ul v-if="$pageContentsForNav.firstLowerLevelExisting" class="nav">
      <li class="nav-item">
        <NuxtLink :to="localePath($pageContentsForNav.about.path)">
          {{ $t($pageContentsForNav.about.title.id) }}
        </NuxtLink>
        <ul>
          <NuxtLink
            v-for="aboutLowerPageContent of $pageContentsForNav.aboutSecondLowerLevel"
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
        <NuxtLink :to="localePath($pageContentsForNav.blog.path)">
          {{ $t($pageContentsForNav.blog.title.id) }}
        </NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink :to="localePath($pageContentsForNav.contact.path)">
          {{ $t($pageContentsForNav.contact.title.id) }}
        </NuxtLink>
      </li>
    </ul>

    <ul class="language">
      <NuxtLink
        v-for="locale of $i18n.locales"
        :key="locale.code"
        :to="createLanguageItemTo(locale.code)"
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

  methods: {
    createLanguageItemTo(localeCode) {
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
