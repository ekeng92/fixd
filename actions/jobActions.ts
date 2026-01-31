'use server';

import { collection, addDoc, serverTimestamp, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { JobInput, JobStatus, Job, Bid } from '@/types';
import { notifyFixersOfNewJob, notifyBidAcceptance } from '@/lib/notifications';

/**
 * Server Action to create a new job with SMS notifications
 */
export async function createJob(
  brokerId: string,
  jobData: JobInput
): Promise<{ success: boolean; jobId?: string; error?: string }> {
  try {
    // Validate input
    if (!jobData.title || !jobData.description || !jobData.zipCode || !jobData.privateAddress) {
      return {
        success: false,
        error: 'All job fields are required',
      };
    }

    // Starting price can be null (open to offers) or a positive number
    if (jobData.startingPrice !== null && jobData.startingPrice <= 0) {
      return {
        success: false,
        error: 'Starting price must be greater than 0 or left open',
      };
    }

    // Prepare job document
    const jobDoc = {
      brokerId,
      title: jobData.title.trim(),
      description: jobData.description.trim(),
      photos: jobData.photos || [],
      zipCode: jobData.zipCode.trim(),
      privateAddress: jobData.privateAddress.trim(),
      startingPrice: jobData.startingPrice,
      isPrivate: jobData.isPrivate || false,
      invitedFixers: jobData.invitedFixers || [],
      status: 'open' as JobStatus,
      winnerId: null,
      winningBidAmount: null,
      createdAt: serverTimestamp(),
    };

    // Add job to Firestore
    const jobsCollection = collection(db, 'jobs');
    const docRef = await addDoc(jobsCollection, jobDoc);

    const jobId = docRef.id;

    // Prepare job object for notification
    const jobForNotification: Job = {
      id: jobId,
      ...jobDoc,
      createdAt: new Date(),
    };

    // Send SMS notifications to verified fixers (async, don't wait)
    // If private, only notify invited fixers
    notifyFixersOfNewJob(jobForNotification).catch((err: Error) => {
      console.error('Error sending notifications:', err);
    });

    return {
      success: true,
      jobId,
    };
  } catch (error) {
    console.error('Error creating job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create job',
    };
  }
}

/**
 * Server Action to submit a bid
 */
export async function submitBid(bidData: {
  jobId: string;
  fixerId: string;
  fixerName: string;
  amount: number;
  message: string;
}): Promise<{ success: boolean; bidId?: string; error?: string }> {
  try {
    // Validate input
    if (!bidData.jobId || !bidData.fixerId || !bidData.fixerName) {
      return {
        success: false,
        error: 'Job ID, Fixer ID, and Fixer Name are required',
      };
    }

    if (bidData.amount <= 0) {
      return {
        success: false,
        error: 'Bid amount must be greater than 0',
      };
    }

    // Prepare bid document
    const bidDoc = {
      jobId: bidData.jobId,
      fixerId: bidData.fixerId,
      fixerName: bidData.fixerName.trim(),
      amount: bidData.amount,
      message: bidData.message.trim(),
      createdAt: serverTimestamp(),
    };

    // Add bid to Firestore
    const bidsCollection = collection(db, 'bids');
    const docRef = await addDoc(bidsCollection, bidDoc);

    return {
      success: true,
      bidId: docRef.id,
    };
  } catch (error) {
    console.error('Error creating bid:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create bid',
    };
  }
}

/**
 * Server Action to accept a bid
 */
export async function acceptBid(jobId: string, bidId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Get the job
    const jobRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDocs(query(collection(db, 'jobs'), where('id', '==', jobId)));

    if (jobSnap.empty) {
      return {
        success: false,
        error: 'Job not found',
      };
    }

    const jobDoc = jobSnap.docs[0];
    const job = { id: jobDoc.id, ...jobDoc.data() } as Job;

    // Get the winning bid
    const bidSnap = await getDocs(query(collection(db, 'bids'), where('__name__', '==', bidId)));

    if (bidSnap.empty) {
      return {
        success: false,
        error: 'Bid not found',
      };
    }

    const bidDoc = bidSnap.docs[0];
    const bid = { id: bidDoc.id, ...bidDoc.data() } as Bid;

    // Get all bids for this job
    const allBidsSnap = await getDocs(
      query(collection(db, 'bids'), where('jobId', '==', jobId))
    );
    const allBids = allBidsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Bid[];

    // Update job status
    await updateDoc(jobRef, {
      status: 'accepted',
      winnerId: bid.fixerId,
      updatedAt: serverTimestamp(),
    });

    // Send SMS notifications (async)
    notifyBidAcceptance(job, bid, allBids).catch((err: Error) => {
      console.error('Error sending acceptance notifications:', err);
    });

    return { success: true };
  } catch (error) {
    console.error('Error accepting bid:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to accept bid',
    };
  }
}

/**
 * Get all jobs posted by a specific broker
 */
export async function getJobsByBroker(brokerId: string): Promise<Job[]> {
  try {
    const jobsCollection = collection(db, 'jobs');
    const q = query(jobsCollection, where('brokerId', '==', brokerId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Job[];
  } catch (error) {
    console.error('Error getting jobs by broker:', error);
    return [];
  }
}

/**
 * Update job status
 */
export async function updateJobStatus(
  jobId: string,
  status: JobStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const jobRef = doc(db, 'jobs', jobId);

    await updateDoc(jobRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating job status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update job status',
    };
  }
}

/**
 * Update job details
 */
export async function updateJob(
  jobId: string,
  updates: Partial<JobInput>
): Promise<{ success: boolean; error?: string }> {
  try {
    const jobRef = doc(db, 'jobs', jobId);

    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    if (updates.title) updateData.title = updates.title.trim();
    if (updates.description) updateData.description = updates.description.trim();
    if (updates.photos) updateData.photos = updates.photos;
    if (updates.zipCode) updateData.zipCode = updates.zipCode.trim();
    if (updates.privateAddress) updateData.privateAddress = updates.privateAddress.trim();
    if (updates.startingPrice !== undefined) updateData.startingPrice = updates.startingPrice;
    if (updates.isPrivate !== undefined) updateData.isPrivate = updates.isPrivate;
    if (updates.invitedFixers) updateData.invitedFixers = updates.invitedFixers;

    await updateDoc(jobRef, updateData);

    return { success: true };
  } catch (error) {
    console.error('Error updating job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update job',
    };
  }
}

/**
 * Cancel a job
 */
export async function cancelJob(jobId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const jobRef = doc(db, 'jobs', jobId);

    await updateDoc(jobRef, {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel job',
    };
  }
}


