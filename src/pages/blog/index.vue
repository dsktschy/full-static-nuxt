<script>
export default {
  asyncData({ app, redirect }) {
    redirect(301, app.localePath('/blog/page/1'))
    return {}
  }
}
</script>
