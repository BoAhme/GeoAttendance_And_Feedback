import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../../components/layout/AppShell.tsx';
import { StarRatingInput } from '../../components/ui/StarRating.tsx';
import { FormSelect } from '../../components/forms/FormSelect.tsx';
import { mockSessions } from '../../data/mockSessions.ts';
import { studentApi } from '../../services/mockApi.ts';
import { useAuthStore } from '../../stores/authStore.ts';
import toast from 'react-hot-toast';

interface FeedbackFormValues {
  sessionId: string;
  overall: number;
  clarity: number;
  relevance: number;
  pace: number;
  comment: string;
}

const sessionOptions = mockSessions.map((s) => ({
  value: s.id,
  label: `${s.courseName} – ${s.topic}`,
}));

export function StudentFeedbackPage() {
  const user = useAuthStore((s) => s.user);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<FeedbackFormValues>({
    defaultValues: {
      sessionId: sessionOptions[0]?.value ?? '',
      overall: 0,
      clarity: 0,
      relevance: 0,
      pace: 0,
      comment: '',
    },
  });

  const comment = watch('comment');
  const commentLength = comment?.length ?? 0;
  const maxComment = 500;

  const onSubmit = async (values: FeedbackFormValues) => {
    if (!user) return;
    setSubmitting(true);
    try {
      await studentApi.submitFeedback(user.id, {
        sessionId: values.sessionId,
        overall: values.overall,
        clarity: values.clarity,
        relevance: values.relevance,
        pace: values.pace,
        comment: values.comment,
      });
      toast.success('Feedback submitted.');
    } catch {
      toast.error('Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Feedback">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <FormSelect
          label="Session"
          options={sessionOptions}
          fullWidth
          {...register('sessionId', { required: true })}
        />
        <StarRatingInput label="Overall" value={watch('overall')} onChange={(v) => setValue('overall', v)} />
        <StarRatingInput label="Clarity" value={watch('clarity')} onChange={(v) => setValue('clarity', v)} />
        <StarRatingInput label="Relevance" value={watch('relevance')} onChange={(v) => setValue('relevance', v)} />
        <StarRatingInput label="Pace" value={watch('pace')} onChange={(v) => setValue('pace', v)} />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Comment (optional)</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            rows={4}
            maxLength={maxComment}
            {...register('comment')}
          />
          <p className="text-xs text-gray-500">{commentLength}/{maxComment}</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary/90 disabled:opacity-60 transition-colors duration-200"
        >
          {submitting ? 'Submitting...' : 'Submit feedback'}
        </button>
      </form>
    </AppShell>
  );
}
