export interface ChannelConfig {
  id: string;
  name: string;
  group: 'WELCOME' | 'BUILD' | 'VENUE' | 'FINAL';
  description: string;
}

export const channels: ChannelConfig[] = [
  { id: 'arrivals', name: 'arrivals', group: 'WELCOME', description: 'Teams joining the build floor in real time' },
  { id: 'hall-of-builders', name: 'hall-of-builders', group: 'WELCOME', description: 'All teams visible in one live wall' },
  { id: 'announcements', name: 'announcements', group: 'WELCOME', description: 'Important event updates from operations' },
  { id: 'gitlab-live', name: 'gitlab-live', group: 'BUILD', description: 'Live engineering activity from participant repositories' },
  { id: 'milestones', name: 'milestones', group: 'BUILD', description: 'Achievements unlocked across the hackathon' },
  { id: 'deployments', name: 'deployments', group: 'BUILD', description: 'Successful deployments and releases' },
  { id: 'submissions', name: 'submissions', group: 'BUILD', description: 'Final build status and submission countdown' },
  { id: 'food-updates', name: 'food-updates', group: 'VENUE', description: 'Meal, snack, and hydration updates' },
  { id: 'mentor-desk', name: 'mentor-desk', group: 'VENUE', description: 'Mentor availability and active help sessions' },
  { id: 'sponsor-drops', name: 'sponsor-drops', group: 'VENUE', description: 'Sponsor announcements and rewards' },
  { id: 'help-desk', name: 'help-desk', group: 'VENUE', description: 'Technical support and venue help' },
  { id: 'winners', name: 'winners', group: 'FINAL', description: 'Winners and closing ceremony' },
  { id: 'recap', name: 'recap', group: 'FINAL', description: 'Event recap and certificates' },
];

export const phaseChannelMap: Record<string, string[]> = {
  check_in: ['arrivals', 'hall-of-builders', 'announcements'],
  coding: ['gitlab-live', 'milestones', 'hall-of-builders', 'mentor-desk', 'announcements'],
  meal: ['food-updates', 'announcements', 'hall-of-builders', 'gitlab-live'],
  mentor: ['mentor-desk', 'gitlab-live', 'milestones', 'hall-of-builders'],
  submission: ['submissions', 'announcements', 'submitted-builds', 'countdown'],
  post_submission: ['winners', 'recap', 'submitted-builds', 'highlights'],
};

export const botAuthors: Record<string, { emoji: string; color: string }> = {
  'GitLab Bot': { emoji: '🔧', color: 'text-orange-300' },
  'Ops Bot': { emoji: '🛠', color: 'text-yellow-300' },
};
