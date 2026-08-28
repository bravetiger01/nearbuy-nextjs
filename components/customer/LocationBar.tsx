'use client';

import { useApp } from '../../lib/store-context';
import { PinIcon } from '../../lib/icons';

export default function LocationBar() {
  const { showToast } = useApp();
  return (
    <div className="loc-bar">
      <div className="loc-bar-inner">
        <PinIcon size={14} />
        <span>
          Near <strong>SVIT College, Vasad, Gujarat</strong>
        </span>
        <span className="loc-sep">·</span>
        <span>
          Radius: <strong>2 km</strong>
        </span>
        <button className="loc-change" onClick={() => showToast('Location update coming soon', 'info')}>
          CHANGE
        </button>
      </div>
    </div>
  );
}