'use client';

import Image from 'next/image';
import { useApp } from '../../lib/store-context';
import { VideoIcon } from '../../lib/icons';

const STORE_CHIPS = ['Zudio', 'H&M', 'Max', 'Westside', 'FBB', 'Trends'];

export default function FashionSection() {
  const { openModal } = useApp();
  return (
    <section className="fashion-section" id="fashionSection">
      <div className="section-wrap">
        <div className="fashion-inner">
          <div className="fashion-text">
            <div className="section-eyebrow light">NEW FEATURE — SHOP LIVE</div>
            <h2 className="fashion-heading">
              Can&apos;t go to the store?
              <br />
              Your personal
              <br />
              <span className="fashion-accent">Style Guide</span> goes for you.
            </h2>
            <p className="fashion-desc">
              Pick any fashion store. Our personal shopper goes there, video calls you from the store, shows you options
              live — you pick what you want, they buy it, and deliver it to your door.
            </p>
            <div className="fashion-steps">
              <div className="f-step">
                <div className="f-step-num">01</div>
                <div className="f-step-text">Pick your store &amp; preferences (size, budget, style)</div>
              </div>
              <div className="f-step">
                <div className="f-step-num">02</div>
                <div className="f-step-text">Our Style Guide goes to the store &amp; video calls you</div>
              </div>
              <div className="f-step">
                <div className="f-step-num">03</div>
                <div className="f-step-text">You see it live, say &quot;get that one&quot; — they buy &amp; deliver</div>
              </div>
            </div>
            <button className="btn-fashion" onClick={() => openModal('fashion')}>
              <VideoIcon size={16} />
              BOOK A STYLE GUIDE — ₹49 FLAT
            </button>
          </div>
          <div className="fashion-img-col">
            <div className="fashion-img-frame">
              <Image
                src="/style-advisor.png"
                alt="Personal style guide shopping for you live"
                className="fashion-img"
                width={500}
                height={500}
              />
              <div className="fashion-stores-grid">
                {STORE_CHIPS.map((s) => (
                  <div className="f-store-chip" key={s}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#8B5CF6">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}