/**
 * Convert createdAt string to dot-separated ymd
 */
export function convertCreatedAtToShow(createdAt) {
  return createdAt.slice(0, 10).replace(/-/g, '.')
}
