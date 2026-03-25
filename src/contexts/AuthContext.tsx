import { createContext, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';

interface AuthContextValue {
  clerkEnabled: boolean;
  isSignedIn: boolean;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue>({
  clerkEnabled: false,
  isSignedIn: false,
  getToken: async () => null,
});

/** Reads from Clerk and forwards values into AuthContext. Mount inside <ClerkProvider>. */
export function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { isSignedIn, getToken } = useAuth();
  return (
    <AuthContext.Provider value={{
      clerkEnabled: true,
      isSignedIn: !!isSignedIn,
      getToken: getToken ?? (async () => null),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Safe auth hook — returns clerkEnabled=false / isSignedIn=false when Clerk is not configured. */
export function useAppAuth(): AuthContextValue {
  return useContext(AuthContext);
}
