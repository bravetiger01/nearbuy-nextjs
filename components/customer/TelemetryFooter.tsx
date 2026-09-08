'use client';

export default function TelemetryFooter() {
  return (
    <section style={{ padding: '0 20px', marginBottom: '80px' }}>
      <div style={{ backgroundColor: '#2b2d31', padding: '16px', border: '4px solid #000' }}>
        <div style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 800, textAlign: 'center', letterSpacing: '0.05em', marginBottom: '8px' }}>
          [ ROUTING TELEMETRY ]<br/>
          Connected to Matrix Hub H00 - Node Latency: 18ms
        </div>
        <button style={{ 
          width: '100%', 
          backgroundColor: '#9b8fe3', 
          border: '2px solid #000', 
          padding: '12px', 
          fontWeight: 900, 
          fontSize: '0.8rem',
          cursor: 'pointer'
        }}>
          EXPAND FULL CITY RADAR GRID
        </button>
      </div>
    </section>
  );
}
