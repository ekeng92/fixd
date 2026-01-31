import { Timestamp } from 'firebase/firestore';

/**
 * User roles
 */
export type UserRole = 'broker' | 'fixer';

/**
 * User document interface
 */
export interface User {
  id?: string;
  uid: string;
  phoneNumber: string;
  role: UserRole;
  name: string;
  isVerified: boolean;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

/**
 * User input interface
 */
export interface UserInput {
  phoneNumber: string;
  role: UserRole;
  name: string;
}

/**
 * Job status enum
 */
export type JobStatus = 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Job document interface
 */
export interface Job {
  id: string;
  brokerId: string;
  brokerName?: string;
  title: string;
  description: string;
  photos: string[];
  zipCode: string;
  privateAddress: string;
  startingPrice: number | null; // null means "Open to offers"
  isPrivate: boolean; // If true, only invited fixers can see/bid
  invitedFixers?: string[]; // Array of fixer IDs who can see private jobs
  status: JobStatus;
  winnerId?: string | null;
  winningBidAmount?: number | null;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

/**
 * Job input interface
 */
export interface JobInput {
  title: string;
  description: string;
  photos: string[];
  zipCode: string;
  privateAddress: string;
  startingPrice: number | null; // null = "Open to offers"
  isPrivate?: boolean;
  invitedFixers?: string[];
}

/**
 * Bid document interface
 */
export interface Bid {
  id?: string;
  jobId: string;
  fixerId: string;
  fixerName: string;
  amount: number;
  message: string;
  createdAt: Timestamp | Date;
}

/**
 * Bid input interface
 */
export interface BidInput {
  jobId: string;
  fixerId: string;
  fixerName: string;
  amount: number;
  message: string;
}
