import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MapPin,
  BookOpen,
  Building2,
  FileText,
  Home,
  MessageSquare,
  History,
  User,
  BarChart3,
  ClipboardList,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.ts';
import type { UserRole } from '../../types/index.ts';
import { cn } from '../../utils/cn.ts';

const studentNav = [
  { to: '/student', label: 'Home', icon: Home },
  { to: '/student/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/student/history', label: 'History', icon: History },
  { to: '/student/profile', label: 'Profile', icon: User },
];

const facultyNav = [
  { to: '/faculty/sessions', label: 'Create Session', icon: ClipboardList },
  { to: '/faculty/live', label: 'Live Session', icon: Users },
  { to: '/faculty/analytics', label: 'Attendance', icon: BarChart3 },
  { to: '/faculty/feedback', label: 'Feedback', icon: MessageSquare },
];

const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/classrooms', label: 'Classrooms', icon: MapPin },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
];

function getNav(role: UserRole) {
  if (role === 'student') return studentNav;
  if (role === 'faculty') return facultyNav;
  return adminNav;
}

interface AppShellProps {
  children: ReactNode;
  title?: string;
}

export function AppShell({ children, title }: AppShellProps) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? 'student';
  const nav = getNav(role);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center px-4 border-b border-gray-200">
          <span className="font-semibold text-primary text-lg">Geo-Attendance</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                  active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:pl-56 flex flex-col min-h-screen">
        {title && (
          <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur px-4 py-3">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </header>
        )}
        <main className="flex-1 p-4 pb-24 md:pb-4">{children}</main>

        {/* Bottom nav mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white flex justify-around py-2 safe-area-pb">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-1 rounded-lg text-xs font-medium transition-colors duration-200',
                  active ? 'text-primary' : 'text-gray-500'
                )}
              >
                <Icon className="h-6 w-6" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
