'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Bid } from '@/types';

interface LiveBidBoardProps {
  jobId: string;
  onBidAccept?: (bidId: string) => void;
  showAcceptButton?: boolean;
}

export default function LiveBidBoard({ jobId, onBidAccept, showAcceptButton = false }: LiveBidBoardProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBidAlert, setNewBidAlert] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    try {
      const bidsCollection = collection(db, 'bids');
      const q = query(
        bidsCollection,
        where('jobId', '==', jobId),
        orderBy('amount', 'asc')
      );

      let previousCount = 0;

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bidList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Bid[];

        // Flash animation when new bid arrives
        if (previousCount > 0 && snapshot.size > previousCount) {
          setNewBidAlert(true);
          setTimeout(() => setNewBidAlert(false), 2000);
        }

        previousCount = snapshot.size;
        setBids(bidList);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up bid board:', error);
      setIsLoading(false);
    }
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 h-16 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const lowestBid = bids.length > 0 ? bids[0] : null;

  return (
    <div className="space-y-4">
      {/* Live Badge */}
      <div className={`transition-all ${newBidAlert ? 'scale-105' : 'scale-100'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          <span className="font-semibold text-sm">LIVE: {bids.length} {bids.length === 1 ? 'bid' : 'bids'}</span>
        </div>
      </div>

      {/* Bids List */}
      {bids.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No bids yet. Share this job with fixers!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bids.map((bid, index) => (
            <BidRow
              key={bid.id}
              bid={bid}
              isLowest={index === 0}
              showAcceptButton={showAcceptButton}
              onAccept={() => onBidAccept?.(bid.id || '')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BidRow({
  bid,
  isLowest,
  showAcceptButton,
  onAccept,
}: {
  bid: Bid;
  isLowest: boolean;
  showAcceptButton: boolean;
  onAccept: () => void;
}) {
  const bidDate = bid.createdAt instanceof Date ? bid.createdAt : bid.createdAt.toDate();
  const timeAgo = getTimeAgo(bidDate);

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isLowest
          ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-700'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 dark:text-white">{bid.fixerName}</h3>
            {isLowest && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                LOWEST
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{bid.message}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800 dark:text-white">${bid.amount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</p>
        </div>
      </div>

      {showAcceptButton && (
        <button
          onClick={onAccept}
          className="w-full mt-3 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          Accept This Bid
        </button>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
