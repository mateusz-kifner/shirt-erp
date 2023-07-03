import { UserType } from "./UserType"

export interface LoginType {
  jwt: string
  user: UserType | null
  debug: boolean
  navigationCollapsed?: boolean
}
