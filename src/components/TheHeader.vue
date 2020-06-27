<template>
  <header class="the-header">
    <NuxtLink :tag="titleTag" :to="localePath('/')" class="title">
      {{ $t('site-data-title') }}
    </NuxtLink>

    <ul class="nav">
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
        :to="switchLocalePath(locale.code)"
        tag="li"
        class="language-item"
      >
        {{ locale.code }}
      </NuxtLink>
    </ul>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    titleTag: { type: String, default: 'div' }
  },

  computed: {
    ...mapGetters([
      'aboutPageContent',
      'blogPageContent',
      'contactPageContent',
      'aboutLowerPageContentList'
    ])
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
