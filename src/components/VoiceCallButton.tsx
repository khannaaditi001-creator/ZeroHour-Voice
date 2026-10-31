import { useState } from 'react';
import { BolnaWebCall } from '@bolna/web-call';

export default function VoiceCallButton() {
  const [state, setState] = useState('idle');

  const startCall = () => {
    const call = new BolnaWebCall({ sessionUrl: '/api/bolna-session' });
    call.on('state-change', setState);
    call.on('call-end', () => setState('idle'));
    call.on('error', (e: any) => {
      console.error(e.code, e.message);
      setState('idle');
    });
    call.start();
  };

  const busy = state !== 'idle' && state !== 'ended';
  return (
    <button
      onClick={startCall}
      disabled={busy}
      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm disabled:opacity-60"
    >
      {state === 'active' ? 'On call... speak now' : busy ? 'Connecting...' : '🎙️ Talk to ZEROHOUR'}
    </button>
  );
}