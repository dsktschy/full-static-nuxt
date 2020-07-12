import { NuxtVueI18n } from 'nuxt-i18n'

export const DEFAULT_API_GET_REQUEST_TIMEOUT = 0

export const DEFAULT_API_GET_REQUEST_DEPTH = 1

export const DEFAULT_API_GET_REQUEST_LIMIT = 10

export const MAX_API_GET_REQUEST_LIMIT = 100

export const TOTAL_POSTS_PER_PAGE = 10

export const LOCALE_CODE_LIST = ['ja', 'en'] as const

export const LOCALES: readonly NuxtVueI18n.Options.LocaleObject[] = LOCALE_CODE_LIST.map(
  (LOCALE_CODE) => ({
    code: LOCALE_CODE,
    file: `${LOCALE_CODE}.json`
  })
)

export const DEFAULT_LOCALE = 'ja'

export const LANG_DIR = 'assets/json/languages/'
