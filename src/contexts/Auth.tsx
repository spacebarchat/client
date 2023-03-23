import React from "react";

interface AuthContextType {
  user: any;
  login: () => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);

  let login = () => {
    setUser("test");
  };

  let logout = () => {
    setUser(null);
  };

  let value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
