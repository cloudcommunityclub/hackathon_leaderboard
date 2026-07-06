import { motion, AnimatePresence } from 'framer-motion';

interface AutoPilotCursorProps {
  visible: boolean;
  x: number;
  y: number;
  target: string | null;
}

export function AutoPilotCursor({ visible, x, y, target }: AutoPilotCursorProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute pointer-events-none z-50"
          style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-7 h-7 relative">
            <div className="absolute inset-0 bg-brand-blurple/40 rounded-full blur-md animate-pulse" />
            <div className="relative w-7 h-7 bg-white rounded-full border-2 border-brand-blurple flex items-center justify-center shadow-xl">
              <div className="w-2 h-2 bg-brand-blurple rounded-full" />
            </div>
            {target && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-8 left-8 whitespace-nowrap bg-discord-panel border border-brand-blurple/60 shadow-lg rounded-md px-2.5 py-1 text-xs font-semibold text-white flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                <span>#{target}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
