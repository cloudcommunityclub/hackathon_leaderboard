import { BotMessage } from '@build-server/shared';

interface BottomTickerProps {
  messages: BotMessage[];
  phase: string;
}

export function BottomTicker({ messages, phase }: BottomTickerProps) {
  const latestMsgText =
    messages.length > 0
      ? `${messages[messages.length - 1]?.author}: ${messages[messages.length - 1]?.content.replace(/\*|`/g, '').split('\n')[0]}`
      : 'Welcome builders! Check in at the desk to join the live wall.';

  return (
    <div className="h-10 bg-discord-sidebar border-t border-discord-border flex items-center px-6 gap-4 shrink-0 overflow-hidden select-none">
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-online/10 border border-brand-online/30 shrink-0">
        <span className="w-2 h-2 rounded-full bg-brand-online animate-pulse" />
        <span className="text-[11px] font-bold text-brand-online tracking-wide uppercase">LIVE</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative flex items-center">
        {/* Seamless marquee using CSS keyframes */}
        <div className="flex whitespace-nowrap animate-marquee">
          <TickerContent latestMsgText={latestMsgText} phase={phase} />
          <TickerContent latestMsgText={latestMsgText} phase={phase} />
        </div>
      </div>
    </div>
  );
}

function TickerContent({ latestMsgText, phase }: { latestMsgText: string; phase: string }) {
  return (
    <div className="flex items-center text-sm text-discord-text pr-12">
      <span className="text-white font-medium mr-8 flex items-center gap-2">
        <span className="text-brand-blurple">⚡</span>
        <span>{latestMsgText}</span>
      </span>
      <span className="text-discord-muted mr-8">
        Digital India Build Server — <span className="text-slate-300">Hall of Builders</span>
      </span>
      <span className="text-discord-muted mr-8">
        Current Phase: <span className="text-brand-blurple font-semibold uppercase">{phase.replace('_', ' ')}</span>
      </span>
      <span className="text-discord-muted mr-8">
        • Keep building and shipping! 🚀
      </span>
    </div>
  );
}
