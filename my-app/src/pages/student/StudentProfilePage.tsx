import { useNavigate } from 'react-router-dom';
import { User, LogOut, BookOpen } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell.tsx';
import { useAuthStore } from '../../stores/authStore.ts';
import { mockCourses } from '../../data/mockCourses.ts';
import toast from 'react-hot-toast';

export function StudentProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <AppShell title="Profile">
      <div className="space-y-6 max-w-lg">
        <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Student
            </span>
          </div>


          
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Enrolled courses
          </h3>
          <ul className="space-y-2">
            {mockCourses.slice(0, 5).map((c) => (
              <li key={c.id} className="py-2 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900">
                {c.name} ({c.code})
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-danger text-danger px-4 py-3 font-medium hover:bg-danger/5 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </AppShell>
  );
}
