'use client';

import { DeliveryJob } from '../../lib/types';

export default function AvailableJobs({
  isOnline,
  jobs,
  onAcceptJob,
}: {
  isOnline: boolean;
  jobs: DeliveryJob[];
  onAcceptJob: (id: string) => void;
}) {
  if (!isOnline) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-500)' }}>
        <p>You are currently offline.</p>
        <p style={{ fontSize: '0.9rem' }}>Go online to see available deliveries.</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-500)' }}>
        <p>No delivery requests nearby right now.</p>
        <div className="spinner" style={{ margin: '20px auto' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 15, display: 'flex', flexDirection: 'column', gap: 15 }}>
      <h2 style={{ margin: 0, fontSize: '1.2rem', marginBottom: 5 }}>New Requests</h2>
      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            backgroundColor: 'var(--white)',
            borderRadius: 12,
            padding: 15,
            border: 'var(--brd)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>₹{job.fee}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Total Earnings</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, color: 'var(--lav-700)' }}>{job.distanceKm} km</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Total Distance</div>
            </div>
          </div>

          <div style={{ position: 'relative', paddingLeft: 20, marginBottom: 15 }}>
            <div
              style={{
                position: 'absolute',
                left: 4,
                top: 4,
                bottom: 4,
                width: 2,
                backgroundColor: 'var(--gray-200)',
              }}
            />
            <div style={{ marginBottom: 10, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: -20,
                  top: 4,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'var(--lav-500)',
                }}
              />
              <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{job.shopName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{job.shopAddress}</div>
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: -20,
                  top: 4,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                }}
              />
              <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Customer Drop-off</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{job.customerAddress}</div>
            </div>
          </div>

          <button
            onClick={() => onAcceptJob(job.id)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--lav-600)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Accept Delivery
          </button>
        </div>
      ))}
    </div>
  );
}
