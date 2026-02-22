import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell.tsx';
import { FormDateTime } from '../../components/forms/FormDateTime.tsx';
import { adminApi } from '../../services/mockApi.ts';
import toast from 'react-hot-toast';

const universityChartData = [
  { name: 'CS', value: 120 },
  { name: 'MATH', value: 95 },
  { name: 'PHY', value: 78 },
  { name: 'ENG', value: 110 },
];

const trendData = Array.from({ length: 7 }, (_, i) => ({
  date: format(subDays(new Date(), 6 - i), 'MMM d'),
  attendance: 70 + Math.random() * 25,
}));

export function AdminReportsPage() {
  const [start, setStart] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [end, setEnd] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type: string) => {
    setExporting(true);
    try {
      await adminApi.generateReport(type, start, end);
      toast.success('Report generated.');
    } catch {
      toast.error('Export failed.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppShell title="Reports">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <FormDateTime type="date" label="From" value={start} onChange={(e) => setStart(e.target.value)} />
          <FormDateTime type="date" label="To" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Attendance by department</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={universityChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1e3a8a" name="Students" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">University-wide trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#f59e0b" strokeWidth={2} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Export center</h3>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleExport('attendance')}
              disabled={exporting}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> Attendance PDF
            </button>
            <button
              type="button"
              onClick={() => handleExport('feedback')}
              disabled={exporting}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> Feedback PDF
            </button>
            <button
              type="button"
              onClick={() => handleExport('full')}
              disabled={exporting}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> Full report
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
