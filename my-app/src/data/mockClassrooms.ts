import type { Classroom } from '../types/index.ts';

export const mockClassrooms: Classroom[] = [
  { id: 'r1', name: 'Room 210', building: 'Science Building A', lat: 30.0276, lng: 31.2101, geofenceRadiusMeters: 50 },
  { id: 'r2', name: 'Room 209', building: 'Science Building A', lat: 30.0277, lng: 31.2102, geofenceRadiusMeters: 50 },
  { id: 'r3', name: 'Lab 3', building: 'Science Building B', lat: 30.0278, lng: 31.2103, geofenceRadiusMeters: 80 },
  { id: 'r4', name: 'Auditorium', building: 'Main Hall', lat: 30.0279, lng: 31.2104, geofenceRadiusMeters: 100 },
  { id: 'r5', name: 'modarag 10', building: 'Math Building', lat: 30.0280, lng: 31.2105, geofenceRadiusMeters: 50 },
];
