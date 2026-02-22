import type { Course } from '../types/index.ts';

export const mockCourses: Course[] = [
  { id: 'c1', name: 'Introduction to Programming', code: 'CS101', departmentId: 'd1', departmentName: 'Computer Science', facultyId: 'f1', facultyName: 'Dr. James Foster', enrolledCount: 24 },
  { id: 'c2', name: 'Data Structures', code: 'CS201', departmentId: 'd1', departmentName: 'Computer Science', facultyId: 'f1', facultyName: 'Dr. James Foster', enrolledCount: 22 },
  { id: 'c3', name: 'Calculus I', code: 'MATH101', departmentId: 'd2', departmentName: 'Mathematics', facultyId: 'f2', facultyName: 'Dr. Sarah Green', enrolledCount: 30 },
  { id: 'c4', name: 'Linear Algebra', code: 'MATH201', departmentId: 'd2', departmentName: 'Mathematics', facultyId: 'f2', facultyName: 'Dr. Sarah Green', enrolledCount: 18 },
  { id: 'c5', name: 'Web Development', code: 'CS301', departmentId: 'd1', departmentName: 'Computer Science', facultyId: 'f1', facultyName: 'Dr. James Foster', enrolledCount: 20 },
];
