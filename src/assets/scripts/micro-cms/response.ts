/**
 * Response of list style API
 */
export interface MicroCmsListResponse<T> {
  contents: T[]
  totalCount: number
  offset: number
  limit: number
}
