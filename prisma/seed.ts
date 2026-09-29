import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Create Default Admin
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@exam.com' },
    update: {},
    create: {
      email: 'admin@exam.com',
      passwordHash: adminPasswordHash,
      name: 'Super Admin'
    }
  });

  // Create Exams
  const gate = await prisma.exam.upsert({
    where: { slug: 'gate' },
    update: {},
    create: {
      name: 'GATE',
      slug: 'gate',
      description: 'Graduate Aptitude Test in Engineering',
    },
  });

  const jee = await prisma.exam.upsert({
    where: { slug: 'jee-main' },
    update: {},
    create: {
      name: 'JEE Main',
      slug: 'jee-main',
      description: 'Joint Entrance Examination Main',
    },
  });

  const neet = await prisma.exam.upsert({
    where: { slug: 'neet' },
    update: {},
    create: {
      name: 'NEET',
      slug: 'neet',
      description: 'National Eligibility cum Entrance Test',
    },
  });

  // Create PYQs for GATE
  await prisma.pyq.createMany({
    data: [
      {
        examId: gate.id,
        title: 'GATE 2025 CS Question Paper',
        year: 2025,
        fileUrl: 'mock/gate-2025-cs.pdf',
        fileName: 'gate-2025-cs.pdf',
        fileSize: 1024500,
        mimeType: 'application/pdf',
      },
      {
        examId: gate.id,
        title: 'GATE 2024 CS Question Paper',
        year: 2024,
        fileUrl: 'mock/gate-2024-cs.pdf',
        fileName: 'gate-2024-cs.pdf',
        fileSize: 980000,
        mimeType: 'application/pdf',
      },
      {
        examId: jee.id,
        title: 'JEE Main 2025 Shift 1',
        year: 2025,
        fileUrl: 'mock/jee-2025-1.pdf',
        fileName: 'jee-2025-1.pdf',
        fileSize: 1500000,
        mimeType: 'application/pdf',
      }
    ],
    skipDuplicates: true
  });

  // Create Tutorials for GATE
  await prisma.tutorial.createMany({
    data: [
      {
        examId: gate.id,
        title: 'GATE CS 2025 Complete Strategy',
        youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeVideoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        year: 2025,
      },
      {
        examId: neet.id,
        title: 'NEET Biology Rapid Revision',
        youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeVideoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        year: 2024,
      }
    ],
    skipDuplicates: true
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
