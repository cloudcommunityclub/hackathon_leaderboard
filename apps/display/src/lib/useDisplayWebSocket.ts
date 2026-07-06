import { useEffect, useState, useCallback, useRef } from 'react';
import { DisplayState, Team, BotMessage } from '@build-server/shared';
import { phaseChannelMap } from './constants';

export function useDisplayWebSocket() {
  const [state, setState] = useState<DisplayState>({
    activeChannel: 'hall-of-builders',
    phase: 'check_in',
    welcome: null,
    teamsOnline: 0,
    totalTeams: 0,
    rotationPaused: false,
  });
  const [teams, setTeams] = useState<Team[]>([]);
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<{ visible: boolean; x: number; y: number; target: string | null }>({
    visible: false,
    x: 0,
    y: 0,
    target: null,
  });

  const cursorTimeoutRef = useRef<number | null>(null);
  const rotationRef = useRef<number | null>(null);

  const loadTeams = useCallback(async () => {
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      if (data.teams) {
        setTeams(data.teams);
        setState((s) => ({ ...s, teamsOnline: data.onlineCount, totalTeams: data.total }));
      }
    } catch (e) {
      console.error('Failed to load teams', e);
    }
  }, []);

  const loadMessages = useCallback(async (channel: string) => {
    try {
      const res = await fetch(`/api/messages/${channel}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (e) {
      console.error('Failed to load messages', e);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([loadTeams(), loadMessages(state.activeChannel)]).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [loadTeams, loadMessages, state.activeChannel]);

  useEffect(() => {
    const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = import.meta.env.DEV ? `${window.location.hostname}:3001` : window.location.host;
    const ws = new WebSocket(`${wsProto}//${wsHost}/ws/display`);
    ws.onopen = () => ws.send(JSON.stringify({ type: 'display.hello' }));
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'state' && msg.state) {
          setState((s) => ({ ...s, ...msg.state }));
          if (msg.state.activeChannel) loadMessages(msg.state.activeChannel);
        }
        if (msg.type === 'channel.change') {
          setState((s) => ({ ...s, activeChannel: msg.channel }));
          loadMessages(msg.channel);
        }
        if (msg.type === 'welcome.start' && msg.welcome) {
          setState((s) => ({ ...s, welcome: msg.welcome, activeChannel: 'arrivals' }));
        }
        if (msg.type === 'welcome.end') {
          setState((s) => ({ ...s, welcome: null }));
        }
        if (msg.type === 'cursor.animate') {
          setCursor({ visible: true, x: msg.x || 0, y: msg.y || 0, target: msg.target || null });
          if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
          cursorTimeoutRef.current = window.setTimeout(
            () => setCursor({ visible: false, x: 0, y: 0, target: null }),
            3200
          );
        }
      } catch {}
    };
    return () => ws.close();
  }, [loadMessages]);

  const isWelcomeActive = !!state.welcome;

  const startRotation = useCallback(() => {
    if (rotationRef.current) clearTimeout(rotationRef.current);
    const available = phaseChannelMap[state.phase] || ['hall-of-builders'];
    const currentIndex = available.indexOf(state.activeChannel);
    const nextIndex = (currentIndex + 1) % available.length;
    const nextChannel = available[nextIndex];
    rotationRef.current = window.setTimeout(() => {
      setState((s) => ({ ...s, activeChannel: nextChannel }));
      if (rotationRef.current) clearTimeout(rotationRef.current);
      startRotation();
    }, 4500 + Math.random() * 3000);
  }, [state.phase, state.activeChannel]);

  useEffect(() => {
    if (!isWelcomeActive && !state.rotationPaused) startRotation();
    return () => {
      if (rotationRef.current) clearTimeout(rotationRef.current);
    };
  }, [isWelcomeActive, state.rotationPaused, startRotation]);

  const playCursorAnimation = useCallback(() => {
    if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
    const available = phaseChannelMap[state.phase] || ['hall-of-builders'];
    const target = available[Math.floor(Math.random() * available.length)];
    setCursor({ visible: true, x: 78 + Math.random() * 14, y: 18 + Math.random() * 22, target });
    cursorTimeoutRef.current = window.setTimeout(
      () => setCursor({ visible: false, x: 0, y: 0, target: null }),
      3200
    );
  }, [state.phase]);

  const selectChannel = useCallback((channelId: string) => {
    setState((s) => ({ ...s, activeChannel: channelId }));
  }, []);

  return {
    state,
    teams,
    messages,
    loading,
    cursor,
    playCursorAnimation,
    selectChannel,
  };
}
