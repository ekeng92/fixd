'use server';

import { collection, query, where, getDocs, getDoc, doc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, UserInput, UserRole } from '@/types';

/**
 * Create a new user in Firestore
 */
export async function createUser(userInput: UserInput & { uid: string }): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const { uid, phoneNumber, role, name } = userInput;

    // Check if user already exists
    const existing = await getUserByPhone(phoneNumber);
    if (existing) {
      return {
        success: false,
        error: 'User with this phone number already exists',
      };
    }

    // Create user document
    const userDoc = {
      uid,
      phoneNumber,
      role,
      name: name.trim(),
      isVerified: false, // Fixers need admin approval
      createdAt: serverTimestamp(),
    };

    const usersCollection = collection(db, 'users');
    const docRef = await addDoc(usersCollection, userDoc);

    return {
      success: true,
      user: {
        id: docRef.id,
        ...userDoc,
        createdAt: new Date(),
      } as User,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user',
    };
  }
}

/**
 * Get user by phone number
 */
export async function getUserByPhone(phoneNumber: string): Promise<User | null> {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('phoneNumber', '==', phoneNumber));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      uid: data.uid,
      phoneNumber: data.phoneNumber,
      role: data.role,
      name: data.name,
      isVerified: data.isVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as User;
  } catch (error) {
    console.error('Error getting user by phone:', error);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const data = userSnap.data();
    return {
      id: userSnap.id,
      uid: data.uid,
      phoneNumber: data.phoneNumber,
      role: data.role,
      name: data.name,
      isVerified: data.isVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as User;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

/**
 * Get all verified fixers
 */
export async function getVerifiedFixers(): Promise<User[]> {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(
      usersCollection,
      where('role', '==', 'fixer'),
      where('isVerified', '==', true)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid,
        phoneNumber: data.phoneNumber,
        role: data.role,
        name: data.name,
        isVerified: data.isVerified,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as User;
    });
  } catch (error) {
    console.error('Error getting verified fixers:', error);
    return [];
  }
}

/**
 * Verify a fixer (admin action)
 */
export async function verifyFixer(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      isVerified: true,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error verifying fixer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify fixer',
    };
  }
}

/**
 * Unverify a fixer (admin action)
 */
export async function unverifyFixer(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      isVerified: false,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error unverifying fixer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unverify fixer',
    };
  }
}

/**
 * Get all unverified fixers (admin view)
 */
export async function getUnverifiedFixers(): Promise<User[]> {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(
      usersCollection,
      where('role', '==', 'fixer'),
      where('isVerified', '==', false)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid,
        phoneNumber: data.phoneNumber,
        role: data.role,
        name: data.name,
        isVerified: data.isVerified,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as User;
    });
  } catch (error) {
    console.error('Error getting unverified fixers:', error);
    return [];
  }
}
