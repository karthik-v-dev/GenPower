import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from './firebase.service';
import { User, RegisterData, LoginCredentials, UserRole } from '../types';
import { FIREBASE_COLLECTIONS } from '../constants';

class AuthService {
  async register(data: RegisterData): Promise<User> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user: User = {
        id: userCredential.user.uid,
        email: data.email,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await set(ref(database, `${FIREBASE_COLLECTIONS.USERS}/${user.id}`), user);

      return user;
    } catch (error) {
      throw new Error(`Registration failed: ${(error as Error).message}`);
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const userSnapshot = await get(
        ref(database, `${FIREBASE_COLLECTIONS.USERS}/${userCredential.user.uid}`)
      );

      if (!userSnapshot.exists()) {
        throw new Error('User data not found');
      }

      return userSnapshot.val() as User;
    } catch (error) {
      throw new Error(`Login failed: ${(error as Error).message}`);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Logout failed: ${(error as Error).message}`);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return null;
      }

      const userSnapshot = await get(
        ref(database, `${FIREBASE_COLLECTIONS.USERS}/${currentUser.uid}`)
      );

      if (!userSnapshot.exists()) {
        return null;
      }

      return userSnapshot.val() as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
