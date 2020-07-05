export const localeCodes = ['ja', 'en']

export const locales = localeCodes.map((localeCode) => ({
  code: localeCode,
  file: `${localeCode}.json`
}))

export const defaultLocale = 'ja'

export const langDir = 'assets/json/languages/'
