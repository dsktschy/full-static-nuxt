/**
 * ゼロ埋め
 */
export function padWithZero(number, length) {
  const string = `${number}`
  return string.padStart(length, '0')
}
