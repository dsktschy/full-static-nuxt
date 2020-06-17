<template>
  <header class="the-header">
    <NuxtLink :tag="titleTag" to="/" class="title">株式会社 FSS</NuxtLink>

    <ul class="nav">
      <NuxtLink to="/business" tag="li" class="nav-item">事業紹介</NuxtLink>
      <NuxtLink to="/about" tag="li" class="nav-item">会社紹介</NuxtLink>
      <NuxtLink to="/blog" tag="li" class="nav-item">ブログ</NuxtLink>
      <NuxtLink to="/contact" tag="li" class="nav-item">お問い合わせ</NuxtLink>
    </ul>
  </header>
</template>

<script>
export default {
  props: {
    titleTag: { type: String, default: 'div' }
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
.nav-item {
  cursor: pointer;
}
</style>
