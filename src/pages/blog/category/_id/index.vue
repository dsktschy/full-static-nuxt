<script>
export default {
  asyncData({ app, redirect, params }) {
    const categoryId = params.id
    redirect(301, app.localePath(`/blog/category/${categoryId}/page/1`))
    return {}
  }
}
</script>
