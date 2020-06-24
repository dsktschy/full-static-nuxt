export default ({ route, redirect }) => {
  const path = route.path.replace(/\/$/, '')
  redirect(301, `${path}/page/1`)
}
