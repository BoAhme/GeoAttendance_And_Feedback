import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MessageSquare, Star } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell.tsx';
import { StatCard } from '../../components/ui/StatCard.tsx';
import { FormSelect } from '../../components/forms/FormSelect.tsx';
import { LoadingSkeleton, CardSkeleton } from '../../components/ui/LoadingSkeleton.tsx';
import { facultyApi } from '../../services/mockApi.ts';
import { mockSessions } from '../../data/mockSessions.ts';
import type { FeedbackSummary } from '../../types/index.ts';

const sessionOptions = mockSessions.map((s) => ({ value: s.id, label: `${s.courseName} – ${s.topic}` }));

export function FeedbackDashboardPage() {
  const [sessionId, setSessionId] = useState(mockSessions[0]?.id ?? '');
  const [summary, setSummary] = useState<FeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    facultyApi.getFeedbackSummary(sessionId).then(setSummary).finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <AppShell title="Feedback Dashboard">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <LoadingSkeleton className="h-48 w-full rounded-lg" />
      </AppShell>
    );
  }

  if (!summary) {
    return (
      <AppShell title="Feedback Dashboard">
        <div className="mb-4">
          <FormSelect
            label="Session"
            options={sessionOptions}
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />
        </div>
        <p className="text-gray-500">No feedback data for this session.</p>
      </AppShell>
    );
  }

  const trendData = [
    { name: 'Overall', value: summary.overallAvg },
    { name: 'Clarity', value: summary.clarityAvg },
    { name: 'Relevance', value: summary.relevanceAvg },
    { name: 'Pace', value: summary.paceAvg },
  ];

  return (
    <AppShell title="Feedback Dashboard">
      <div className="space-y-6">
        <FormSelect
          label="Session"
          options={sessionOptions}
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Star} label="Overall" value={summary.overallAvg.toFixed(1)} />
          <StatCard icon={MessageSquare} label="Clarity" value={summary.clarityAvg.toFixed(1)} />
          <StatCard icon={MessageSquare} label="Relevance" value={summary.relevanceAvg.toFixed(1)} />
          <StatCard icon={MessageSquare} label="Pace" value={summary.paceAvg.toFixed(1)} />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Score breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1e3a8a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Comments ({summary.responseCount} responses) – anonymous, blurred until 5+
          </h3>
          <ul className="space-y-2">
            {summary.comments.map((c) => (
              <li
                key={c.id}
                className="py-3 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700"
              >
                {c.isBlurred ? (
                  <span className="filter blur-sm select-none">{c.text}</span>
                ) : (
                  c.text
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
