'use client';

import { STORES } from '../../lib/data';
import { ClockIcon, PinIcon } from '../../lib/icons';
import { useApp } from '../../lib/store-context';

export default function StorePreview() {
  const { showToast } = useApp();

  return (
    <div className="preview-section">
      <div className="preview-hdr">
        <div>
          <div className="section-eyebrow">STORES NEAR YOU</div>
          <h2 className="res-title">Explore nearby stores</h2>
        </div>
        <button className="btn-see-all" onClick={() => showToast('All stores coming soon', 'info')}>
          SEE ALL →
        </button>
      </div>
      <div className="preview-grid">
        {STORES.map((s) => (
          <div className="preview-card" key={s.id}>
            <div className="pc-top">
              <div className="store-monogram" style={{ background: s.color }}>
                {s.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="preview-name">{s.name}</h3>
                <div className="pc-meta">
                  <span>
                    <PinIcon size={12} /> {s.distText}
                  </span>
                  <span>★ {s.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className="pc-chips">
              {s.products.slice(0, 3).map((p) => (
                <span className="cat-chip" key={p.name}>
                  {p.name}
                </span>
              ))}
            </div>
            <div className="pc-foot">
              <span className="pc-open">
                <ClockIcon size={12} />
                {s.openNow ? ' OPEN NOW' : ' CLOSED'}
              </span>
              <button
                className="btn-sm"
                onClick={() => showToast(`${s.name} catalog preview coming soon`, 'info')}
              >
                VIEW →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}