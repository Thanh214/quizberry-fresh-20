
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Session, AuthError, User } from "@supabase/supabase-js";
import { AuthResult } from "./types";

/**
 * Hook for managing user authentication
 */
export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get current session
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    
    getInitialSession();

    // Monitor auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // Check if this is an email (contains @)
      if (!email.includes('@')) {
        toast.error('Vui lòng nhập địa chỉ email hợp lệ');
        throw new Error('Email không hợp lệ');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Better error handling for common cases
        if (error.message.includes('not confirmed')) {
          throw new Error('Email not confirmed. Please check your inbox for verification email.');
        }
        throw error;
      }
      
      return { data, error: null };
    } catch (err: any) {
      setError(err);
      console.error("Login error:", err.message);
      // Pass the error back with the original message intact
      return { data: { user: null, session: null }, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // Check if email is valid
      if (!email.includes('@')) {
        toast.error('Vui lòng nhập địa chỉ email hợp lệ');
        throw new Error('Email không hợp lệ');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata?.data,
          emailRedirectTo: window.location.origin + '/auth/callback'
        },
      });
      
      if (error) throw error;
      
      // Check if the email needs confirmation
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        toast.error('Email đã được đăng ký trước đó, vui lòng đăng nhập');
        throw new Error('Email đã được đăng ký');
      } else if (data?.user && !data.session) {
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực.");
      } else {
        toast.success("Đăng ký thành công!");
      }
      
      return { data, error: null };
    } catch (err: any) {
      setError(err);
      toast.error(`Lỗi đăng ký: ${err.message}`);
      return { data: { user: null, session: null }, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Đã đăng xuất thành công");
    } catch (err: any) {
      setError(err);
      toast.error(`Lỗi đăng xuất: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // New method to resend verification email
  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback'
        }
      });
      
      if (error) throw error;
      
      toast.success("Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư đến của bạn.");
      return true;
    } catch (err: any) {
      setError(err);
      toast.error(`Lỗi gửi lại email: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resendVerificationEmail
  };
}
