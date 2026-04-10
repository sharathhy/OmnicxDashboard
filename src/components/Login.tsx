import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Shield, LayoutDashboard, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  loading: boolean;
}

export default function Login({ onLogin, loading }: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-12 text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/25">
              <LayoutDashboard size={40} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">OmniCx</h1>
            <p className="text-muted-foreground font-medium">Retail Performance & Insights Dashboard</p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-accent rounded-2xl text-primary">
                <Shield size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-accent rounded-2xl text-primary">
                <Sparkles size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Insights</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-accent rounded-2xl text-primary">
                <LayoutDashboard size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Real-time</span>
            </div>
          </div>

          <button
            onClick={onLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                Sign in with Google
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
