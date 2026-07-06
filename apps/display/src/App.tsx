import { useDisplayWebSocket } from './lib/useDisplayWebSocket';
import { TopBar } from './components/TopBar';
import { ServerRail } from './components/ServerRail';
import { ChannelRail } from './components/ChannelRail';
import { MainFeed } from './components/MainFeed';
import { RightTeamPanel } from './components/RightTeamPanel';
import { AutoPilotCursor } from './components/AutoPilotCursor';
import { BottomTicker } from './components/BottomTicker';

export default function App() {
  const { state, teams, messages, cursor, playCursorAnimation, selectChannel } = useDisplayWebSocket();

  return (
    <div className="h-screen w-screen flex flex-col bg-discord-bg text-discord-text font-ui select-none overflow-hidden">
      <TopBar phase={state.phase} teamsOnline={state.teamsOnline} totalTeams={state.totalTeams} />

      <div className="flex-1 flex overflow-hidden relative">
        <ServerRail />
        <ChannelRail activeChannel={state.activeChannel} onSelectChannel={selectChannel} />
        <MainFeed
          activeChannel={state.activeChannel}
          welcome={state.welcome}
          teams={teams}
          messages={messages}
          onShowCursor={playCursorAnimation}
        />
        <RightTeamPanel teams={teams} teamsOnline={state.teamsOnline} totalTeams={state.totalTeams} />
        <AutoPilotCursor visible={cursor.visible} x={cursor.x} y={cursor.y} target={cursor.target} />
      </div>

      <BottomTicker messages={messages} phase={state.phase} />
    </div>
  );
}
