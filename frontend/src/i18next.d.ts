import { resources, defaultNS } from "./i18n"
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: any
    resources: any
  }
}
