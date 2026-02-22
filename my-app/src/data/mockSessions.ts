import type { Session, CheckIn } from '../types/index.ts';
import { addMinutes, subMinutes } from 'date-fns';

const now = new Date();
const activeStart = subMinutes(now, 15);
const activeEnd = addMinutes(now, 45);

export const mockSessions: Session[] = [
  {
    id: 's1',
    courseId: 'c1',
    courseName: 'Introduction to Programming',
    classroomId: 'r1',
    classroomName: 'Room 101',
    topic: 'Variables and Types',
    startTime: activeStart.toISOString(),
    endTime: activeEnd.toISOString(),
    checkInWindowMinutes: 15,
    status: 'active',
    lat: 40.7128,
    lng: -74.006,
    geofenceRadiusMeters: 50,
  },
  {
    id: 's2',
    courseId: 'c3',
    courseName: 'Calculus I',
    classroomId: 'r5',
    classroomName: 'Room 302',
    topic: 'Limits',
    startTime: addMinutes(now, 60).toISOString(),
    endTime: addMinutes(now, 120).toISOString(),
    checkInWindowMinutes: 10,
    status: 'scheduled',
    lat: 40.715,
    lng: -74.003,
    geofenceRadiusMeters: 50,
  },
];

export const mockCheckIns: CheckIn[] = [
  { id: 'ci1', sessionId: 's1', userId: 'u1', userName: 'Alice Johnson', checkedInAt: subMinutes(now, 10).toISOString(), lat: 40.7129, lng: -74.0059, locationVerified: true },
  { id: 'ci2', sessionId: 's1', userId: 'u2', userName: 'Bob Smith', checkedInAt: subMinutes(now, 8).toISOString(), lat: 40.7127, lng: -74.0061, locationVerified: true },
  { id: 'ci3', sessionId: 's1', userId: 'u3', userName: 'Carol White', checkedInAt: subMinutes(now, 5).toISOString(), lat: 40.7128, lng: -74.006, locationVerified: true },
];
