import type { Classroom } from '../types/index.ts';

export const mockClassrooms: Classroom[] = [
  { id: 'r1', name: 'Room 101', building: 'Science Building A', lat: 40.7128, lng: -74.006, geofenceRadiusMeters: 50 },
  { id: 'r2', name: 'Room 205', building: 'Science Building A', lat: 40.713, lng: -74.005, geofenceRadiusMeters: 50 },
  { id: 'r3', name: 'Lab 1', building: 'Science Building B', lat: 40.714, lng: -74.004, geofenceRadiusMeters: 80 },
  { id: 'r4', name: 'Auditorium', building: 'Main Hall', lat: 40.711, lng: -74.007, geofenceRadiusMeters: 100 },
  { id: 'r5', name: 'Room 302', building: 'Math Building', lat: 40.715, lng: -74.003, geofenceRadiusMeters: 50 },
];
