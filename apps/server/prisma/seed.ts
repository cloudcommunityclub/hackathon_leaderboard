import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const TRACKS = ['AI Track', 'Web Track', 'Open Innovation', 'Hardware', 'Cybersecurity'];
const COLLEGES = [
  'SNIST Hyderabad', 'IIIT Hyderabad', 'IIT Madras', 'IIT Bombay', 'BITS Pilani',
  'NIT Warangal', 'VIT Vellore', 'JNTU Hyderabad', 'OU Hyderabad', 'CBIT Hyderabad'
];

async function seed() {
  for (let i = 0; i < 78; i++) {
    const name = `Team ${faker.string.alphanumeric({ length: 8 }).toUpperCase()}`;
    await prisma.team.create({
      data: {
        name,
        college: COLLEGES[i % COLLEGES.length],
        track: TRACKS[i % TRACKS.length],
        table: `T${(i % 12) + 1}`,
        status: 'pending',
        checkedInAt: null,
        optOutPublicMedia: false,
      },
    });
  }
  console.log('Seeded 78 teams');
}

seed().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
