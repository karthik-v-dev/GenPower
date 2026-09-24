import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration with environment variables and reliable fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD9nZ144Bl21Q-YjbDPyTq2BE80N7idO6k',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'genpower-46b1a.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://genpower-46b1a-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'genpower-46b1a',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'genpower-46b1a.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '932243642864',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:932243642864:web:8c3a92533312340430a535',
};

class FirebaseService {
  private app: FirebaseApp;
  public auth: Auth;
  public database: Database;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.database = getDatabase(this.app);
  }

  getApp(): FirebaseApp {
    return this.app;
  }

  getAuth(): Auth {
    return this.auth;
  }

  getDatabase(): Database {
    return this.database;
  }
}

export const firebaseService = new FirebaseService();
export const auth = firebaseService.getAuth();
export const database = firebaseService.getDatabase();
