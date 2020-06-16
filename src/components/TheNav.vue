<template>
  <ul class="the-nav">
    <NuxtLink to="/business" tag="li" class="item">事業紹介</NuxtLink>
    <NuxtLink to="/about" tag="li" class="item">会社紹介</NuxtLink>
    <NuxtLink to="/blog" tag="li" class="item">ブログ</NuxtLink>
    <NuxtLink to="/contact" tag="li" class="item">お問い合わせ</NuxtLink>
  </ul>
</template>

<style scoped>
.the-nav {
  display: flex;
}
.item {
  margin-right: 30px;
  cursor: pointer;
}
</style>
