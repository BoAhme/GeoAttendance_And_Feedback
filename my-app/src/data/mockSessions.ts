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
    lat: 30.0275,
    lng: 31.2101,
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
    lat: 30.0277,
    lng: 31.2102,
    geofenceRadiusMeters: 50,
  },
];

export const mockCheckIns: CheckIn[] = [
  { id: 'ci1', sessionId: 's1', userId: 'u1', userName: 'zeyad ahmed', checkedInAt: subMinutes(now, 10).toISOString(), lat: 30.0276, lng: 31.2101, locationVerified: true },
  { id: 'ci2', sessionId: 's1', userId: 'u2', userName: 'zeyad mohamed', checkedInAt: subMinutes(now, 8).toISOString(), lat: 30.0277, lng: 31.2102, locationVerified: true },
  { id: 'ci3', sessionId: 's1', userId: 'u3', userName: 'ahmed ayman', checkedInAt: subMinutes(now, 5).toISOString(), lat: 30.0278, lng: 31.2103, locationVerified: true },
];
