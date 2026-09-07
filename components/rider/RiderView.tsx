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

import RiderProfile from './RiderProfile';

export default function RiderView() {
  const { isRider } = useApp();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'profile'>('jobs');
  const [jobs, setJobs] = useState<DeliveryJob[]>(MOCK_JOBS);
  const [activeJob, setActiveJob] = useState<DeliveryJob | null>(null);

  if (!isRider) return null;

  const handleAcceptJob = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const updatedJob = { ...job, status: 'accepted' as const };
      setActiveJob(updatedJob);
      setJobs(jobs.filter((j) => j.id !== jobId));
      setActiveTab('jobs');
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
        backgroundColor: '#fff',
        color: '#000',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'monospace',
      }}
    >
      <RiderHeader isOnline={isOnline} setIsOnline={setIsOnline} />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'jobs' && !activeJob && (
          <AvailableJobs
            isOnline={isOnline}
            jobs={jobs}
            onAcceptJob={handleAcceptJob}
          />
        )}
        
        {activeTab === 'jobs' && activeJob && (
          <ActiveDelivery
            job={activeJob}
            onUpdateStatus={handleUpdateJobStatus}
          />
        )}

        {activeTab === 'profile' && (
          <RiderProfile />
        )}
      </div>

      <RiderBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
