export interface ImageType {
  id: number
  name: string
  alternativeText: string
  caption: string
  width: number
  height: number
  formats: {
    thumbnail: {
      ext: string
      url: string
      hash: string
      mime: string
      name: string
      path: null
      size: number
      width: number
      height: number
    }
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: null
  createdAt: Date
  updatedAt: Date
}
