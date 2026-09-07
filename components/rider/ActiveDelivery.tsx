'use client';

import { DeliveryJob } from '../../lib/types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

// Brutalist custom icons
const createPinIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="display: flex; justify-content: center; align-items: center;">
      <svg width="36" height="48" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(4px 4px 0px #000);">
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 21 12 34 12 34C12 34 22 21 22 12C22 6.47715 17.5228 2 12 2Z" fill="${color}" stroke="#000" stroke-width="2.5"/>
        <circle cx="12" cy="12" r="4" fill="#fff" stroke="#000" stroke-width="2.5"/>
      </svg>
    </div>`,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48],
  });
};

const riderMarkerIcon = createPinIcon('#ffea00');
const pickupMarkerIcon = createPinIcon('#ff69b4'); // Pink
const dropoffMarkerIcon = createPinIcon('#3b82f6'); // Blue

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
        styles: [{ color: '#000', weight: 5 }],
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

  const [riderLocation, setRiderLocation] = useState<[number, number]>([22.4680, 73.0750]);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setRiderLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Error getting location", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const shopCoords = job.shopCoords || [22.4674, 73.0763];
  const customerCoords = job.customerCoords || [22.4700, 73.0790];

  const startCoords = riderLocation;
  const endCoords = isAccepted ? shopCoords : customerCoords;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'monospace' }}>
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
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <RoutingMachine start={startCoords} end={endCoords} />

          <Marker position={startCoords} icon={riderMarkerIcon}>
            <Popup>You (Rider)</Popup>
          </Marker>
          <Marker position={endCoords} icon={isAccepted ? pickupMarkerIcon : dropoffMarkerIcon}>
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
            backgroundColor: '#fff',
            padding: '10px 15px',
            border: '3px solid #000',
            boxShadow: '4px 4px 0px #000',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: isAccepted ? '#000' : '#10B981',
              border: '2px solid #000',
            }}
          />
          <div style={{ fontWeight: 900, textTransform: 'uppercase' }}>
            {isAccepted ? 'HEAD TO PICKUP LOCATION' : 'DELIVER TO CUSTOMER'}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: 20,
          borderTop: '4px solid #000',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
          <div>
            <div style={{ fontWeight: 900, textTransform: 'uppercase' }}>EARNINGS</div>
            <div style={{ fontWeight: 900, fontSize: '1.5rem' }}>₹{job.fee}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 900, textTransform: 'uppercase' }}>DISTANCE</div>
            <div style={{ fontWeight: 900, fontSize: '1.5rem' }}>
              {isAccepted ? `${job.distanceKm} KM` : '0.5 KM'}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: 5 }}>
            {isAccepted ? 'PICKUP AT:' : 'DELIVER TO:'}
          </div>
          <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>{isAccepted ? job.shopName : 'CUSTOMER'}</div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
            {isAccepted ? job.shopAddress : job.customerAddress}
          </div>
        </div>

        {isAccepted && (
          <button
            onClick={() => onUpdateStatus('picked_up')}
            style={{
              width: '100%',
              padding: 15,
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              fontWeight: 900,
              fontSize: '1.2rem',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            ORDER PICKED UP
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
              border: '4px solid #000',
              fontWeight: 900,
              fontSize: '1.2rem',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            MARK DELIVERED
          </button>
        )}
      </div>
    </div>
  );
}
