export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  status: AttendanceStatus;
  checkedInAt?: string;
  courseName: string;
  sessionDate: string;
}

export interface AttendanceStats {
  percentage: number;
  presentCount: number;
  absentCount: number;
}

export interface AttendanceTrendPoint {
  date: string;
  percentage: number;
  present: number;
  total: number;
}
