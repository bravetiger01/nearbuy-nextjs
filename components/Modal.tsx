'use client';

import type { ReactNode } from 'react';
import { useApp, type ModalName } from '../lib/store-context';

interface ModalProps {
  name: Exclude<ModalName, null>;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: 'default' | 'wide' | 'xl' | 'voice';
  bodyClass?: string;
  onClose?: () => void;
}

export default function Modal({ name, title, children, footer, width = 'default', bodyClass = '', onClose }: ModalProps) {
  const { activeModal, closeModal } = useApp();
  if (activeModal !== name) return null;

  const widthClass = width === 'wide' ? 'modal-wide-boxy' : width === 'xl' ? 'modal-xl-boxy' : width === 'voice' ? 'voice-modal-boxy' : '';

  return (
    <div
      className="modal-ov"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
          closeModal(name);
        }
      }}
    >
      <div className={`modal-boxy ${widthClass}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-hdr-boxy">
          <h3>{title}</h3>
          <button
            className="modal-x-boxy"
            onClick={() => {
              onClose?.();
              closeModal(name);
            }}
          >
            ✕
          </button>
        </div>
        <div className={`modal-bdy-boxy${bodyClass ? ` ${bodyClass}` : ''}`}>{children}</div>
        {footer ? <div className="modal-ftr-boxy">{footer}</div> : null}
      </div>
    </div>
  );
}