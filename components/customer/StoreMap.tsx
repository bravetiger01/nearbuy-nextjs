'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { STORES } from '../../lib/data';

// Dynamically import map components because they require window/document to exist
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function StoreMap() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Need to fix leaflet default icon issue in React
  useEffect(() => {
    setIsMounted(true);
    // Dynamic import to avoid SSR issues with Leaflet
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    });
  }, []);

  if (!isMounted) return <div style={{ height: 400, background: 'var(--lav-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>;

  // Vasad Coordinates (approx)
  const position: [number, number] = [22.4645, 73.0768];

  const handleMarkerClick = (storeName: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeName + ' Vasad')}`;
    window.open(url, '_blank');
  };

  return (
    <section style={{ padding: '60px 16px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ color: 'var(--lav-600)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 8 }}>LIVE RADAR</div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore Vasad</h2>
        </div>
        
        <div style={{ height: 500, borderRadius: 'var(--r)', overflow: 'hidden', border: 'var(--brd)', boxShadow: 'var(--shadow-lg)' }}>
          <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {STORES.map((store, i) => {
              // Add a slight variance to coordinates to separate them if they overlap
              const lat = position[0] + (Math.random() - 0.5) * 0.01;
              const lng = position[1] + (Math.random() - 0.5) * 0.01;
              
              return (
                <Marker key={store.id} position={[lat, lng]}>
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 800 }}>{store.name}</h3>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--gray-500)' }}>{store.category} • {store.rating} ★</p>
                      <button 
                        onClick={() => handleMarkerClick(store.name)}
                        style={{ background: 'var(--lav-500)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        View on Google Maps
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
