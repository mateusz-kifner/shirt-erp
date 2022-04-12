export interface StrapiResponse {
  data: StrapiGeneric[]
  meta: {
    pagination?: {
      page?: number
      pageSize?: number
      pageCount?: number
      total?: number
    }
  }
}

export interface StrapiGeneric {
  id: number
  attributes: object
}
