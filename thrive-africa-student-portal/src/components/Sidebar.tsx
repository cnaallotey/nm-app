import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  BookOpen, 
  FileText, 
  Briefcase, 
  Award, 
  User, 
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { auth } from '@/lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Live Classes', icon: Video, path: '/classes' },
  { name: 'Materials', icon: BookOpen, path: '/materials' },
  { name: 'Assignments', icon: FileText, path: '/assignments' },
  { name: 'Career Hub', icon: Briefcase, path: '/career' },
  { name: 'Certificates', icon: Award, path: '/certificates' },
];

export function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-primary text-white">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="font-bold text-white">T</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Thrive Africa</h1>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-accent text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
          
          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                location.pathname.startsWith('/admin')
                  ? "bg-accent text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Settings className="w-5 h-5" />
              Admin Panel
            </Link>
          )}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-white/70" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || 'Student'}</p>
            <p className="text-xs text-white/50 truncate">{profile?.programme || 'Enrolled'}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 p-0 h-auto py-2"
          onClick={() => auth.signOut()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="bg-white">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[240px] z-[60] lg:hidden shadow-xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
