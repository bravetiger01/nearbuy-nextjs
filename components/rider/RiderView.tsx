'use client';

import { useEffect, useState } from 'react';
import { useApp } from '../../lib/store-context';
import { DeliveryJob } from '../../lib/types';
import RiderHeader from './RiderHeader';
import AvailableJobs from './AvailableJobs';
import RiderBottomNav from './RiderBottomNav';
import dynamic from 'next/dynamic';

const ActiveDelivery = dynamic(() => import('./ActiveDelivery'), {
  ssr: false,
});

import RiderProfile from './RiderProfile';
import RiderLogin from './RiderLogin';

export default function RiderView() {
  const { isRider, riderJobs, riderLoading, loadRiderJobs } = useApp();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'profile'>('jobs');
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [activeJob, setActiveJob] = useState<DeliveryJob | null>(null);

  useEffect(() => {
    if (isRider) loadRiderJobs();
  }, [isRider, loadRiderJobs]);

  useEffect(() => {
    setJobs(riderJobs.filter((j) => j.id !== activeJob?.id));
  }, [riderJobs, activeJob?.id]);

  if (!isRider) return <RiderLogin />;

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
            loading={riderLoading}
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
