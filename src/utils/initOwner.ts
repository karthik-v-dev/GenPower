import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../services/firebase.service';
import { User, UserRole } from '../types';
import { FIREBASE_COLLECTIONS } from '../constants';

/**
 * Initialize the owner account
 * This should be run once to create the owner account
 * 
 * Owner Details:
 * Email: voorugondakarthik@gmail.com
 * Password: Karthi@506329
 * Phone: +91 9866007477
 */
export async function initializeOwner(): Promise<void> {
  const ownerData = {
    email: 'voorugondakarthik@gmail.com',
    password: 'Karthi@506329',
    firstName: 'Karthik',
    lastName: 'Voorugonda',
    phone: '+91 9866007477',
    address: '#18-7-123, Ashok Nagar, Kareemabad',
    city: 'Warangal',
    state: 'Telangana',
    zipCode: '506002',
    country: 'India',
  };

  try {
    console.log('Creating owner account...');
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ownerData.email,
      ownerData.password
    );

    console.log('Owner Firebase Auth account created:', userCredential.user.uid);

    // Create user document in database
    const user: User = {
      id: userCredential.user.uid,
      email: ownerData.email,
      role: UserRole.OWNER,
      firstName: ownerData.firstName,
      lastName: ownerData.lastName,
      phone: ownerData.phone,
      address: ownerData.address,
      city: ownerData.city,
      state: ownerData.state,
      zipCode: ownerData.zipCode,
      country: ownerData.country,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await set(ref(database, `${FIREBASE_COLLECTIONS.USERS}/${user.id}`), user);

    console.log('✅ Owner account created successfully!');
    console.log('Email:', ownerData.email);
    console.log('Password:', ownerData.password);
    console.log('Role: Owner');
    
  } catch (error) {
    if ((error as any).code === 'auth/email-already-in-use') {
      console.log('ℹ️  Owner account already exists');
    } else {
      console.error('❌ Error creating owner account:', error);
      throw error;
    }
  }
}

// To run this function, import it in your component and call it
// or create a separate initialization page
