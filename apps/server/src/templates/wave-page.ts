export function getWavePageHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Wave - Digital India Build Server</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; font-family: Inter, system-ui, -apple-system, sans-serif; background: #0b0d12; color: #f2f3f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; box-sizing: border-box; }
    .card { background: #161922; border: 1px solid #2b2f3a; border-radius: 20px; padding: 32px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .button { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 16px; margin: 10px 0; border-radius: 12px; border: 1px solid #2b2f3a; background: #1f2330; color: #f2f3f5; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .button:hover { background: #2a2d38; transform: translateY(-1px); }
    .button:active { transform: translateY(1px); }
    .primary { background: #5865f2; border-color: #5865f2; color: white; box-shadow: 0 4px 12px rgba(88,101,242,0.3); }
    .primary:hover { background: #4752c4; }
    .badge { display: inline-block; background: rgba(35,165,90,0.15); color: #23a55a; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px; margin-bottom: 16px; letter-spacing: 0.5px; text-transform: uppercase; }
    h1 { font-size: 24px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.5px; }
    p { color: #949ba4; font-size: 14px; margin: 0 0 24px; line-height: 1.5; }
    #info { font-weight: 500; color: #e0e2e8; background: #1f2330; padding: 16px; border-radius: 12px; border: 1px solid #2b2f3a/60; margin-bottom: 24px; white-space: pre-line; }
    #status { font-size: 14px; font-weight: 600; color: #23a55a; margin-top: 16px; min-height: 20px; transition: opacity 0.3s; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">● Live Floor Interaction</div>
    <h1>Build Server Wave</h1>
    <p>Send instant live reactions to the Hall of Builders main screen.</p>
    
    <div id="info">Loading current team...</div>
    
    <button id="wave" class="button primary"><span>👋</span><span>Wave Hello</span></button>
    <button id="ship" class="button primary"><span>🚀</span><span>Ship It!</span></button>
    <button id="fire" class="button primary"><span>🔥</span><span>Fire Energy</span></button>
    
    <div id="status"></div>
  </div>
  <script>
    const buttons = [
      { id: 'wave', kind: 'wave', label: 'Wave 👋' },
      { id: 'ship', kind: 'ship_it', label: 'Ship It 🚀' },
      { id: 'fire', kind: 'fire', label: 'Fire 🔥' }
    ];
    const state = document.getElementById('info');
    const status = document.getElementById('status');
    let session = localStorage.getItem('dibs_wave_session') || crypto.randomUUID();
    localStorage.setItem('dibs_wave_session', session);

    async function load() {
      try {
        const r = await fetch('/api/wave/current');
        const d = await r.json();
        if (d.active) {
          state.textContent = '🚀 Welcoming ' + d.teamName + '\\n' + d.college + ' · ' + d.track;
        } else {
          state.textContent = 'No team is being welcomed right now.\\nStay ready for the next arrival!';
        }
      } catch {
        state.textContent = 'No team is being welcomed right now.\\nStay ready for the next arrival!';
      }
    }

    buttons.forEach(b => {
      document.getElementById(b.id).addEventListener('click', async () => {
        status.style.opacity = '0.5';
        status.style.color = '#949ba4';
        status.textContent = 'Sending reaction...';
        try {
          const r = await fetch('/api/wave/reactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ welcomeId: 'current', kind: b.kind, sessionIdHash: session })
          });
          const d = await r.json();
          status.style.opacity = '1';
          if (d.ok) {
            status.style.color = '#23a55a';
            status.textContent = '✨ Sent! Watch the big screen.';
          } else {
            status.style.color = '#f23f43';
            status.textContent = d.error || 'Something went wrong.';
          }
        } catch {
          status.style.opacity = '1';
          status.style.color = '#f23f43';
          status.textContent = 'Network error. Try again.';
        }
      });
    });

    load();
    setInterval(load, 5000);
  </script>
</body>
</html>`;
}
