export type TeamStatus = 'pending' | 'online' | 'idle' | 'submitted' | 'opted_out';

export interface Team {
  id: string;
  name: string;
  college: string;
  track: string;
  table?: string;
  status: TeamStatus;
  checkedInAt: string | null;
  optOutPublicMedia: boolean;
}

export interface CheckInEvent {
  id: string;
  teamId: string;
  source: string;
  receivedAt: string;
  scheduledFor: string;
  priority: number;
}

export interface Welcome {
  id: string;
  teamId: string;
  teamName: string;
  college: string;
  track: string;
  template: string;
  ctaLabel: string;
  startedAt: string;
  endsAt: string;
  reactions: Record<string, number>;
}

export interface Reaction {
  id: string;
  welcomeId: string;
  teamId: string;
  kind: string;
  sessionIdHash: string;
  createdAt: string;
}

export interface BotMessage {
  id: string;
  channel: string;
  author: string;
  content: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
}

export interface Announcement {
  id: string;
  content: string;
  channel: string;
  isEmergency: boolean;
  createdAt: string;
  createdBy: string;
}

export type DisplayChannel =
  | 'arrivals'
  | 'hall-of-builders'
  | 'gitlab-live'
  | 'milestones'
  | 'food-updates'
  | 'mentor-desk'
  | 'submissions'
  | 'announcements'
  | 'deployments'
  | 'sponsor-drops'
  | 'help-desk'
  | 'winners'
  | 'recap'
  | string;

export type EventPhase =
  | 'check_in'
  | 'coding'
  | 'meal'
  | 'mentor'
  | 'submission'
  | 'post_submission'
  | string;

export type DisplayState = {
  activeChannel: DisplayChannel;
  phase: EventPhase;
  welcome: Welcome | null;
  teamsOnline: number;
  totalTeams: number;
  rotationPaused: boolean;
};
