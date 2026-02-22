import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Calendar, Download, TrendingUp } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell.tsx';
import { StatCard } from '../../components/ui/StatCard.tsx';
import { DataTable, type Column } from '../../components/ui/DataTable.tsx';
import { FormDateTime } from '../../components/forms/FormDateTime.tsx';
import { FormSelect } from '../../components/forms/FormSelect.tsx';
import { LoadingSkeleton, CardSkeleton } from '../../components/ui/LoadingSkeleton.tsx';
import { facultyApi } from '../../services/mockApi.ts';
import { mockCourses } from '../../data/mockCourses.ts';
import toast from 'react-hot-toast';

const courseOptions = mockCourses.map((c) => ({ value: c.id, label: c.name }));

export function AttendanceAnalyticsPage() {
  const [courseId, setCourseId] = useState(mockCourses[0]?.id ?? '');
  const [start, setStart] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [end, setEnd] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [data, setData] = useState<{
    trend: { date: string; percentage: number; present: number; total: number }[];
    bySession: { sessionId: string; date: string; percentage: number }[];
    students: { userId: string; name: string; percentage: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    facultyApi.getAttendanceAnalytics(courseId, start, end).then(setData).finally(() => setLoading(false));
  }, [courseId, start, end]);

  const handleExport = async () => {
    try {
      await facultyApi.generateReport('attendance', start, end);
      toast.success('Report generated.');
    } catch {
      toast.error('Export failed.');
    }
  };

  const studentsUnder75 = data?.students.filter((s) => s.percentage < 75) ?? [];

  const columns: Column<{ userId: string; name: string; percentage: number }>[] = [
    { id: 'name', header: 'Student', accessor: (r) => r.name },
    { id: 'pct', header: 'Attendance %', accessor: (r) => `${r.percentage.toFixed(0)}%` },
  ];

  if (loading) {
    return (
      <AppShell title="Attendance Analytics">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <LoadingSkeleton className="h-64 w-full rounded-lg" />
      </AppShell>
    );
  }

  const avgPct = data?.trend.length ? data.trend.reduce((a, t) => a + t.percentage, 0) / data.trend.length : 0;
  const totalPresent = data?.trend.reduce((a, t) => a + t.present, 0) ?? 0;
  const totalSessions = data?.trend.length ?? 0;

  return (
    <AppShell title="Attendance Analytics">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <FormSelect
            label="Course"
            options={courseOptions}
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
          <FormDateTime type="date" label="From" value={start} onChange={(e) => setStart(e.target.value)} />
          <FormDateTime type="date" label="To" value={end} onChange={(e) => setEnd(e.target.value)} />
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90"
          >
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={TrendingUp} label="Avg attendance" value={`${avgPct.toFixed(0)}%`} />
          <StatCard icon={Calendar} label="Sessions" value={totalSessions} />
          <StatCard icon={TrendingUp} label="Total present" value={totalPresent} />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Attendance trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.trend ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="percentage" stroke="#1e3a8a" strokeWidth={2} name="%" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">By session</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.bySession ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#f59e0b" name="%" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Students below 75%</h3>
          <DataTable
            columns={columns}
            data={studentsUnder75}
            keyExtractor={(r) => r.userId}
            searchPlaceholder="Filter..."
          />
        </div>
      </div>
    </AppShell>
  );
}
