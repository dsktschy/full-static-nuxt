<template>
  <footer class="the-footer">
    <NuxtLink :to="localePath('/')" class="title">
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

    <ul class="sns">
      <a
        href="https://www.facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
        tag="li"
        class="sns-item"
        >F</a
      >
      <a
        href="https://twitter.com/"
        target="_blank"
        rel="noopener noreferrer"
        tag="li"
        class="sns-item"
        >T</a
      >
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        tag="li"
        class="sns-item"
        >I</a
      >
    </ul>
  </footer>
</template>

<script>
export default {
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
  }
}
</script>

<style lang="scss" scoped>
.the-footer {
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
.sns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 7%;
}
.sns-item {
  cursor: pointer;
}
</style>
