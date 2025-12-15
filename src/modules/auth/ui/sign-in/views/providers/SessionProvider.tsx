"use client";

import { createContext, useContext, ReactNode } from "react";

// Định nghĩa kiểu cho Session User (không phải full Prisma User)
type SessionUser = {
  id: string;
  username: string;
  email: string;
  image?: string | null;
  role: "USER" | "VENDOR" | "ADMIN";
} | null;

// Định nghĩa kiểu cho Context
interface SessionContextType {
  user: SessionUser;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session: SessionUser;
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
