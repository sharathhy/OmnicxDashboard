import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ShieldCheck, UserPlus, BookOpen, MessageSquare, LogOut, ChevronRight, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const MENU_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, adminOnly: false },
  { id: 'admin', label: 'Admin', icon: ShieldCheck, adminOnly: true },
  { id: 'privilege', label: 'Privilege Access', icon: UserPlus, adminOnly: true },
  { id: 'manual', label: 'User Manual', icon: BookOpen, adminOnly: false },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, adminOnly: false },
];

export default function Sidebar({ activePage, onPageChange, isAdmin, onLogout, isExpanded, onExpandedChange, isMobileOpen, onMobileClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-4 ">
        {isMobile && (
          <div className="px-6 py-4 border-b mb-4 flex items-center justify-between">
            <h2 className="font-bold text-lg">Menu</h2>
            <button onClick={onMobileClose} className="p-2 hover:bg-accent rounded-full">
              <X size={20} />
            </button>
          </div>
        )}
        {MENU_ITEMS.map((item) => {
          const isLocked = item.adminOnly && !isAdmin;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isLocked) {
                  onPageChange(item.id);
                  if (isMobile && onMobileClose) onMobileClose();
                }
              }}
              disabled={isLocked}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 transition-colors relative group",
                activePage === item.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-accent",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
            >
              <item.icon size={24} className="shrink-0" />
              <motion.span
                className="whitespace-nowrap font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: isExpanded || isMobile ? 1 : 0 }}
              >
                {item.label}
              </motion.span>
              {isLocked && !isExpanded && !isMobile && (
                <div className="absolute left-16 px-2 py-1 bg-popover border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Admin Only
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors rounded-md"
        >
          <LogOut size={24} className="shrink-0" />
          <motion.span
            className="whitespace-nowrap font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: isExpanded || isMobile ? 1 : 0 }}
          >
            Logout
          </motion.span>
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-100 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r z-40 flex flex-col"
      initial={{ width: 64 }}
      animate={{ width: isExpanded ? 240 : 64 }}
      onMouseEnter={() => onExpandedChange(true)}
      onMouseLeave={() => onExpandedChange(false)}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {sidebarContent}
    </motion.aside>
  );
}
