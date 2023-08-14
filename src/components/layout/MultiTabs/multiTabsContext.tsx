import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { EmailCredentialType } from "@/schema/emailCredential";

interface EmailContextType {
  emailConfig: EmailCredentialType;
  setEmailConfig: Dispatch<SetStateAction<EmailCredentialType>>;
}

export const EmailContext = createContext<EmailContextType | null>(null);

export const EmailContextProvider = ({
  children,
  emailConfig: initialEmailConfig,
}: {
  children: ReactNode;
  emailConfig: EmailCredentialType;
}) => {
  const [emailConfig, setEmailConfig] =
    useState<EmailCredentialType>(initialEmailConfig);

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
    throw new Error(`ERROR: Cannot use emailContext outside of emailClient`);
  }
  return state;
}