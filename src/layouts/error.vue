<template>
  <div>
    <h1 v-if="error.statusCode === 404">{{ $t('error-404-title') }}</h1>
    <h1 v-else>{{ $t('error-default-title') }}</h1>

    <NuxtLink :to="localePath('/')">{{ $t('error-back') }}</NuxtLink>
  </div>
</template>

<script>
export default {
  // nuxt@<=2.13.2 has bug that apply incorrect layout to page accessed after error page
  // So, until A is resolved, default layout should be used in all pages

  props: { error: { type: Object, required: true } },

  // Maybe official `isError` does not exist
  beforeCreate() {
    this.$global.showingError = true
  },

  destroyed() {
    this.$global.showingError = false
  }
}
</script>
