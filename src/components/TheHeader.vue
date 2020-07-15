<template>
  <header class="the-header">
    <NuxtLink :tag="titleTag" :to="localePath('/')" class="title">
      {{ $t('site-data-title') }}
    </NuxtLink>

    <ul
      v-if="$navState.firstLowerLevelPartialPageContentListExisting"
      class="nav"
    >
      <li class="nav-item">
        <NuxtLink :to="localePath($navState.aboutPartialPageContent.path)">
          {{ $t($navState.aboutPartialPageContent.title.id) }}
        </NuxtLink>
        <ul>
          <NuxtLink
            v-for="partialPageContent of $navState.aboutSecondLowerLevelPartialPageContentList"
            :key="partialPageContent.id"
            :to="localePath(partialPageContent.path)"
            tag="li"
            class="nav-lower-item"
          >
            {{ $t(partialPageContent.title.id) }}
          </NuxtLink>
        </ul>
      </li>
      <li class="nav-item">
        <NuxtLink :to="localePath($navState.blogPartialPageContent.path)">
          {{ $t($navState.blogPartialPageContent.title.id) }}
        </NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink :to="localePath($navState.contactPartialPageContent.path)">
          {{ $t($navState.contactPartialPageContent.title.id) }}
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
