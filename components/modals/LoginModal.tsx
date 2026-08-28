'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

export default function LoginModal() {
  const { showToast, closeModal, setLoggedIn } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const sendOTP = () => {
    if (phone.trim().length < 10) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }
    showToast('OTP Sent via SMS', 'info');
    setStep(2);
  };

  const verifyOTP = () => {
    if (otp.trim().length < 6) {
      showToast('Enter the 6 digit OTP', 'error');
      return;
    }
    showToast('Successfully Logged In!', 'success');
    setLoggedIn(true);
    closeModal('login');
  };

  return (
    <Modal
      name="login"
      title="LOGIN / REGISTER"
      footer={
        step === 1 ? (
          <>
            <button className="btn-modal-outline" onClick={() => closeModal('login')}>
              CANCEL
            </button>
            <button className="btn-modal-solid" onClick={sendOTP}>
              SEND OTP
            </button>
          </>
        ) : (
          <>
            <button className="btn-modal-outline" onClick={() => setStep(1)}>
              BACK
            </button>
            <button className="btn-modal-solid" onClick={verifyOTP}>
              VERIFY &amp; LOGIN
            </button>
          </>
        )
      }
    >
      {step === 1 ? (
        <>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 16 }}>
            Welcome back to NearBuy! Please enter your phone number to continue.
          </p>
          <div className="form-g">
            <label>PHONE NUMBER</label>
            <input type="tel" className="f-inp" placeholder="+91 9XXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </>
      ) : (
        <>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 16 }}>
            Enter the 6-digit code sent to your phone.
          </p>
          <div className="form-g">
            <label>OTP</label>
            <input type="text" className="f-inp" placeholder="123456" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
          </div>
        </>
      )}
    </Modal>
  );
}