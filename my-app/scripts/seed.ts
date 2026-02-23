import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import mock data
import { mockUsers } from '../src/data/mockUsers.ts';
import { mockCourses } from '../src/data/mockCourses.ts';
import { mockClassrooms } from '../src/data/mockClassrooms.ts';
import { mockDepartments } from '../src/data/mockDepartments.ts';
import { mockSessions, mockCheckIns } from '../src/data/mockSessions.ts';

const serviceAccountPath = path.join(__dirname, '../src/assets/service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();

async function seed() {
  console.log('Starting seed...');

  // 1. Seed Departments
  console.log('Seeding departments...');
  for (const dept of mockDepartments) {
    await db.collection('departments').doc(dept.id).set(dept);
  }

  // 2. Seed Classrooms
  console.log('Seeding classrooms...');
  for (const room of mockClassrooms) {
    await db.collection('classrooms').doc(room.id).set(room);
  }

  // 3. Seed Users (Auth and Firestore)
  console.log('Seeding users...');
  for (const user of mockUsers) {
    try {
      // Create Auth user
      const userRecord = await auth.createUser({
        uid: user.id,
        email: user.email,
        password: 'password123', // Default password
        displayName: user.name,
      });
      console.log(`Created auth user: ${userRecord.email}`);
    } catch (error: any) {
      if (error.code === 'auth/uid-already-exists' || error.code === 'auth/email-already-exists') {
        console.log(`User already exists: ${user.email}`);
      } else {
        console.error(`Error creating auth user ${user.email}:`, error.message);
      }
    }

    // Always ensure Firestore record is up to date
    await db.collection('users').doc(user.id).set({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  }

  // 4. Seed Courses
  console.log('Seeding courses...');
  for (const course of mockCourses) {
    await db.collection('courses').doc(course.id).set(course);
  }

  // 5. Seed Sessions
  console.log('Seeding sessions...');
  for (const session of mockSessions) {
    await db.collection('sessions').doc(session.id).set(session);
  }

  // 6. Seed Check-ins
  console.log('Seeding check-ins...');
  for (const checkIn of mockCheckIns) {
    await db.collection('checkIns').doc(checkIn.id).set(checkIn);
  }

  console.log('Seeding completed successfully!');
}

seed().catch(console.error);
