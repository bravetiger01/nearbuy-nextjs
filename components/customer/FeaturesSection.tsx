'use client';

import Image from 'next/image';
import { useApp } from '../../lib/store-context';
import { ArrowIcon, CameraIcon, MicIcon, ReserveIcon, TruckIcon } from '../../lib/icons';

export default function FeaturesSection() {
  const { openModal, quickSearch } = useApp();

  const cards = [
    {
      icon: <CameraIcon size={24} />,
      cls: 'bg-lavender',
      title: 'Snap & Search',
      desc: 'Photo of any unknown item → AI identifies it → finds stock nearby',
      image: '/cetrizine.png',
      onClick: () => openModal('snap'),
    },
    {
      icon: <MicIcon size={24} />,
      cls: 'bg-lavender',
      title: 'Voice Search',
      desc: 'Speak in English, Hindi, or Gujarati — any product found instantly',
      image: '/avil.png',
      onClick: () => openModal('voice'),
    },
    {
      icon: <ReserveIcon size={24} />,
      cls: 'bg-lavender',
      title: 'Reserve & Hold',
      desc: 'Hold items at the counter — shopkeeper notified in real time',
      image: '/doms nb.png',
      onClick: () => quickSearch('Notebook'),
    },
    {
      icon: <TruckIcon size={24} />,
      cls: 'bg-lavender',
      title: 'Book a Rider',
      desc: "Can't go? Our rider shops for you and delivers — ₹35 flat fee",
      image: '/youva nb.png',
      onClick: () => quickSearch('Pen'),
    },
  ];

  return (
    <section className="feat-section" id="featSection">
      <div className="section-wrap">
        <div className="section-top">
          <div className="section-eyebrow">PLATFORM FEATURES</div>
          <h2 className="section-heading">
            Everything you need
            <br />
            to shop smarter.
          </h2>
        </div>
        <div className="feat-grid">
          {cards.map((c, i) => (
            <div key={i} className="feat-card-boxy" onClick={c.onClick} style={{ position: 'relative', overflow: 'hidden' }}>
              
              {/* Decorative floating image */}
              <div style={{ position: 'absolute', right: '-20px', bottom: '-10px', opacity: 0.3, pointerEvents: 'none', transform: 'rotate(-15deg)' }}>
                <Image src={c.image} alt={c.title} width={120} height={120} style={{ objectFit: 'contain' }} />
              </div>

              <div className={`feat-icon-box ${c.cls}`} style={{ position: 'relative', zIndex: 2 }}>{c.icon}</div>
              <h3 style={{ position: 'relative', zIndex: 2 }}>{c.title}</h3>
              <p style={{ position: 'relative', zIndex: 2 }}>{c.desc}</p>
              <div className="feat-arrow" style={{ position: 'relative', zIndex: 2 }}>
                <ArrowIcon size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}