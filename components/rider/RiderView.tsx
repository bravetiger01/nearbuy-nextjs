'use client';

import { useState } from 'react';
import { useApp } from '../../lib/store-context';
import { DeliveryJob } from '../../lib/types';
import RiderHeader from './RiderHeader';
import AvailableJobs from './AvailableJobs';
import RiderBottomNav from './RiderBottomNav';
import dynamic from 'next/dynamic';

const ActiveDelivery = dynamic(() => import('./ActiveDelivery'), {
  ssr: false,
});

const MOCK_JOBS: DeliveryJob[] = [
  {
    id: 'job-1',
    shopName: 'SVIT Stationery Mart',
    shopAddress: 'SVIT Campus, Vasad',
    customerAddress: 'Hostel Block A, Room 102',
    distanceKm: 1.2,
    fee: 30,
    status: 'available',
    shopCoords: [22.4674, 73.0763],
    customerCoords: [22.4700, 73.0790],
  },
  {
    id: 'job-2',
    shopName: 'Campus Electronics',
    shopAddress: 'Main Gate, SVIT',
    customerAddress: 'Hostel Block C, Room 304',
    distanceKm: 2.5,
    fee: 45,
    status: 'available',
    shopCoords: [22.4650, 73.0800],
    customerCoords: [22.4600, 73.0850],
  },
];

export default function RiderView() {
  const { isRider } = useApp();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'map' | 'profile'>('jobs');
  const [jobs, setJobs] = useState<DeliveryJob[]>(MOCK_JOBS);
  const [activeJob, setActiveJob] = useState<DeliveryJob | null>(null);

  if (!isRider) return null;

  const handleAcceptJob = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const updatedJob = { ...job, status: 'accepted' as const };
      setActiveJob(updatedJob);
      setJobs(jobs.filter((j) => j.id !== jobId));
      setActiveTab('map');
    }
  };

  const handleUpdateJobStatus = (status: DeliveryJob['status']) => {
    if (activeJob) {
      if (status === 'delivered') {
        setActiveJob(null);
        setActiveTab('jobs');
      } else {
        setActiveJob({ ...activeJob, status });
      }
    }
  };

  return (
    <div
      className="rider-view"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        maxWidth: '100%',
        backgroundColor: 'var(--bg)',
        color: 'var(--fg)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <RiderHeader isOnline={isOnline} setIsOnline={setIsOnline} />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px' }}>
        {activeTab === 'jobs' && !activeJob && (
          <AvailableJobs
            isOnline={isOnline}
            jobs={jobs}
            onAcceptJob={handleAcceptJob}
          />
        )}
        
        {(activeTab === 'map' || activeJob) && activeJob && (
          <ActiveDelivery
            job={activeJob}
            onUpdateStatus={handleUpdateJobStatus}
          />
        )}

        {activeTab === 'jobs' && activeJob && (
           <div style={{ padding: 20, textAlign: 'center', color: 'var(--gray-500)' }}>
             You have an active delivery in progress. Check the Map tab.
           </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ padding: 20 }}>
            <h2>Rider Profile</h2>
            <p style={{ color: 'var(--gray-500)', marginTop: 10 }}>Earnings: ₹1250 today</p>
            <p style={{ color: 'var(--gray-500)', marginTop: 10 }}>Deliveries: 15</p>
            <p style={{ color: 'var(--gray-500)', marginTop: 10 }}>Rating: 4.8 ⭐</p>
          </div>
        )}
      </div>

      <RiderBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
