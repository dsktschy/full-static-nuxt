<template>
  <div>
    <h1 v-if="error.statusCode === 404">{{ $t('error-404-title') }}</h1>
    <h1 v-else>{{ $t('error-default-title') }}</h1>
  </div>
</template>

<script>
export default {
  props: { error: { type: Object, required: true } }
}
</script>
