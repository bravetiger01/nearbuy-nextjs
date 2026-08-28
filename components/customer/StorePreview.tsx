'use client';

import { STORES } from '../../lib/data';
import { useApp } from '../../lib/store-context';

export default function StorePreview() {
  const { quickSearch } = useApp();

  return (
    <div className="initial-boxy">
      <div className="section-eyebrow">NEARBY STORES</div>
      <h2 className="section-heading" style={{ marginBottom: 24 }}>
        Registered stores
        <br />
        near SVIT College
      </h2>
      <div className="store-preview-boxy">
        {STORES.map((s) => (
          <div className="sp-card-boxy" key={s.id} onClick={() => quickSearch(s.products[0].name)}>
            <div className="sp-accent" style={{ background: s.color }} />
            <div className="sp-name">{s.name}</div>
            <div className="sp-dist">{s.distText} away</div>
            <div className="sp-meta">
              ★ {s.rating} · {s.products.length} products
            </div>
            <span className={`sp-status ${s.openNow ? 'open' : 'closed'}`}>{s.openNow ? 'OPEN' : 'CLOSED'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}