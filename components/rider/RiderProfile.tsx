'use client';

import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Star, IndianRupee, Package, User } from 'lucide-react';

export default function RiderProfile() {
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const fileInputGalleryRef = useRef<HTMLInputElement>(null);
  const fileInputCameraRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
      setShowPhotoOptions(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      fileInputCameraRef.current?.click();
    } catch (err) {
      alert("Camera permission is required to take a photo.");
    }
  };

  return (
    <div style={{ padding: 20, flex: 1, backgroundColor: '#fff', color: '#000', fontFamily: 'monospace' }}>
      
      {/* Profile Photo Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30 }}>
        <div 
          onClick={() => setShowPhotoOptions(!showPhotoOptions)}
          style={{
            width: 120,
            height: 120,
            backgroundColor: profileImage ? 'transparent' : '#f3f4f6',
            border: '4px solid #000',
            boxShadow: '4px 4px 0px #000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={48} color="#000" />
          )}
        </div>
        
        {showPhotoOptions && (
          <div style={{ 
            marginTop: 15, 
            display: 'flex', 
            gap: 10,
            padding: 10,
            border: '3px solid #000',
            boxShadow: '4px 4px 0px #000',
            backgroundColor: '#fff'
          }}>
            <button 
              onClick={() => fileInputGalleryRef.current?.click()}
              style={{
                padding: 10,
                backgroundColor: '#ffea00',
                border: '2px solid #000',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            >
              <ImageIcon size={18} /> GALLERY
            </button>
            <button 
              onClick={requestCameraPermission}
              style={{
                padding: 10,
                backgroundColor: '#000',
                color: '#fff',
                border: '2px solid #000',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            >
              <Camera size={18} /> CAMERA
            </button>
          </div>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputGalleryRef}
        onChange={handlePhotoUpload}
        style={{ display: 'none' }} 
      />
      
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputCameraRef}
        onChange={handlePhotoUpload}
        style={{ display: 'none' }} 
      />

      {/* Details Section */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: 5 }}>Display Name</div>
        <input 
          type="text" 
          defaultValue="John Doe"
          style={{
            width: '100%',
            padding: 15,
            border: '3px solid #000',
            boxShadow: '4px 4px 0px #000',
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: 'monospace',
            marginBottom: 20
          }}
        />

        <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: 5 }}>Phone Number</div>
        <input 
          type="tel" 
          defaultValue="+91 9876543210"
          style={{
            width: '100%',
            padding: 15,
            border: '3px solid #000',
            boxShadow: '4px 4px 0px #000',
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: 'monospace',
            marginBottom: 20
          }}
        />

        <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: 5 }}>Email Address</div>
        <input 
          type="email" 
          placeholder="Enter your email"
          style={{
            width: '100%',
            padding: 15,
            border: '3px solid #000',
            boxShadow: '4px 4px 0px #000',
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: 'monospace',
            marginBottom: 20
          }}
        />
      </div>

      {/* Stats Section */}
      <div style={{ paddingBottom: 40 }}>
        <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '1.2rem', marginBottom: 15, borderBottom: '3px solid #000', paddingBottom: 5 }}>
          Your Stats
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          
          <div style={{ padding: 15, border: '3px solid #000', boxShadow: '4px 4px 0px #000', backgroundColor: '#e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, fontWeight: 900 }}>
              <Star size={16} /> RATING
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>4.8<span style={{ fontSize: '1rem' }}>/5</span></div>
          </div>

          <div style={{ padding: 15, border: '3px solid #000', boxShadow: '4px 4px 0px #000', backgroundColor: '#e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, fontWeight: 900 }}>
              <Package size={16} /> ITEMS
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>124</div>
          </div>

          <div style={{ padding: 15, border: '3px solid #000', boxShadow: '4px 4px 0px #000', backgroundColor: '#ffea00', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, fontWeight: 900 }}>
              <IndianRupee size={16} /> TODAY'S EARNINGS
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>₹850</div>
          </div>

          <div style={{ padding: 15, border: '3px solid #000', boxShadow: '4px 4px 0px #000', backgroundColor: '#e5e7eb', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, fontWeight: 900 }}>
              <IndianRupee size={16} /> TOTAL EARNINGS
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>₹12,450</div>
          </div>

        </div>
      </div>

    </div>
  );
}
