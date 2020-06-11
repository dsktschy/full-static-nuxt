<template>
  <ul class="the-nav">
    <NuxtLink to="/" tag="li" class="item">Index</NuxtLink>
    <NuxtLink to="/about" tag="li" class="item">About</NuxtLink>
    <NuxtLink to="/blog" tag="li" class="item">Blog</NuxtLink>
    <NuxtLink to="/contact" tag="li" class="item">Contact</NuxtLink>
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
