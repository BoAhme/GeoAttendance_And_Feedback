import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Percent } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell.tsx';
import { StatCard } from '../../components/ui/StatCard.tsx';
import { AttendanceBadge } from '../../components/ui/AttendanceBadge.tsx';
import { FormSelect } from '../../components/forms/FormSelect.tsx';
import { LoadingSkeleton, CardSkeleton } from '../../components/ui/LoadingSkeleton.tsx';
import { useAuthStore } from '../../stores/authStore.ts';
import { studentApi } from '../../services/mockApi.ts';
import { mockCourses } from '../../data/mockCourses.ts';
import type { AttendanceRecord } from '../../types/index.ts';

const courseFilterOptions = [
  { value: '', label: 'All courses' },
  ...mockCourses.map((c) => ({ value: c.id, label: c.name })),
];

export function StudentHistoryPage() {
  const user = useAuthStore((s) => s.user);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    studentApi.getAttendanceHistory(user.id, courseId || undefined).then(setRecords).finally(() => setLoading(false));
  }, [user, courseId]);

  const presentCount = records.filter((r) => r.status === 'present').length;
  const absentCount = records.filter((r) => r.status === 'absent').length;
  const percentage = records.length ? Math.round((presentCount / records.length) * 100) : 0;

  if (loading) {
    return (
      <AppShell title="History">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <LoadingSkeleton className="h-64 w-full rounded-lg" />
      </AppShell>
    );
  }

  return (
    <AppShell title="History">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Percent} label="Attendance %" value={`${percentage}%`} />
        <StatCard icon={CheckCircle} label="Present" value={presentCount} />
        <StatCard icon={XCircle} label="Absent" value={absentCount} />
      </div>
<div className="mb-4">
          <FormSelect
            label="Course"
            options={courseFilterOptions}
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            fullWidth
          />
        </div>
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-700">Timeline</h2>
        <ul className="space-y-2">
          {records.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-200 bg-white"
            >
              <div>
                <p className="font-medium text-gray-900">{r.courseName}</p>
                <p className="text-xs text-gray-500">{format(new Date(r.sessionDate), 'MMM d, yyyy')}</p>
              </div>
              <AttendanceBadge status={r.status} />
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
