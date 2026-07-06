import { useEffect, useState } from 'react';

interface TopBarProps {
  phase: string;
  teamsOnline: number;
  totalTeams: number;
}

export function TopBar({ phase, teamsOnline, totalTeams }: TopBarProps) {
  const [timeString, setTimeString] = useState<string>(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeString(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-16 bg-discord-sidebar border-b border-discord-border flex items-center px-6 justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-blurple flex items-center justify-center text-base font-bold font-display shadow-lg shadow-brand-blurple/30 text-white">
          B
        </div>
        <div>
          <h1 className="text-lg font-semibold font-display tracking-tight text-white leading-tight">
            Digital India Build Server
          </h1>
          <p className="text-xs text-discord-muted leading-tight">
            Hall of Builders · {phase.replace('_', ' ').toUpperCase()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-medium text-white leading-tight">
            {teamsOnline} / {totalTeams} Teams Online
          </p>
          <p className="text-xs text-discord-muted leading-tight">Check-in active</p>
        </div>
        <div className="w-px h-8 bg-discord-border" />
        <div className="text-right">
          <p className="text-sm font-medium text-white font-mono leading-tight" id="clock">
            {timeString}
          </p>
          <p className="text-xs text-discord-muted leading-tight">India Standard Time</p>
        </div>
      </div>
    </div>
  );
}
