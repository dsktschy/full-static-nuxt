<template>
  <div>
    <h1 v-if="error.statusCode === 404">{{ $t('error-404-title') }}</h1>
    <h1 v-else>{{ $t('error-default-title') }}</h1>

    <NuxtLink :to="localePath('/')">{{ $t('error-back') }}</NuxtLink>
  </div>
</template>

<script>
export default {
  // Default layout can't be used
  // Because when accessed page that doesn't exist as first page,
  // $global has no value, because payload.js doesn't exist too
  layout: 'empty',

  props: { error: { type: Object, required: true } }
}
</script>
