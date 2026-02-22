import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell.tsx';
import { GeofenceMap } from '../../components/ui/GeofenceMap.tsx';
import { DataTable, type Column } from '../../components/ui/DataTable.tsx';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton.tsx';
import { EmptyState } from '../../components/ui/EmptyState.tsx';
import { facultyApi } from '../../services/mockApi.ts';
import { mockSessions } from '../../data/mockSessions.ts';
import type { Session, CheckIn } from '../../types/index.ts';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export function LiveSessionPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSessions(mockSessions.filter((s) => s.status === 'active'));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setCheckIns([]);
      return;
    }
    facultyApi.getLiveAttendance(selectedId).then(setCheckIns);
    const id = setInterval(() => facultyApi.getLiveAttendance(selectedId).then(setCheckIns), 5000);
    return () => clearInterval(id);
  }, [selectedId]);

  const activeSession = sessions.find((s) => s.id === selectedId) ?? sessions[0];
  const totalStudents = 250;
  const presentCount = checkIns.length;

  const handleOverride = async (userId: string, status: 'present' | 'absent') => {
    if (!selectedId) return;
    try {
      await facultyApi.overrideAttendance(selectedId, userId, status);
      toast.success('Attendance updated.');
      facultyApi.getLiveAttendance(selectedId).then(setCheckIns);
    } catch {
      toast.error('Update failed.');
    }
  };

  const handleClose = async () => {
    if (!selectedId) return;
    try {
      await facultyApi.closeSession(selectedId);
      toast.success('Session closed.');
      setSessions((prev) => prev.filter((s) => s.id !== selectedId));
      setSelectedId(null);
    } catch {
      toast.error('Failed to close.');
    }
  };

  const columns: Column<CheckIn>[] = [
    { id: 'name', header: 'Name', accessor: (r) => r.userName },
    { id: 'time', header: 'Check-in time', accessor: (r) => format(new Date(r.checkedInAt), 'HH:mm:ss') },
    {
      id: 'verified',
      header: 'Location',
      accessor: (r) => (r.locationVerified ? 'Verified' : 'Not verified'),
    },
    {
      id: 'override',
      header: 'Actions',
      accessor: (r) => (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => handleOverride(r.userId, 'present')}
            className="text-xs text-success hover:underline"
          >
            Present
          </button>
          <button
            type="button"
            onClick={() => handleOverride(r.userId, 'absent')}
            className="text-xs text-danger hover:underline"
          >
            Absent
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <AppShell title="Live Session">
        <TableSkeleton rows={8} />
      </AppShell>
    );
  }

  if (sessions.length === 0) {
    return (
      <AppShell title="Live Session">
        <EmptyState title="No active session" description="Start a session from Create Session." />
      </AppShell>
    );
  }

  return (
    <AppShell title="Live Session">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold">{presentCount} / {totalStudents}</span>
            <span className="text-sm text-gray-500">Present</span>
          </div>
          {sessions.length > 1 && (
            <select
              value={selectedId ?? sessions[0].id}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>{s.courseName}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="ml-auto rounded-lg border border-danger text-danger px-4 py-2 text-sm font-medium hover:bg-danger/5"
          >
            Close session
          </button>
        </div>
        {activeSession && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <GeofenceMap
              center={{ lat: activeSession.lat, lng: activeSession.lng }}
              radiusMeters={activeSession.geofenceRadiusMeters}
              height="280px"
            />
          </div>
        )}
        <DataTable
          columns={columns}
          data={checkIns}
          keyExtractor={(r) => r.id}
          searchPlaceholder="Search students..."
        />
      </div>
    </AppShell>
  );
}
