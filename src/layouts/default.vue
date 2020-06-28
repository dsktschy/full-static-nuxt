<template>
  <div>
    <!--
    When accessed page that doesn't exist as first page,
    $global has no value, because payload.js doesn't exist too
    -->
    <TheHeader v-if="!$global.showingError" :title-tag="headerTag" />
    <nuxt />
    <TheFooter v-if="!$global.showingError" />
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
