'use client';

import Image from 'next/image';
import { useApp } from '../../lib/store-context';

export default function FashionSection() {
  const { openModal } = useApp();
  return (
    <section className="fashion-section" id="riderSection">
      <div className="section-wrap">
        <div className="fashion-inner" style={{ flexDirection: 'row-reverse' }}>
          <div className="fashion-text">
            <div className="section-eyebrow light">INSTANT DELIVERY</div>
            <h2 className="fashion-heading">
              Need it now?
              <br />
              Book a <span className="fashion-accent">Local Rider</span>
            </h2>
            <p className="fashion-desc">
              Don't want to step out? Find your product, reserve it, and instantly book a trusted local rider to deliver it right to your doorstep within 15 minutes.
            </p>
            <div className="fashion-steps">
              <div className="f-step">
                <div className="f-step-num">01</div>
                <div className="f-step-text">Search and locate your item at a nearby Vasad store.</div>
              </div>
              <div className="f-step">
                <div className="f-step-num">02</div>
                <div className="f-step-text">Reserve the item and select 'Book Rider'.</div>
              </div>
              <div className="f-step">
                <div className="f-step-num">03</div>
                <div className="f-step-text">A rider picks it up and delivers it in minutes.</div>
              </div>
            </div>
            <button className="btn-fashion" onClick={() => openModal('rider')}>
              BOOK A RIDER NOW
            </button>
          </div>
          <div className="fashion-img-col">
            <div className="fashion-img-frame" style={{ background: 'transparent', boxShadow: 'none' }}>
              <Image
                src="/hero.png" 
                alt="Local rider delivery"
                className="fashion-img"
                width={500}
                height={500}
                style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}