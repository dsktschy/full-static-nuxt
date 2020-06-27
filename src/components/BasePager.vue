<template>
  <div class="base-pager">
    <button
      :disabled="prevDisabled"
      class="prev"
      @click="$emit('click-prev', { index: prevIndex })"
    >
      {{ $t('page-blog-previous') }}
    </button>
    <div class="current">
      <div class="numerator">{{ currentIndex }}</div>
      <div class="slash">/</div>
      <div class="denominator">{{ maxIndex }}</div>
    </div>
    <button
      :disabled="nextDisabled"
      class="next"
      @click="$emit('click-next', { index: nextIndex })"
    >
      {{ $t('page-blog-next') }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentIndex: { type: Number, required: true },
    maxIndex: { type: Number, required: true }
  },

  computed: {
    prevIndex() {
      return this.currentIndex - 1
    },

    nextIndex() {
      return this.currentIndex + 1
    },

    prevDisabled() {
      return this.currentIndex <= 1 || this.maxIndex === 0
    },

    nextDisabled() {
      return this.currentIndex >= this.maxIndex || this.maxIndex === 0
    }
  }
}
</script>

<style lang="scss" scoped>
.base-pager {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.current {
  display: flex;
  align-items: center;
}
.numerator {
  margin: 0 4px;
}
.slash {
  margin: 0 4px;
}
.denominator {
  margin: 0 4px;
}
</style>
