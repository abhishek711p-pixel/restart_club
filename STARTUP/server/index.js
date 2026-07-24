require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5001;

let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_ID !== 'dummy_key') {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const allowedOrigins = [
  'https://restart-club-joam.vercel.app',
  'https://restart-club-n4ou.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('CORS Policy: Access denied for this origin.'));
  },
  credentials: true
}));
app.use(express.json());

// In-memory OTP store for forgot password (email -> { otp, expiresAt })
const otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL || 'dummy@gmail.com',
    pass: process.env.SMTP_PASS || 'dummy_password'
  }
});

// ENDPOINTS

// 1. Users Directory (Admin & Auth)
app.get('/api/users', async (req, res) => {
  try {
    const usersArray = await prisma.user.findMany();
    const usersMap = {};
    usersArray.forEach(u => usersMap[u.email] = u);
    res.json(usersMap);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/users/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  };

  const mailOptions = {
    from: `"RestartClub Support" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'Your RestartClub Password Reset OTP',
    text: `Your OTP for resetting your password is: ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #ea580c;">RestartClub</h2>
        <p>Hello,</p>
        <p>You recently requested to reset your password for your RestartClub account.</p>
        <p>Your 6-digit OTP is: <strong style="font-size: 24px; color: #111827;">${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <br/>
        <p>Best regards,<br/>The RestartClub Team</p>
      </div>
    `
  };

  try {
    if (process.env.SMTP_EMAIL && process.env.SMTP_EMAIL !== 'dummy@gmail.com') {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[DUMMY SMTP] Would send OTP ${otp} to ${email}`);
    }
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send OTP email' });
  }
});

app.post('/api/users/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ error: 'No OTP requested for this email' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ error: 'OTP has expired' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // Success, update password
  await prisma.user.update({
    where: { email },
    data: { password: newPassword }
  });
  
  delete otpStore[email]; // clean up
  res.json({ success: true, message: 'Password reset successful' });
});

