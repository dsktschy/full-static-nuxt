/**
 * Pad with zero
 */
export function padWithZero(number, length) {
  const string = `${number}`
  return string.padStart(length, '0')
}

/**
 * Convert from ISO to YYYY.MM.DD
 */
export function convertIsoToDotSeparatedYmd(iso) {
  return iso.slice(0, 10).replace(/-/g, '.')
}

/**
 * Capitalize
 */
export function capitalize(string) {
  if (!string) return string
  return string.charAt(0).toUpperCase() + string.slice(1)
}
