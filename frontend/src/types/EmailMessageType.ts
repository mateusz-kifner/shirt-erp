import { FileType } from "./FileType"

// FIXME: improve this

export interface EmailMessageType {
  id: number
  subject: string
  from: string
  to: string
  date: string
  html: string
  text: string
  messageId: string
  headerLines: string
  textAsHtml: string
  attachments: FileType[]
  nextMessageId: number
  orders: any
}
