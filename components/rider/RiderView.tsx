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
  const { isRider, riderJobs, riderLoading, loadRiderJobs, supabase } = useApp();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'profile'>('jobs');
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [activeJob, setActiveJob] = useState<DeliveryJob | null>(null);

  useEffect(() => {
    if (isRider) loadRiderJobs();
  }, [isRider, loadRiderJobs]);

  useEffect(() => {
    if (!isRider || !isOnline) return;
    const timer = setInterval(() => {
      loadRiderJobs();
    }, 10000);
    return () => clearInterval(timer);
  }, [isRider, isOnline, loadRiderJobs]);

  useEffect(() => {
    setJobs(riderJobs.filter((j) => j.id !== activeJob?.id));
  }, [riderJobs, activeJob?.id]);

  if (!isRider) return <RiderLogin />;

  const handleAcceptJob = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const updatedJob = { ...job, status: 'accepted' as const };
      setActiveJob(updatedJob);
      setJobs(jobs.filter((j) => j.id !== jobId));
      setActiveTab('jobs');

      if (supabase && !jobId.startsWith('shop-')) {
        try {
          await supabase
            .from('deliveries')
            .update({ status: 'rider_assigned' })
            .eq('order_id', jobId);
        } catch (e) {
          console.error('[RiderView] accept error:', e);
        }
      }
    }
  };

  const handleUpdateJobStatus = async (status: DeliveryJob['status']) => {
    if (activeJob) {
      if (status === 'delivered') {
        if (supabase && !activeJob.id.startsWith('shop-')) {
          try {
            await supabase
              .from('deliveries')
              .update({ status: 'delivered' })
              .eq('order_id', activeJob.id);
            await supabase
              .from('orders')
              .update({ status: 'delivered', payment_status: 'paid' })
              .eq('id', activeJob.id);
          } catch (e) {
            console.error('[RiderView] deliver error:', e);
          }
        }
        setActiveJob(null);
        setActiveTab('jobs');
        loadRiderJobs();
      } else {
        if (supabase && !activeJob.id.startsWith('shop-') && status === 'picked_up') {
          try {
            await supabase
              .from('deliveries')
              .update({ status: 'out_for_delivery' })
              .eq('order_id', activeJob.id);
            await supabase
              .from('orders')
              .update({ status: 'out_for_delivery' })
              .eq('id', activeJob.id);
          } catch (e) {
            console.error('[RiderView] pickup error:', e);
          }
        }
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
