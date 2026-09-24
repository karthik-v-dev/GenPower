import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration will be provided by environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
