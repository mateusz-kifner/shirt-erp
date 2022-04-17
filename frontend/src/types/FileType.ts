export interface FileType {
  name: string
  alternativeText: string
  caption: string
  width: number | null
  height: number | null
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
  } | null
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: any
  createdAt: string
  updatedAt: string
  related: any[]
}

// "id": 29,
//         "name": "Let It Fall-186411540.mp3",
//         "alternativeText": "",
//         "caption": "",
//         "width": null,
//         "height": null,
//         "formats": null,
//         "hash": "Let_It_Fall_186411540_0786b899b2",
//         "ext": ".mp3",
//         "mime": "audio/mpeg",
//         "size": 2668.25,
//         "url": "/uploads/Let_It_Fall_186411540_0786b899b2.mp3",
//         "previewUrl": null,
//         "provider": "local",
//         "provider_metadata": null,
//         "createdAt": "2021-11-08T12:07:25.153Z",
//         "updatedAt": "2021-11-08T12:07:25.204Z",
//         "related": []
