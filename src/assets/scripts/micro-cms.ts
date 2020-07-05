/**
 * Query for GET request
 */
export interface MicroCmsQuery {
  fields?: string
  offset?: number
  limit?: number
  filters?: string
  depth?: number
}

/**
 * Response of list style API
 */
export interface MicroCmsListResponse<T> {
  contents: T[]
  totalCount: number
  offset: number
  limit: number
}
