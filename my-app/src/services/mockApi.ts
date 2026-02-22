import type { User, UserRole, Session, CheckIn, Course, Department, Classroom, AttendanceRecord, AttendanceTrendPoint, FeedbackSubmission, FeedbackSummary } from '../types/index.ts';
import { mockUsers } from '../data/mockUsers.ts';
import { mockCourses } from '../data/mockCourses.ts';
import { mockClassrooms } from '../data/mockClassrooms.ts';
import { mockDepartments } from '../data/mockDepartments.ts';
import { mockSessions, mockCheckIns } from '../data/mockSessions.ts';
import { subDays, format } from 'date-fns';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/** Mock passwords for specific accounts (email lowercase -> password) */
const mockPasswords: Record<string, string> = {
  'ahmedaymanmido307@gmail.com': '123456789',
};

export const authApi = {
  async login(email: string, password: string, role: UserRole): Promise<User> {
    await delay(600);
    const user: User = {
      id: "temp-id",
      name: email.split("@")[0],
      email,
      role
    };
    
    return user;
  },
  logout: async (): Promise<void> => delay(200),
  async resetPassword(email: string): Promise<void> {
    await delay(800);
    void mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
  },
};

export const studentApi = {
  async getActiveSessions(_userId: string): Promise<Session[]> {
    await delay(500);
    return mockSessions.filter((s) => s.status === 'active');
  },
  async checkIn(sessionId: string, userId: string, lat: number, lng: number): Promise<CheckIn> {
    await delay(400);
    const session = mockSessions.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session not found');
    const dist = Math.sqrt(Math.pow(lat - session.lat, 2) + Math.pow(lng - session.lng, 2)) * 111000;
    const locationVerified = dist <= session.geofenceRadiusMeters;
    return {
      id: `ci-${Date.now()}`,
      sessionId,
      userId,
      userName: mockUsers.find((u) => u.id === userId)?.name ?? 'Student',
      checkedInAt: new Date().toISOString(),
      lat,
      lng,
      locationVerified,
    };
  },
  async getAttendanceHistory(userId: string, courseId?: string): Promise<AttendanceRecord[]> {
    await delay(500);
    const records: AttendanceRecord[] = [];
    for (let i = 0; i < 14; i++) {
      const date = subDays(new Date(), i);
      records.push({
        id: `ar-${i}`,
        sessionId: `s-${i}`,
        userId,
        userName: 'Student',
        status: i % 5 === 0 ? 'absent' : 'present',
        checkedInAt: i % 5 === 0 ? undefined : date.toISOString(),
        courseName: mockCourses[i % mockCourses.length].name,
        sessionDate: format(date, 'yyyy-MM-dd'),
      });
    }
    return courseId ? records.filter((r) => r.courseName.toLowerCase().includes(courseId.toLowerCase())) : records;
  },
  async submitFeedback(_userId: string, _data: FeedbackSubmission): Promise<void> {
    await delay(500);
  },
};

export const facultyApi = {
  async createSession(payload: Partial<Session>): Promise<Session> {
    await delay(500);
    return { ...mockSessions[0], ...payload, id: `s-${Date.now()}` } as Session;
  },
  async getSessionDetails(sessionId: string): Promise<Session | null> {
    await delay(300);
    return mockSessions.find((s) => s.id === sessionId) ?? null;
  },
  async getLiveAttendance(sessionId: string): Promise<CheckIn[]> {
    await delay(400);
    return mockCheckIns.filter((c) => c.sessionId === sessionId);
  },
  async overrideAttendance(_sessionId: string, _userId: string, _status: 'present' | 'absent'): Promise<void> {
    await delay(300);
  },
  async closeSession(sessionId: string): Promise<void> {
    await delay(300);
    const s = mockSessions.find((x) => x.id === sessionId);
    if (s) (s as Session).status = 'ended';
  },
  async getAttendanceAnalytics(_courseId: string, _start: string, _end: string): Promise<{ trend: AttendanceTrendPoint[]; bySession: { sessionId: string; date: string; percentage: number }[]; students: { userId: string; name: string; percentage: number }[] }> {
    await delay(500);
    const trend: AttendanceTrendPoint[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = subDays(new Date(), i);
      trend.push({ date: format(d, 'yyyy-MM-dd'), percentage: 75 + Math.random() * 20, present: 18 + Math.floor(Math.random() * 6), total: 24 });
    }
    const students = mockUsers.filter((u) => u.role === 'student').slice(0, 10).map((u, i) => ({ userId: u.id, name: u.name, percentage: 60 + i * 3 + Math.random() * 10 }));
    return { trend, bySession: trend.map((t, i) => ({ sessionId: `s${i}`, date: t.date, percentage: t.percentage })), students };
  },
  async generateReport(_type: string, _start: string, _end: string): Promise<{ url: string }> {
    await delay(1000);
    return { url: '/reports/attendance.pdf' };
  },
  async getFeedbackSummary(sessionId: string): Promise<FeedbackSummary> {
    await delay(400);
    const session = mockSessions.find((s) => s.id === sessionId);
    const count = 4 + Math.floor(Math.random() * 8);
    return {
      sessionId,
      sessionName: session?.courseName ?? 'Session',
      overallAvg: 3.8,
      clarityAvg: 4,
      relevanceAvg: 3.9,
      paceAvg: 3.7,
      responseCount: count,
      comments: [
        { id: '1', text: 'Great explanation of the topic.', isBlurred: count < 5 },
        { id: '2', text: 'Could use more examples.', isBlurred: count < 5 },
        { id: '3', text: 'Pace was good.', isBlurred: count < 5 },
      ],
    };
  },
};

export const adminApi = {
  async getUsers(role?: UserRole): Promise<User[]> {
    await delay(400);
    return role ? mockUsers.filter((u) => u.role === role) : mockUsers;
  },
  async createUser(payload: Partial<User> & { password: string }): Promise<User> {
    await delay(400);
    const user: User = {
      id: `u-${Date.now()}`,
      name: payload.name ?? '',
      email: payload.email ?? '',
      role: payload.role ?? 'student',
    };
    mockUsers.push(user);
    return user;
  },
  async updateUser(id: string, payload: Partial<User>): Promise<User> {
    await delay(300);
    const u = mockUsers.find((x) => x.id === id);
    return u ? { ...u, ...payload } : (payload as User);
  },
  async getDepartments(): Promise<Department[]> {
    await delay(300);
    return mockDepartments;
  },
  async updateDepartment(id: string, payload: Partial<Department>): Promise<Department> {
    await delay(300);
    const idx = mockDepartments.findIndex((x) => x.id === id);
    if (idx === -1) return payload as Department;
    mockDepartments[idx] = { ...mockDepartments[idx], ...payload };
    return mockDepartments[idx];
  },
  async getCourses(): Promise<Course[]> {
    await delay(300);
    return mockCourses;
  },
  async getClassrooms(): Promise<Classroom[]> {
    await delay(300);
    return mockClassrooms;
  },
  async updateClassroom(id: string, payload: Partial<Classroom>): Promise<Classroom> {
    await delay(300);
    const c = mockClassrooms.find((x) => x.id === id);
    return c ? { ...c, ...payload } : (payload as Classroom);
  },
  async generateReport(_type: string, _start: string, _end: string): Promise<{ url: string }> {
    await delay(1000);
    return { url: '/reports/sample.pdf' };
  },
};
