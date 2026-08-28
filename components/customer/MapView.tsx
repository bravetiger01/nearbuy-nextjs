'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { USER_LAT, USER_LNG } from '../../lib/data';
import type { StoreResult } from '../../lib/types';

const storeIcon = (color: string) =>
  new L.DivIcon({
    className: 'nbuy-marker',
    html: `<div class="nbuy-pin" style="background:${color};border-color:#0a0a0a;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" fill="#0a0a0a" stroke="none"/></svg></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

const userIcon = new L.DivIcon({
  className: 'nbuy-marker',
  html: `<div class="nbuy-pin user-pin"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" fill="#fff" stroke="none"/></svg></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

export default function MapView({ stores }: { stores: StoreResult[] }) {
  return (
    <>
      <div className="map-boxy">
        <MapContainer
          center={[USER_LAT, USER_LNG]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[USER_LAT, USER_LNG]} icon={userIcon}>
            <Popup>You are here — SVIT College, Vasad</Popup>
          </Marker>
          {stores.map((s) => (
            <Marker
              key={s.id}
              position={[s.lat, s.lng]}
              icon={storeIcon(s.openNow ? s.color : '#9CA3AF')}
            >
              <Popup>
                <strong>{s.name}</strong>
                <br />
                {s.distText} away · {s.openNow ? 'Open' : 'Closed'}
                <br />
                {storePopupProducts(s)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="map-legend-boxy">
        <span>
          <span className="mleg-dot lavender" />
          In Stock
        </span>
        <span>
          <span className="mleg-dot dark" />
          Closed / Out
        </span>
        <span>
          <span className="mleg-dot mid" />
          You
        </span>
      </div>
    </>
  );
}

function storePopupProducts(s: StoreResult) {
  const ml = s.matchedProducts.length ? s.matchedProducts : s.products;
  return ml.slice(0, 3).map((p) => (
    <span key={p.name}>
      {p.name} — <strong>{p.stock} in stock</strong>
      <br />
    </span>
  ));
}