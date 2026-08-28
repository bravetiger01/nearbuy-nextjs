'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { USER_LAT, USER_LNG } from '../../lib/data';
import type { StoreResult } from '../../lib/types';
import { PinIcon } from '../../lib/icons';

const storeIcon = (color: string) =>
  new L.DivIcon({
    className: 'nbuy-marker',
    html: `<div class="nbuy-pin" style="background:${color};border-color:#0a0a0a;box-shadow:3px 3px 0 #0a0a0a;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" fill="#0a0a0a" stroke="none"/></svg></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

const userIcon = new L.DivIcon({
  className: 'nbuy-marker',
  html: `<div class="nbuy-pin user-pin"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" fill="#fff" stroke="none"/></svg></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const legendItems = ['Your location', 'Store', 'Matched store'];

export default function MapView({ stores }: { stores: StoreResult[] }) {
  return (
    <div className="map-wrap-boxy" style={{ position: 'relative' }}>
      <MapContainer
        center={[USER_LAT, USER_LNG]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '520px', width: '100%', borderRadius: 0, border: '2px solid #0A0A0A' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[USER_LAT, USER_LNG]} icon={userIcon}>
          <Popup>You are here — SVIT College, Vasad</Popup>
        </Marker>
        {stores.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={storeIcon(s.color)}>
            <Popup>
              <strong>{s.name}</strong>
              <br />
              {s.distText} away · ★ {s.rating.toFixed(1)}
              <br />
              {s.matchedProducts.length} matching item(s)
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="map-legend">
        <div className="ml-item">
          <span className="ml-dot user-dot" />
          <PinIcon size={12} />
          {legendItems[0]}
        </div>
        <div className="ml-item">
          <span className="ml-dot" style={{ background: '#A78BFA' }} />
          {legendItems[1]}
        </div>
        <div className="ml-item">
          <span className="ml-dot" style={{ background: '#8B5CF6' }} />
          {legendItems[2]}
        </div>
      </div>
    </div>
  );
}