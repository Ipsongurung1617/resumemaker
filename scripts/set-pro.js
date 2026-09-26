const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  const email = 'ipsongrg221@gmail.com';

  // Check if user exists
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    console.log(`❌ No user found with email: ${email}`);
    console.log('They may not have registered yet.');
    return;
  }

  console.log(`Found user: ${user.name || '(no name)'} — current plan: ${user.plan}`);

  // Update to pro
  const updated = await db.user.update({
    where: { email },
    data: { plan: 'pro' },
  });

  console.log(`✅ Updated ${email} → plan: ${updated.plan}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
