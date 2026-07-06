import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const TRACKS = ['AI Track', 'Web Track', 'Open Innovation', 'Hardware', 'Cybersecurity'];
const COLLEGES = [
  'SNIST Hyderabad', 'IIIT Hyderabad', 'IIT Madras', 'IIT Bombay', 'BITS Pilani',
  'NIT Warangal', 'VIT Vellore', 'JNTU Hyderabad', 'OU Hyderabad', 'CBIT Hyderabad'
];

async function seed() {
  await prisma.team.deleteMany();
  const now = Date.now();
  for (let i = 0; i < 78; i++) {
    const isOnline = i < 45;
    const name = `Team ${faker.string.alphanumeric({ length: 8 }).toUpperCase()}`;
    await prisma.team.create({
      data: {
        name,
        college: COLLEGES[i % COLLEGES.length],
        track: TRACKS[i % TRACKS.length],
        table: `T${(i % 12) + 1}`,
        status: isOnline ? 'online' : 'pending',
        checkedInAt: isOnline ? new Date(now - (78 - i) * 1000 * 180).toISOString() : null,
        optOutPublicMedia: false,
      },
    });
  }
  console.log('Seeded 78 teams (45 online, 33 pending)');
}

seed().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
