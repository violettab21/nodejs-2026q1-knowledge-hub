import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
const connectionString =
  process.env.MODE?.trim() === 'localhost'
    ? `${process.env.DATABASE_URL_LOCALHOST}`
    : `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const tags = [
  'Tech Reviews',
  'Workout Plans',
  'Travel Photography',
  'AI',
  'Healthy Lifestyle',
];
const categories = [
  {
    name: 'Technology',
    description:
      'Explore the latest trends, innovations, and updates in the tech world.',
  },
  {
    name: 'Health & Wellness',
    description:
      'Your go-to source for tips on maintaining a healthy lifestyle, fitness routines, mental health, and overall well-being.',
  },
  {
    name: 'Travel',
    description:
      'Discover travel destinations, guides, tips, and experiences from around the world to inspire your next adventure.',
  },
];

async function main() {
  const admin = await prisma.user.upsert({
    where: { login: 'admin_user' },
    update: {},
    create: {
      login: 'admin_user',
      password: '12345',
      role: 'ADMIN',
    },
  });

  const editor = await prisma.user.upsert({
    where: { login: 'editor_user' },
    update: {},
    create: {
      login: 'editor_user',
      password: '54321',
      role: 'EDITOR',
    },
  });

  const createdCategories = await prisma.category.createManyAndReturn({
    data: [...categories],
  });

  const createdTags = await Promise.all(
    tags.map((tag) => {
      return prisma.tag.upsert({
        where: { name: tag },
        update: {},
        create: {
          name: tag,
        },
      });
    }),
  );

  const article1 = await prisma.article.create({
    data: {
      title: 'AI Innovations',
      content:
        'Latest advancements and applications of artificial intelligence across industries.',
      status: 'DRAFT',
      authorId: editor.id,
      categoryId: createdCategories[0].id,
      tags: {
        connect: [{ id: createdTags[0].id }, { id: createdTags[3].id }],
      },
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: 'Tech Reviews',
      content:
        'In-depth reviews and comparisons of the latest gadgets, devices, and tech tools.',
      status: 'DRAFT',
      authorId: admin.id,
      categoryId: createdCategories[0].id,
      tags: {
        connect: [{ id: createdTags[0].id }],
      },
    },
  });

  const article3 = await prisma.article.create({
    data: {
      title: 'Budget Travel',
      content:
        'Travel guides, tips, and hacks for exploring the world on a tight budget.',
      status: 'PUBLISHED',
      authorId: admin.id,
      categoryId: createdCategories[2].id,
      tags: {
        connect: [{ id: createdTags[2].id }],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Fitness Tips',
      content:
        'Effective workout routines and fitness tips to help you stay active and healthy.',
      status: 'ARCHIVED',
      authorId: editor.id,
      categoryId: createdCategories[1].id,
      tags: {
        connect: [
          { id: createdTags[1].id },
          { id: createdTags[3].id },
          { id: createdTags[4].id },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Sleep & Relaxation',
      content:
        'Tips for achieving better sleep and reducing stress in your daily life.',
      status: 'PUBLISHED',
      authorId: admin.id,
      categoryId: createdCategories[1].id,
      tags: {
        connect: [{ id: createdTags[4].id }],
      },
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        content: 'Great article',
        authorId: admin.id,
        articleId: article1.id,
      },
      {
        content: 'Really useful article. Thank you',
        authorId: editor.id,
        articleId: article2.id,
      },
      {
        content: 'Thank you for the article.',
        authorId: admin.id,
        articleId: article3.id,
      },
    ],
  });
}

main().then(async () => {
  console.log('Seed completed.');
  await prisma.$disconnect();
  await pool.end();
});
