<template>
  <footer class="the-footer">
    <NuxtLink to="/" class="title">株式会社 FSS</NuxtLink>

    <ul class="nav">
      <NuxtLink to="/business" tag="li" class="nav-item">事業紹介</NuxtLink>
      <NuxtLink to="/about" tag="li" class="nav-item">会社紹介</NuxtLink>
      <NuxtLink to="/blog" tag="li" class="nav-item">ブログ</NuxtLink>
      <NuxtLink to="/contact" tag="li" class="nav-item">お問い合わせ</NuxtLink>
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
.nav-item {
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
