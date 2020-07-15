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
