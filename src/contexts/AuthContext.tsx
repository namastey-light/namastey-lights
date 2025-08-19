import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate unique tab ID for this session
    const tabId = generateTabId();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Store session with tab-specific key
          sessionStorage.setItem(`admin_session_${tabId}`, 'true');
          sessionStorage.setItem('current_tab_id', tabId);
          
          setSession(session);
          setUser(session?.user ?? null);
          
          // Check if user is admin
          setTimeout(async () => {
            const { data } = await supabase
              .from("profiles")
              .select("is_admin")
              .eq("user_id", session.user.id)
              .single();
            setIsAdmin(!!data?.is_admin);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          // Clear all session data
          clearAllSessions();
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        } else {
          // For existing sessions, check if it's valid for this tab
          if (session) {
            const isValidSession = validateTabSession(tabId);
            if (!isValidSession) {
              // Invalid session for this tab, sign out
              await supabase.auth.signOut();
              return;
            }
            
            setSession(session);
            setUser(session?.user ?? null);
            
            setTimeout(async () => {
              const { data } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("user_id", session.user.id)
                .single();
              setIsAdmin(!!data?.is_admin);
            }, 0);
          } else {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
          }
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const isValidSession = validateTabSession(tabId);
        if (!isValidSession) {
          // Sign out if session is not valid for this tab
          supabase.auth.signOut();
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Generate unique tab ID
  const generateTabId = () => {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Validate if session is valid for current tab
  const validateTabSession = (currentTabId: string) => {
    const storedTabId = sessionStorage.getItem('current_tab_id');
    const adminSession = sessionStorage.getItem(`admin_session_${currentTabId}`);
    
    // Only valid if this tab initiated the session
    return storedTabId === currentTabId && adminSession === 'true';
  };

  // Clear all session data
  const clearAllSessions = () => {
    // Clear all sessionStorage keys related to admin
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('admin_session_') || key === 'current_tab_id') {
        sessionStorage.removeItem(key);
      }
    });
    
    // Also clear localStorage for extra security
    localStorage.clear();
  };

  const signIn = async (email: string, password: string) => {
    // Clear any existing sessions first
    clearAllSessions();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    clearAllSessions();
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signIn,
    signOut,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}