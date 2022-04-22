export interface StrapiResponse {
  data: any[] | object | any | null
  meta: {
    pagination?: {
      page?: number
      pageSize?: number
      pageCount?: number
      total?: number
    }
  }
}
