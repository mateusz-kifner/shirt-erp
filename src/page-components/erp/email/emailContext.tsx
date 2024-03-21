import type { EmailCredential } from "@/server/api/email/validator";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface EmailContextType {
  emailConfig: EmailCredential;
  setEmailConfig: Dispatch<SetStateAction<EmailCredential>>;
}

export const EmailContext = createContext<EmailContextType | null>(null);

export const EmailContextProvider = ({
  children,
  emailConfig: initialEmailConfig,
}: {
  children: ReactNode;
  emailConfig: EmailCredential;
}) => {
  const [emailConfig, setEmailConfig] =
    useState<EmailCredential>(initialEmailConfig);

  return (
    <EmailContext.Provider
      value={{
        emailConfig,
        setEmailConfig,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export function useEmailContext(): EmailContextType {
  const state = useContext(EmailContext);
  if (!state) {
    throw new Error("ERROR: Cannot use emailContext outside of emailClient");
  }
  return state;
}
