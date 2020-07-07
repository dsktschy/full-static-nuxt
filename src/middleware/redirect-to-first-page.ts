import { Middleware } from '@nuxt/types'

const redirectToFirstPage: Middleware = ({ route, redirect }) => {
  const path = route.path.replace(/\/$/, '')
  redirect(301, `${path}/page/1`)
}

export default redirectToFirstPage
