import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample pages with sections
  const page1 = await prisma.page.create({
    data: {
      title: 'Home Page',
      slug: 'home',
      sections: {
        create: [
          {
            type: 'hero',
            content: {
              title: 'Welcome to Our Website',
              subtitle: 'Build amazing websites with ease',
              backgroundImage: '/hero-bg.jpg'
            },
            order: 1,
          },
          {
            type: 'text',
            content: {
              text: 'This is a sample text section with rich content.',
              alignment: 'center'
            },
            order: 2,
          },
        ],
      },
    },
  });

  const page2 = await prisma.page.create({
    data: {
      title: 'About Us',
      slug: 'about',
      sections: {
        create: [
          {
            type: 'text',
            content: {
              title: 'About Our Company',
              text: 'We are a company dedicated to building great websites.',
              alignment: 'left'
            },
            order: 1,
          },
        ],
      },
    },
  });

  console.log('Created pages:', { page1, page2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 