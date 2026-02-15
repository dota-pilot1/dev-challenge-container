import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthResponse } from "./model";

interface AuthUser {
  id: number;
  email: string;
  nickname: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (response: AuthResponse) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "devquest_auth";

function loadFromStorage(): { user: AuthUser; token: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => loadFromStorage());

  const login = useCallback((response: AuthResponse) => {
    const data = {
      user: {
        id: response.id,
        email: response.email,
        nickname: response.nickname,
      },
      token: response.token,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setState(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state?.user ?? null,
        token: state?.token ?? null,
        login,
        logout,
        isLoggedIn: !!state?.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
