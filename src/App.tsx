import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import AdminPage from './components/AdminPage';
import PrivilegeAccessPage from './components/PrivilegeAccessPage';
import UserManual from './components/UserManual';
import Feedback from './components/Feedback';
import AiInsightsModal from './components/AiInsightsModal';
import { UserProfile, Metric, Retailer, ScoreData, Role } from './types';
import { DEFAULT_METRICS, DEFAULT_RETAILERS } from './constants';
import { MOCK_SCORES } from './mockData';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, LogIn, Shield, User as UserIcon, LayoutDashboard, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';

const CONSTANT_USERS = {
  ADMIN: {
    email: 'admin@omnicx.com',
    role: 'admin' as Role,
    displayName: 'OmniCx Admin'
  },
  USER: {
    email: 'user@omnicx.com',
    role: 'user' as Role,
    displayName: 'Retail Analyst'
  }
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('omnicx_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activePage, setActivePage] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [scores, setScores] = useState<ScoreData[]>(() => {
    const saved = localStorage.getItem('omnicx_scores');
    return saved ? JSON.parse(saved) : MOCK_SCORES;
  });
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('omnicx_users');
    return saved ? JSON.parse(saved) : [
      { uid: '1', email: CONSTANT_USERS.ADMIN.email, displayName: CONSTANT_USERS.ADMIN.displayName, role: 'admin', createdAt: new Date().toISOString() },
      { uid: '2', email: CONSTANT_USERS.USER.email, displayName: CONSTANT_USERS.USER.displayName, role: 'user', createdAt: new Date().toISOString() },
    ];
  });

  useEffect(() => {
    localStorage.setItem('omnicx_scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('omnicx_users', JSON.stringify(users));
  }, [users]);

  const [filters, setFilters] = useState({
    retailer: 'All Retailers',
    region: 'North America',
    date: '2026-04-02',
    storeType: 'All',
  });

  const [aiInsights, setAiInsights] = useState<{ isOpen: boolean; storeType: string; retailerId: string }>({
    isOpen: false,
    storeType: '',
    retailerId: '',
  });

  const retailers = useMemo(() => DEFAULT_RETAILERS.map(r => r.name), []);
  const regions = ['North America', 'Europe', 'Asia Pacific'];
  const dates = useMemo(() => Array.from(new Set(scores.map(s => s.date))).sort().reverse(), [scores]);
  const storeTypes = ['All', 'ONLINE', 'IN-STORE'];

  const handleLogin = (type: 'ADMIN' | 'USER') => {
    setIsLoggingIn(true);
    const selected = CONSTANT_USERS[type];
    
    // Simulate a smooth modern login transition
    setTimeout(() => {
      const newUser = {
        uid: type === 'ADMIN' ? '1' : '2',
        email: selected.email,
        displayName: selected.displayName,
        role: selected.role,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem('omnicx_user', JSON.stringify(newUser));
      setIsLoggingIn(false);
      // Ensure we don't trigger a full page reload by using state
      setActivePage('overview');
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('omnicx_user');
    setActivePage('overview');
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateScore = (updatedScore: ScoreData) => {
    setScores(prev => prev.map(s => 
      (s.metricId === updatedScore.metricId && s.retailerId === updatedScore.retailerId && s.date === updatedScore.date)
        ? updatedScore
        : s
    ));
  };

  const handleAddDate = (date: string) => {
    const newScores: ScoreData[] = [];
    DEFAULT_METRICS.forEach(metric => {
      DEFAULT_RETAILERS.forEach(retailer => {
        newScores.push({
          id: Math.random().toString(36).substr(2, 9),
          metricId: metric.id,
          retailerId: retailer.id,
          score: 0,
          comments: 'No data yet.',
          date: date,
          region: filters.region
        });
      });
    });
    setScores(prev => [...prev, ...newScores]);
  };

  const handleAddUser = (email: string, role: Role) => {
    const newUser: UserProfile = {
      uid: Math.random().toString(36).substr(2, 9),
      email,
      displayName: email.split('@')[0],
      role,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleRemoveUser = (uid: string) => {
    setUsers(prev => prev.filter(u => u.uid !== uid));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 p-6"
            >
              <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/25">
                      <LayoutDashboard size={28} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">OmniCx</h1>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black leading-tight">
                      Retail Performance <br />
                      <span className="text-primary">Redefined.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-md">
                      Access real-time analytics, AI-powered insights, and comprehensive retail metrics in one unified dashboard.
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-2xl font-black">99.9%</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Uptime</span>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="flex flex-col gap-1">
                      <span className="text-2xl font-black">24/7</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Monitoring</span>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="flex flex-col gap-1">
                      <span className="text-2xl font-black">AI</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Insights</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-[2.5rem] shadow-2xl p-10 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Sparkles size={120} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Welcome Back</h3>
                    <p className="text-muted-foreground">Select an account to access the dashboard</p>
                  </div>

                  <div className="grid gap-4">
                    <button
                      onClick={() => handleLogin('ADMIN')}
                      disabled={isLoggingIn}
                      className="group relative flex items-center gap-4 p-6 bg-primary/5 border-2 border-transparent hover:border-primary rounded-3xl transition-all text-left"
                    >
                      <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                        <Shield size={28} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-lg">Administrator</p>
                        <p className="text-sm text-muted-foreground">{CONSTANT_USERS.ADMIN.email}</p>
                      </div>
                      <LogIn className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                    </button>

                    <button
                      onClick={() => handleLogin('USER')}
                      disabled={isLoggingIn}
                      className="group relative flex items-center gap-4 p-6 bg-accent/50 border-2 border-transparent hover:border-primary rounded-3xl transition-all text-left"
                    >
                      <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform">
                        <UserIcon size={28} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-lg">Standard User</p>
                        <p className="text-sm text-muted-foreground">{CONSTANT_USERS.USER.email}</p>
                      </div>
                      <LogIn className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                    </button>
                  </div>

                  {isLoggingIn && (
                    <div className="flex items-center justify-center gap-3 text-primary font-bold animate-pulse">
                      <Loader2 className="animate-spin" size={20} />
                      Authenticating...
                    </div>
                  )}

                  <p className="text-center text-xs text-muted-foreground">
                    OmniCx Enterprise Security Protocol Active
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <Header
                retailers={retailers}
                regions={regions}
                dates={dates}
                storeTypes={storeTypes}
                filters={filters}
                onFilterChange={handleFilterChange}
                onMenuClick={() => setIsMobileSidebarOpen(true)}
              />
              
              <div className="flex">
                <Sidebar
                  activePage={activePage}
                  onPageChange={setActivePage}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  isExpanded={isSidebarExpanded}
                  onExpandedChange={setIsSidebarExpanded}
                  isMobileOpen={isMobileSidebarOpen}
                  onMobileClose={() => setIsMobileSidebarOpen(false)}
                />
                
                <main 
                  className={cn(
                    "flex-1 p-4 md:p-8 transition-all duration-300 overflow-x-hidden",
                    isSidebarExpanded ? "md:ml-60 ml-0" : "md:ml-16 ml-0"
                  )}
                >
                  <div className="max-w-full md:max-w-400 mx-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activePage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {activePage === 'overview' && (
                          <div className="space-y-4">
                            {/* <div className="flex items-center justify-between">
                              <div>
                                <h2 className="text-3xl font-black tracking-tight">Dashboard Overview</h2>
                                <p className="text-muted-foreground font-medium">Real-time performance across all retail channels.</p>
                              </div>
                              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                Live Data
                              </div>
                            </div> */}
                            <Overview
                              metrics={DEFAULT_METRICS}
                              retailers={DEFAULT_RETAILERS}
                              scores={scores.filter(s => s.date === filters.date)}
                              selectedRetailer={filters.retailer}
                              selectedStoreType={filters.storeType}
                              onOpenAiInsights={(storeType, retailerId) => setAiInsights({ isOpen: true, storeType, retailerId })}
                              onUpdateScore={handleUpdateScore}
                              onOpenOverallAiInsights={() => setAiInsights({ isOpen: true, storeType: 'All', retailerId: '' })}
                              isEditable={isAdmin}
                            />
                          </div>
                        )}

                        {activePage === 'admin' && isAdmin && (
                          <AdminPage
                            metrics={DEFAULT_METRICS}
                            retailers={DEFAULT_RETAILERS}
                            scores={scores}
                            onUpdateScore={handleUpdateScore}
                            onAddDate={handleAddDate}
                          />
                        )}

                        {activePage === 'privilege' && isAdmin && (
                          <PrivilegeAccessPage
                            users={users}
                            onAddUser={handleAddUser}
                            onRemoveUser={handleRemoveUser}
                          />
                        )}

                        {activePage === 'manual' && <UserManual isAdmin={isAdmin} />}
                        {activePage === 'feedback' && <Feedback />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </main>
              </div>

              <AiInsightsModal
                isOpen={aiInsights.isOpen}
                onClose={() => setAiInsights({ ...aiInsights, isOpen: false })}
                storeType={aiInsights.storeType}
                retailerId={aiInsights.retailerId}
                metrics={DEFAULT_METRICS}
                retailers={DEFAULT_RETAILERS}
                scores={scores.filter(s => s.date === filters.date)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
