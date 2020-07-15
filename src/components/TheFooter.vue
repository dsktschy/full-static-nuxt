<template>
  <footer class="the-footer">
    <NuxtLink :to="localePath('/')" class="title">
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
