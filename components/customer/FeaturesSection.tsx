'use client';

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
      onClick: () => openModal('snap'),
    },
    {
      icon: <MicIcon size={24} />,
      cls: 'bg-black',
      title: 'Voice Search',
      desc: 'Speak in English, Hindi, or Gujarati — any product found instantly',
      onClick: () => openModal('voice'),
    },
    {
      icon: <ReserveIcon size={24} />,
      cls: 'bg-lavender',
      title: 'Reserve & Hold',
      desc: 'Hold items at the counter — shopkeeper notified in real time',
      onClick: () => quickSearch('Notebook'),
    },
    {
      icon: <TruckIcon size={24} />,
      cls: 'bg-black',
      title: 'Book a Rider',
      desc: "Can't go? Our rider shops for you and delivers — ₹35 flat fee",
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
            <div key={i} className="feat-card-boxy" onClick={c.onClick}>
              <div className={`feat-icon-box ${c.cls}`}>{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className="feat-arrow">
                <ArrowIcon size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}