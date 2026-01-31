import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  limit,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Job, Bid, JobStatus } from '@/types';

/**
 * Fetch all jobs from Firestore
 * @param limitCount - Optional limit on number of jobs to fetch
 * @returns Array of Job objects
 */
export async function getAllJobs(limitCount?: number): Promise<Job[]> {
  try {
    const jobsRef = collection(db, 'jobs');
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    const q = query(jobsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Job[];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

/**
 * Fetch jobs by status
 * @param status - Job status to filter by
 * @param limitCount - Optional limit on number of jobs to fetch
 * @returns Array of Job objects
 */
export async function getJobsByStatus(
  status: JobStatus,
  limitCount?: number
): Promise<Job[]> {
  try {
    const jobsRef = collection(db, 'jobs');
    const constraints: QueryConstraint[] = [
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
    ];

    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    const q = query(jobsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Job[];
  } catch (error) {
    console.error('Error fetching jobs by status:', error);
    return [];
  }
}

/**
 * Fetch a single job by ID
 * @param jobId - The job document ID
 * @returns Job object or null if not found
 */
export async function getJobById(jobId: string): Promise<Job | null> {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDoc(jobRef);

    if (jobSnap.exists()) {
      return {
        id: jobSnap.id,
        ...jobSnap.data(),
      } as Job;
    }

    return null;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

/**
 * Fetch all bids for a specific job
 * @param jobId - The job document ID
 * @returns Array of Bid objects
 */
export async function getBidsByJobId(jobId: string): Promise<Bid[]> {
  try {
    const bidsRef = collection(db, 'bids');
    const q = query(
      bidsRef,
      where('jobId', '==', jobId),
      orderBy('amount', 'asc') // Lowest bids first
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Bid[];
  } catch (error) {
    console.error('Error fetching bids:', error);
    return [];
  }
}

/**
 * Fetch all bids from a specific fixer
 * @param fixerId - The fixer's user ID
 * @returns Array of Bid objects
 */
export async function getBidsByFixerId(fixerId: string): Promise<Bid[]> {
  try {
    const bidsRef = collection(db, 'bids');
    const q = query(
      bidsRef,
      where('fixerId', '==', fixerId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Bid[];
  } catch (error) {
    console.error('Error fetching bids by fixer:', error);
    return [];
  }
}
