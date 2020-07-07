<template>
  <div>
    <TheHeader :title-tag="headerTag" />
    <nuxt />
    <TheFooter />
  </div>
</template>

<script>
export default {
  computed: {
    headerTag() {
      return this.$route.path === '/' ? 'h1' : 'div'
    }
  }
}
</script>
