<template>
  <div class="base-pager">
    <button
      :disabled="isMinIndex"
      class="prev"
      @click="$emit('click-prev', { index: prevIndex })"
    >
      Prev
    </button>
    <div class="current">
      <div class="numerator">{{ currentIndex }}</div>
      <div class="slash">/</div>
      <div class="denominator">{{ maxIndex }}</div>
    </div>
    <button
      :disabled="isMaxIndex"
      class="next"
      @click="$emit('click-next', { index: nextIndex })"
    >
      Next
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
    isMinIndex() {
      return this.currentIndex === 1
    },
    isMaxIndex() {
      return this.currentIndex === this.maxIndex
    }
  }
}
</script>

<style scoped>
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
