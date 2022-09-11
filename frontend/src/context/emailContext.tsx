import { createContext, useState, ReactNode, useContext } from "react"

interface EmailContextType {
  emailMessageHtmlAllowed: number[]
  emailMessageEnableHtml: (id: number) => void
  emailMessageDisableHtml: (id: number) => void
  emailMessageDisableAll: () => void
}

export const EmailContext = createContext<EmailContextType | null>(null)

export const EmailProvider = ({ children }: { children: ReactNode }) => {
  const [emailMessageHtmlAllowed, setEmailMessage] = useState<number[]>([])

  return (
    <EmailContext.Provider
      value={{
        emailMessageHtmlAllowed,
        emailMessageEnableHtml(id) {
          setEmailMessage((val) => [...val, id])
        },
        emailMessageDisableHtml(id) {
          setEmailMessage((val) => val.filter((val) => val != id))
        },
        emailMessageDisableAll() {
          setEmailMessage([])
        },
      }}
    >
      {children}
    </EmailContext.Provider>
  )
}

export function useEmailContext(): EmailContextType {
  const state = useContext(EmailContext)
  if (!state) {
    throw new Error(
      `ERROR: Email reached logged-in-only component with null state`
    )
  }
  return state as EmailContextType
}
