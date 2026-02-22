import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell.tsx';
import { FormInput } from '../../components/forms/FormInput.tsx';
import { FormSelect } from '../../components/forms/FormSelect.tsx';
import { FormDateTime } from '../../components/forms/FormDateTime.tsx';
import { FormMapPicker } from '../../components/forms/FormMapPicker.tsx';
import { facultyApi } from '../../services/mockApi.ts';
import { mockCourses } from '../../data/mockCourses.ts';
import { mockClassrooms } from '../../data/mockClassrooms.ts';
import toast from 'react-hot-toast';

const courseOptions = mockCourses.map((c) => ({ value: c.id, label: c.name }));
const classroomOptions = mockClassrooms.map((r) => ({ value: r.id, label: `${r.name} – ${r.building}` }));

interface FormValues {
  courseId: string;
  classroomId: string;
  topic: string;
  startTime: string;
  endTime: string;
  checkInWindowMinutes: number;
}

export function CreateSessionPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: mockClassrooms[0]?.lat ?? 40.7128, lng: mockClassrooms[0]?.lng ?? -74.006 });
  const [radius, setRadius] = useState(50);

  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      courseId: courseOptions[0]?.value ?? '',
      classroomId: classroomOptions[0]?.value ?? '',
      topic: '',
      checkInWindowMinutes: 15,
    },
  });

  const classroomId = watch('classroomId');
  const classroom = mockClassrooms.find((c) => c.id === classroomId);
  useEffect(() => {
    if (classroom) {
      setMapCenter({ lat: classroom.lat, lng: classroom.lng });
      setRadius(classroom.geofenceRadiusMeters);
    }
  }, [classroom?.id]);

  const onSubmit = async (values: FormValues) => {
    const course = mockCourses.find((c) => c.id === values.courseId);
    const room = mockClassrooms.find((r) => r.id === values.classroomId);
    setSubmitting(true);
    try {
      await facultyApi.createSession({
        courseId: values.courseId,
        courseName: course?.name ?? '',
        classroomId: values.classroomId,
        classroomName: room?.name ?? '',
        topic: values.topic,
        startTime: values.startTime,
        endTime: values.endTime,
        checkInWindowMinutes: values.checkInWindowMinutes,
        status: 'scheduled',
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        geofenceRadiusMeters: radius,
      });
      toast.success('Session created.');
      navigate('/faculty/live');
    } catch {
      toast.error('Failed to create session.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Create Session">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormSelect label="Course" options={courseOptions} fullWidth {...register('courseId', { required: true })} />
        <FormSelect label="Classroom" options={classroomOptions} fullWidth {...register('classroomId', { required: true })} />
        <FormMapPicker
          label="Map preview & geofence"
          center={mapCenter}
          radiusMeters={radius}
          onCenterChange={(lat, lng) => setMapCenter({ lat, lng })}
          onRadiusChange={setRadius}
          height="200px"
        />
        <FormDateTime label="Start" type="datetime-local" fullWidth {...register('startTime', { required: true })} />
        <FormDateTime label="End" type="datetime-local" fullWidth {...register('endTime', { required: true })} />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Check-in window (minutes)</label>
          <input
            type="number"
            min={5}
            max={30}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            {...register('checkInWindowMinutes', { valueAsNumber: true, required: true })}
          />
        </div>
        <FormInput label="Topic" fullWidth {...register('topic', { required: true })} />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Create session'}
        </button>
      </form>
    </AppShell>
  );
}
