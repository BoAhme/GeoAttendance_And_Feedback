export type SessionStatus = 'scheduled' | 'active' | 'ended';

export interface Session {
  id: string;
  courseId: string;
  courseName: string;
  classroomId: string;
  classroomName: string;
  topic: string;
  startTime: string;
  endTime: string;
  checkInWindowMinutes: number;
  status: SessionStatus;
  lat: number;
  lng: number;
  geofenceRadiusMeters: number;
}

export interface CheckIn {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  checkedInAt: string;
  lat: number;
  lng: number;
  locationVerified: boolean;
}
