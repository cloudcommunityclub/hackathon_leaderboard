import { useEffect, useState, useCallback } from 'react';
import { DisplayState } from '@build-server/shared';
import { AdminHeader } from './components/AdminHeader';
import { DisplayControls } from './components/DisplayControls';
import { PhaseSelector } from './components/PhaseSelector';
import { AnnouncementPoster } from './components/AnnouncementPoster';
import { ConnectedDisplays } from './components/ConnectedDisplays';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

export default function App() {
  const [state, setState] = useState<DisplayState>({
    activeChannel: 'arrivals',
    phase: 'check_in',
    welcome: null,
    teamsOnline: 0,
    totalTeams: 0,
    rotationPaused: false,
  });
  const [displays, setDisplays] = useState<any[]>([]);

  const loadData = useCallback(() => {
    fetch(`${API_URL}/api/state`)
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === 'object') setState((s) => ({ ...s, ...d }));
      })
      .catch(() => {});

    fetch(`${API_URL}/api/displays`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setDisplays(d);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadData();
    const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = import.meta.env.DEV ? `${window.location.hostname}:3001` : window.location.host;
    const ws = new WebSocket(`${wsProto}//${wsHost}/ws/display`);
    
    ws.onopen = () => ws.send(JSON.stringify({ type: 'display.hello', role: 'admin' }));
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'state' && msg.state) {
          setState((s) => ({ ...s, ...msg.state }));
        }
        if (msg.type === 'channel.change') {
          setState((s) => ({ ...s, activeChannel: msg.channel }));
        }
      } catch {}
    };

    const timer = setInterval(loadData, 5000);
    return () => {
      ws.close();
      clearInterval(timer);
    };
  }, [loadData]);

  const post = async (path: string, body: any) => {
    try {
      await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      loadData();
    } catch (e) {
      console.error('Failed to post admin command:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      <AdminHeader
        teamsOnline={state.teamsOnline}
        totalTeams={state.totalTeams}
        activeChannel={state.activeChannel}
        phase={state.phase}
      />

      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <DisplayControls
            rotationPaused={state.rotationPaused}
            onPost={post}
            onSetRotationPaused={(paused) => setState((s) => ({ ...s, rotationPaused: paused }))}
          />
          <PhaseSelector
            currentPhase={state.phase}
            onSelectPhase={async (p) => {
              setState((s) => ({ ...s, phase: p }));
              await post('/api/admin/phase', { phase: p });
            }}
          />
          <AnnouncementPoster onPost={post} />
          <ConnectedDisplays displays={displays} />
        </div>
      </main>
    </div>
  );
}
