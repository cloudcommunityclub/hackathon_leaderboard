import { useState } from 'react';

interface DisplayControlsProps {
  rotationPaused: boolean;
  onPost: (path: string, body: any) => Promise<void>;
  onSetRotationPaused: (paused: boolean) => void;
}

export function DisplayControls({ rotationPaused, onPost, onSetRotationPaused }: DisplayControlsProps) {
  const [emergencyText, setEmergencyText] = useState('🚨 EMERGENCY: Please report to the main stage immediately! 🚨');
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePauseResume = async (pause: boolean) => {
    setLoading(true);
    onSetRotationPaused(pause);
    await onPost(pause ? '/api/admin/rotation/pause' : '/api/admin/rotation/resume', {});
    setLoading(false);
  };

  const handleEmergencyStart = async () => {
    setLoading(true);
    setIsEmergencyActive(true);
    await onPost('/api/admin/emergency/start', { content: emergencyText, createdBy: 'Ops Command' });
    setLoading(false);
  };

  const handleEmergencyEnd = async () => {
    setLoading(true);
    setIsEmergencyActive(false);
    await onPost('/api/admin/emergency/end', {});
    setLoading(false);
  };

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🎮</span>
          <span>Display & Rotation Controls</span>
        </h2>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
            rotationPaused ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}
        >
          {rotationPaused ? '⏸ Rotation Paused' : '▶ Rotation Active'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          disabled={loading || rotationPaused}
          onClick={() => handlePauseResume(true)}
          className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border ${
            rotationPaused
              ? 'bg-slate-700/50 border-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-amber-600/90 hover:bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/20 active:scale-[0.98]'
          }`}
        >
          <span>⏸</span>
          <span>Pause Auto Pilot Rotation</span>
        </button>

        <button
          disabled={loading || !rotationPaused}
          onClick={() => handlePauseResume(false)}
          className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border ${
            !rotationPaused
              ? 'bg-slate-700/50 border-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-green-600/90 hover:bg-green-600 text-white border-green-500 shadow-lg shadow-green-600/20 active:scale-[0.98]'
          }`}
        >
          <span>▶</span>
          <span>Resume Auto Pilot Rotation</span>
        </button>
      </div>

      <div className="border-t border-slate-700/80 pt-5">
        <h3 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-1.5">
          <span>🚨</span>
          <span>Emergency Banner Override</span>
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Instantly override all public display screens with a high-priority emergency alert.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            value={emergencyText}
            onChange={(e) => setEmergencyText(e.target.value)}
            placeholder="Emergency announcement text..."
            className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
          <button
            disabled={loading}
            onClick={handleEmergencyStart}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-red-600/30 transition-all active:scale-[0.98] whitespace-nowrap"
          >
            Trigger Alert 🚨
          </button>
          {isEmergencyActive && (
            <button
              disabled={loading}
              onClick={handleEmergencyEnd}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-sm transition-all whitespace-nowrap"
            >
              Clear Alert
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
