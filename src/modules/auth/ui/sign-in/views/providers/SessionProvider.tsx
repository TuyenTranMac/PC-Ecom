"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "@/payload-types";

// Định nghĩa kiểu cho Context
interface SessionContextType {
  user: User | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: User | null;
}) {
  return (
    <SessionContext.Provider value={{ user: session }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
