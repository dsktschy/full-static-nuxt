<script>
export default {
  asyncData({ redirect, params }) {
    const categoryId = params.id
    redirect(301, `/blog/category/${categoryId}/page/1`)
    return {}
  }
}
</script>
