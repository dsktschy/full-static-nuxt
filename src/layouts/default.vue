<template>
  <div>
    <TheHeader :title-tag="headerTag" />
    <nuxt />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '~/components/TheHeader'
import TheFooter from '~/components/TheFooter'

export default {
  components: {
    TheHeader,
    TheFooter
  },

  computed: {
    headerTag() {
      return this.$route.path === '/' ? 'h1' : 'div'
    }
  }
}
</script>
