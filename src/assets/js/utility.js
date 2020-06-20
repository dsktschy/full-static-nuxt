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
export function convertIsoToDotSeparatedYmd(createdAt) {
  return createdAt.slice(0, 10).replace(/-/g, '.')
}
