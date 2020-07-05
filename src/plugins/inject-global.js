import Vue from 'vue'

export default (context, inject) => {
  const global = Vue.observable({
    allPageContentsForNav: []
  })

  inject('global', global)
}
