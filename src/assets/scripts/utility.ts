/**
 * Pad with zero
 */
export function padWithZero(target: number, length: number) {
  return `${target}`.padStart(length, '0')
}

/**
 * Convert from ISO to YYYY.MM.DD
 */
export function convertIsoToDotSeparatedYmd(iso: string) {
  return iso.slice(0, 10).replace(/-/g, '.')
}

/**
 * Capitalize
 */
export function capitalize(target: string) {
  if (!target) return target
  return target.charAt(0).toUpperCase() + target.slice(1)
}
