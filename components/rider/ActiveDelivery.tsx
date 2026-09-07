'use client';

import { DeliveryJob } from '../../lib/types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Fix for default marker icons in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function RoutingMachine({ start, end }: { start: [number, number]; end: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const routingControl = L.Routing.control({
      plan: L.Routing.plan([L.latLng(start[0], start[1]), L.latLng(end[0], end[1])], {
        createMarker: () => false, // Return false to disable default markers
      }),
      routeWhileDragging: false,
      addWaypoints: false,
      show: false, // hide instructions
      lineOptions: {
        styles: [{ color: '#8b5cf6', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
      fitSelectedRoutes: true,
    } as L.Routing.RoutingControlOptions).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
}

export default function ActiveDelivery({
  job,
  onUpdateStatus,
}: {
  job: DeliveryJob;
  onUpdateStatus: (status: DeliveryJob['status']) => void;
}) {
  const isAccepted = job.status === 'accepted';
  const isPickedUp = job.status === 'picked_up';

  // Mock Rider Location (starts somewhere nearby)
  const riderCoords: [number, number] = [22.4680, 73.0750];
  const shopCoords = job.shopCoords || [22.4674, 73.0763];
  const customerCoords = job.customerCoords || [22.4700, 73.0790];

  const startCoords = isAccepted ? riderCoords : shopCoords;
  const endCoords = isAccepted ? shopCoords : customerCoords;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Map Area */}
      <div style={{ flex: 1, backgroundColor: '#e5e7eb', position: 'relative', zIndex: 0 }}>
        {/* We use standard react-leaflet MapContainer */}
        <MapContainer
          center={startCoords}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <RoutingMachine start={startCoords} end={endCoords} />

          <Marker position={startCoords}>
            <Popup>{isAccepted ? 'You (Rider)' : 'Shop'}</Popup>
          </Marker>
          <Marker position={endCoords}>
            <Popup>{isAccepted ? 'Shop (Pickup)' : 'Customer (Drop-off)'}</Popup>
          </Marker>
        </MapContainer>

        {/* Status Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 15,
            left: 15,
            right: 15,
            backgroundColor: 'var(--white)',
            padding: '10px 15px',
            borderRadius: 8,
            boxShadow: 'var(--shadow)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: isAccepted ? 'var(--lav-500)' : '#10B981',
            }}
          />
          <div style={{ fontWeight: 600 }}>
            {isAccepted ? 'Head to pickup location' : 'Deliver to customer'}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div
        style={{
          backgroundColor: 'var(--white)',
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          boxShadow: '0 -4px 15px rgba(0,0,0,0.1)',
          zIndex: 10,
          marginTop: -15,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Total Earnings</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>₹{job.fee}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Distance left</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--lav-700)' }}>
              {isAccepted ? `${job.distanceKm} km` : '0.5 km'}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 5 }}>
            {isAccepted ? 'Pickup At:' : 'Deliver To:'}
          </div>
          <div style={{ fontWeight: 600 }}>{isAccepted ? job.shopName : 'Customer'}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
            {isAccepted ? job.shopAddress : job.customerAddress}
          </div>
        </div>

        {isAccepted && (
          <button
            onClick={() => onUpdateStatus('picked_up')}
            style={{
              width: '100%',
              padding: 15,
              backgroundColor: 'var(--black)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            I&apos;ve Picked Up the Order
          </button>
        )}

        {isPickedUp && (
          <button
            onClick={() => onUpdateStatus('delivered')}
            style={{
              width: '100%',
              padding: 15,
              backgroundColor: '#10B981',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Mark as Delivered
          </button>
        )}
      </div>
    </div>
  );
}
