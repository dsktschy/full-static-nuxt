<template>
  <footer class="the-footer">
    <NuxtLink to="/" class="title">
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
