'use client';

import { useApp } from '../lib/store-context';

export default function Toast() {
  const { toast } = useApp();
  return <div className={`toast-boxy ${toast ? `show ${toast.type}` : ''}`}>{toast?.msg ?? ''}</div>;
}