// Delete student user account & erase all student data
app.delete('/api/users/:email', async (req, res) => {
  const { email } = req.params;
  try {
    await prisma.task.deleteMany({ where: { email } });
    await prisma.score.deleteMany({ where: { email } });
    await prisma.chat.deleteMany({ where: { email } });
    await prisma.user.deleteMany({ where: { email } });

    res.json({ success: true, message: `Student ${email} and all data completely erased.` });
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Delete specific batch enrollment for a student while keeping other batches intact
app.delete('/api/users/:email/batch/:batch', async (req, res) => {
  const { email, batch } = req.params;
  try {
    await prisma.task.deleteMany({ where: { email, batch } });
    await prisma.score.deleteMany({ where: { email, batch } });

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const remainingBatches = (user.purchasedBatches || []).filter(
        b => b !== batch && b !== `${batch}_standard` && b !== `${batch}_premium`
      );

      if (remainingBatches.length === 0 && user.batch === batch) {
        await prisma.chat.deleteMany({ where: { email } });
        await prisma.user.delete({ where: { email } });
      } else {
        const newPrimaryBatch = user.batch === batch 
          ? (remainingBatches[0]?.replace('_standard', '').replace('_premium', '') || '12') 
          : user.batch;

        await prisma.user.update({
          where: { email },
          data: {
            batch: newPrimaryBatch,
            purchasedBatches: remainingBatches
          }
        });
      }
    }

    res.json({ success: true, message: `Batch ${batch} deleted for ${email}` });
  } catch (err) {
    console.error("Failed to delete user batch:", err);
    res.status(500).json({ error: 'Failed to delete user batch' });
  }
});

app.post('/api/users/register', async (req, res) => {
  const { username, email, password, batch } = req.body;
  
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: { username, email, password, batch, purchasedBatches: [] }
    });

    // Initialize their default tasks from templates
    const planner = await prisma.planner.findUnique({ where: { batch } });
    const defaults = planner ? planner.tasks : [];
    
    if (defaults.length > 0) {
      const taskData = defaults.map((t, idx) => ({
        taskId: `task-${idx}-${Date.now()}`,
        email,
        batch,
        text: t,
        completed: false
      }));
      await prisma.task.createMany({ data: taskData });
    }


    // Welcome chat message
    const mentorMap = {
      '10': { name: "Aarav Sharma", college: "CBSE State Topper (98.6%)" },
      '11': { name: "Sameer Verma", college: "IIT Delhi (EE)" },
      '12': { name: "Divya Patel", college: "IIT Bombay (CSE)" },
      'jee-dropper': { name: "Rohan Gupta", college: "IIT Kharagpur (CSE)" },
      'neet-dropper': { name: "Riya Sen", college: "AIIMS New Delhi (AIR 42)" }
    };
    const mentor = mentorMap[batch] || { name: "RestartClub Senior Topper", college: "IIT/NEET Topper" };
    
    await prisma.chat.create({
      data: {
        email,
        sender: 'mentor',
        text: `Hey ${username}! Welcome to your dashboard. I am your assigned topper mentor, ${mentor.name} (${mentor.college}). Main aapko call pe update dunga, but any query or doubts ke liye type here! Aapki revision sheets share kar di gayi hain left side check karo.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  res.json({ success: true, user });
});

app.post('/api/users/update-password', async (req, res) => {
  const { email, password } = req.body;
  try {
    await prisma.user.update({
      where: { email },
      data: { password }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users/update-batch', async (req, res) => {
  const { email, batch } = req.body;
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { batch }
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users/toggle-payment', async (req, res) => {
  const { email, batch, tier = 'premium' } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const currentBatch = batch || user.batch || '12';
    
    const isPremiumExisting = user.purchasedBatches.includes(currentBatch);
    const isStandardExisting = user.purchasedBatches.includes(`${currentBatch}_standard`);
    const isNewPremiumExisting = user.purchasedBatches.includes(`${currentBatch}_premium`);
    
    let hasStandardAccess = isPremiumExisting || isStandardExisting || isNewPremiumExisting;
    let hasPremiumAccess = isPremiumExisting || isNewPremiumExisting;

    let updatedBatches = user.purchasedBatches.filter(
      b => b !== currentBatch && b !== `${currentBatch}_standard` && b !== `${currentBatch}_premium`
    );

    let addedAccess = false;

    if (tier === 'standard') {
      if (!hasStandardAccess) {
        updatedBatches.push(`${currentBatch}_standard`);
        addedAccess = true;
      }
    } else if (tier === 'premium') {
      if (!hasPremiumAccess) {
        updatedBatches.push(`${currentBatch}_premium`);
        addedAccess = true;
      }
    }
    
    await prisma.user.update({
      where: { email },
      data: { purchasedBatches: updatedBatches }
    });

    res.json({ success: true, bought: addedAccess, purchasedBatches: updatedBatches });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Razorpay Payment Gateway Endpoints
app.post('/api/payments/create-order', async (req, res) => {
  const { email, amount = 49900 } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  if (razorpayInstance) {
    try {
      const options = {
        amount: amount,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      };
      const order = await razorpayInstance.orders.create(options);
      return res.json(order);
    } catch (err) {
      console.error("Razorpay order creation error:", err);
      return res.status(500).json({ error: "Failed to create Razorpay order" });
    }
  }
  
  res.json({ id: "client_only", amount, currency: "INR" });
});

app.post('/api/payments/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, batch, tier = 'premium' } = req.body;
  
  if (razorpay_payment_id) {
    if (razorpayInstance && razorpay_order_id && razorpay_signature) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");
        
      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: "Invalid payment signature verification failed" });
      }
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        let updatedBatches = [...user.purchasedBatches];
        const newEntry = `${batch}_${tier}`;
        
        if (tier === 'premium') {
          updatedBatches = updatedBatches.filter(b => b !== `${batch}_standard`);
        }
        
        if (!updatedBatches.includes(newEntry) && !updatedBatches.includes(batch)) {
          updatedBatches.push(newEntry);
        }
        
        await prisma.user.update({
          where: { email },
          data: { purchasedBatches: updatedBatches }
        });
      }
      return res.json({ success: true, message: "Payment verified successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid payment ID" });
  }
});

// 2. Student Checklist Tasks
app.get('/api/tasks/:email/:batch', async (req, res) => {
  const { email, batch } = req.params;
  const tasks = await prisma.task.findMany({ where: { email, batch } });
  res.json(tasks.map(t => ({ id: t.taskId, text: t.text, completed: t.completed })));
});

app.post('/api/tasks/:email/:batch', async (req, res) => {
  const { email, batch } = req.params;
  const { tasks } = req.body;
  
  try {
    await prisma.task.deleteMany({ where: { email, batch } });
    if (tasks && tasks.length > 0) {
      await prisma.task.createMany({
        data: tasks.map(t => ({
          taskId: t.id || `task-${Date.now()}-${Math.random()}`,
          email,
          batch,
          text: t.text,
          completed: t.completed || false
        }))
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. Mock Test Scores
app.get('/api/scores/:email/:batch', async (req, res) => {
  const { email, batch } = req.params;
  const scores = await prisma.score.findMany({ where: { email, batch } });
  res.json(scores.map(s => ({ id: s.scoreId, subject: s.subject, score: s.score, date: s.date })));
});

app.post('/api/scores/:email/:batch', async (req, res) => {
  const { email, batch } = req.params;
  const { scores } = req.body;
  
  try {
    await prisma.score.deleteMany({ where: { email, batch } });
    if (scores && scores.length > 0) {
      await prisma.score.createMany({
        data: scores.map(s => ({
          scoreId: s.id || `score-${Date.now()}-${Math.random()}`,
          email,
          batch,
          subject: s.subject,
          score: s.score,
          date: s.date
        }))
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/templates/planner/:batch', async (req, res) => {
  const { batch } = req.params;
  try {
    let planner = await prisma.planner.findUnique({ where: { batch } });
    if (!planner) {
      const defaultsMap = {
        '10': ["Complete Science Chapter 4 boards checking", "Solve 10 algebra questions", "Review mock test quiz results"],
        '11': ["Clear Class 11 physics backlog (mechanics)", "Solve 15 Chemistry practice questions", "Read Biology NCERT Chapter 5"],
        '12': ["Practice Class 12 mock writing board sheet", "Attempt physics chapter-wise JEE test", "Revise Chemistry organic conversions"],
        'jee-dropper': ["Solve 20 JEE Mains calculus equations", "Complete inorganic trends notes review", "Attempt 1 full mock test paper"],
        'neet-dropper': ["Read Biology NCERT plant physiology trends", "Revise physics kinematics formula logs", "Solve 30 biology MCQ check sheets"]
      };
      const defaultTasks = defaultsMap[batch] || [];
      planner = await prisma.planner.create({
        data: { batch, tasks: defaultTasks }
      });
    }
    res.json(planner.tasks);
  } catch (err) {
    res.json([]);
  }
});

app.post('/api/templates/planner/:batch', async (req, res) => {
  const { batch } = req.params;
  const { planners } = req.body;
  try {
    await prisma.planner.upsert({
      where: { batch },
      update: { tasks: planners },
      create: { batch, tasks: planners }
    });

    // Auto-update checklist for all students in this batch
    const usersInBatch = await prisma.user.findMany({ where: { batch } });
    for (const u of usersInBatch) {
      await prisma.task.deleteMany({ where: { email: u.email, batch } });
      if (planners && planners.length > 0) {
        const taskData = planners.map((t, idx) => ({
          taskId: `task-${idx}-${Date.now()}`,
          email: u.email,
          batch,
          text: t,
          completed: false
        }));
        await prisma.task.createMany({ data: taskData });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Planner template update error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 5. Revision Notes Templates (Admin Settings)
app.get('/api/templates/notes/:batch', async (req, res) => {
  const { batch } = req.params;
  const notes = await prisma.note.findMany({ where: { batch } });
  res.json(notes.map(n => ({ name: n.name, size: n.size, subject: n.subject || 'Physics' })));
});

app.post('/api/templates/notes/:batch', async (req, res) => {
  const { batch } = req.params;
  const { notes } = req.body;
  try {
    await prisma.note.deleteMany({ where: { batch } });
    if (notes && notes.length > 0) {
      await prisma.note.createMany({
        data: notes.map(n => ({ batch, name: n.name, size: n.size || '4.5 MB', subject: n.subject || 'Physics' }))
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 6. Mentor Chat Workspace
app.get('/api/chat/:email', async (req, res) => {
  const { email } = req.params;
  const chatMsgs = await prisma.chat.findMany({
    where: { email },
    orderBy: { createdAt: 'asc' }
  });
  res.json(chatMsgs.map(c => ({ sender: c.sender, text: c.text, time: c.time, createdAt: c.createdAt })));
});

app.post('/api/chat/:email', async (req, res) => {
  const { email } = req.params;
  const { chat } = req.body;
  try {
    await prisma.chat.deleteMany({ where: { email } });
    if (chat && chat.length > 0) {
      await prisma.chat.createMany({
        data: chat.map(c => ({
          email,
          sender: c.sender,
          text: c.text,
          time: c.time,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date()
        }))
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Live RestartClub API Server active on port ${PORT}`);
});
module.exports = app;
