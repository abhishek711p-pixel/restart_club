const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrate() {
  const DB_FILE = path.join(__dirname, 'db.json');
  if (!fs.existsSync(DB_FILE)) {
    console.log("No db.json found. Nothing to migrate.");
    return;
  }

  const dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

  console.log("Migrating users...");
  for (const email of Object.keys(dbData.users || {})) {
    const user = dbData.users[email];
    await prisma.user.upsert({
      where: { email },
      update: {
        username: user.username,
        password: user.password,
        batch: user.batch,
        purchasedBatches: user.purchasedBatches || [],
      },
      create: {
        email: user.email,
        username: user.username,
        password: user.password,
        batch: user.batch,
        purchasedBatches: user.purchasedBatches || [],
      }
    });
  }

  console.log("Migrating tasks...");
  for (const email_batch of Object.keys(dbData.tasks || {})) {
    const parts = email_batch.split('_');
    const email = parts[0];
    const batch = parts[1];
    const tasks = dbData.tasks[email_batch];
    
    // Clear old tasks for this combo to avoid duplicates
    await prisma.task.deleteMany({ where: { email, batch } });
    
    if (tasks && tasks.length > 0) {
      await prisma.task.createMany({
        data: tasks.map(t => ({
          taskId: t.id,
          email,
          batch,
          text: t.text,
          completed: t.completed || false
        }))
      });
    }
  }

  console.log("Migrating scores...");
  for (const email_batch of Object.keys(dbData.scores || {})) {
    const parts = email_batch.split('_');
    const email = parts[0];
    const batch = parts[1];
    const scores = dbData.scores[email_batch];
    
    await prisma.score.deleteMany({ where: { email, batch } });
    
    if (scores && scores.length > 0) {
      await prisma.score.createMany({
        data: scores.map(s => ({
          scoreId: s.id,
          email,
          batch,
          subject: s.subject,
          score: s.score,
          date: s.date
        }))
      });
    }
  }

  console.log("Migrating chat...");
  for (const email of Object.keys(dbData.chat || {})) {
    const chatMsgs = dbData.chat[email];
    await prisma.chat.deleteMany({ where: { email } });
    
    if (chatMsgs && chatMsgs.length > 0) {
      await prisma.chat.createMany({
        data: chatMsgs.map(c => ({
          email,
          sender: c.sender,
          text: c.text,
          time: c.time,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date()
        }))
      });
    }
  }

  console.log("Migrating planners...");
  for (const batch of Object.keys(dbData.planners || {})) {
    const tasks = dbData.planners[batch];
    await prisma.planner.deleteMany({ where: { batch } });
    
    await prisma.planner.create({
      data: {
        batch,
        tasks
      }
    });
  }

  console.log("Migrating notes...");
  for (const batch of Object.keys(dbData.notes || {})) {
    const notes = dbData.notes[batch];
    await prisma.note.deleteMany({ where: { batch } });
    
    if (notes && notes.length > 0) {
      await prisma.note.createMany({
        data: notes.map(n => ({
          batch,
          name: n.name,
          size: n.size
        }))
      });
    }
  }

  console.log("Migration complete!");
}

migrate()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
