"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "@prisma/client";

// Định nghĩa kiểu cho Context
interface SessionContextType {
  user: User | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session: User | null;
}) => {
  return (
    <SessionContext.Provider value={{ user: session }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
