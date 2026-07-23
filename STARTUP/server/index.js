require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
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

// Load / Initialize local database JSON file
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: {},
      tasks: {},
      scores: {},
      chat: {},
      planners: {
        '10': ["Complete Science Chapter 4 boards checking", "Solve 10 algebra questions", "Review mock test quiz results"],
        '11': ["Clear Class 11 physics backlog (mechanics)", "Solve 15 Chemistry practice questions", "Read Biology NCERT Chapter 5"],
        '12': ["Practice Class 12 mock writing board sheet", "Attempt physics chapter-wise JEE test", "Revise Chemistry organic conversions"],
        'jee-dropper': ["Solve 20 JEE Mains calculus equations", "Complete inorganic trends notes review", "Attempt 1 full mock test paper"],
        'neet-dropper': ["Read Biology NCERT plant physiology trends", "Revise physics kinematics formula logs", "Solve 30 biology MCQ check sheets"]
      },
      notes: {
        '10': [
          { name: "Science Boards handwritten notes.pdf", size: "4.8 MB" },
          { name: "Maths NTSE & Olympiad cheat sheet.pdf", size: "2.1 MB" },
          { name: "Class 10 CBSE Sample writing checks.pdf", size: "3.5 MB" }
        ],
        '11': [
          { name: "Physics Class 11 formulas summary.pdf", size: "5.2 MB" },
          { name: "Inorganic Chemistry trend sheets.pdf", size: "3.8 MB" },
          { name: "Mathematics coordinate geometry tracker.pdf", size: "4.1 MB" }
        ],
        '12': [
          { name: "Physics Boards & JEE core cheatsheet.pdf", size: "6.1 MB" },
          { name: "Organic Chemistry named reactions notes.pdf", size: "4.5 MB" },
          { name: "Mathematics calculus boards check sheet.pdf", size: "5.0 MB" }
        ],
        'jee-dropper': [
          { name: "JEE Main and Advanced physics notes.pdf", size: "8.4 MB" },
          { name: "Physical Chemistry formula logs.pdf", size: "5.9 MB" },
          { name: "Coordinate Geometry Advanced problem sheet.pdf", size: "7.2 MB" }
        ],
        'neet-dropper': [
          { name: "Biology NCERT-blueprint short sheets.pdf", size: "11.2 MB" },
          { name: "Physics NEET-UG formula logs.pdf", size: "4.8 MB" },
          { name: "Organic Chemistry mock logs sheet.pdf", size: "6.5 MB" }
        ]
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  let dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let needsSave = false;

  // Migrate users: bought -> purchasedBatches
  Object.values(dbData.users).forEach(user => {
    if (user.purchasedBatches === undefined) {
      user.purchasedBatches = user.bought ? [user.batch] : [];
      delete user.bought;
      needsSave = true;
    }
  });

  // Migrate tasks and scores from email to email_batch
  Object.keys(dbData.tasks).forEach(email => {
    if (Array.isArray(dbData.tasks[email])) {
      const user = dbData.users[email];
      if (user) {
        dbData.tasks[`${email}_${user.batch}`] = dbData.tasks[email];
      }
      delete dbData.tasks[email];
      needsSave = true;
    }
  });
  
  Object.keys(dbData.scores).forEach(email => {
    if (Array.isArray(dbData.scores[email])) {
      const user = dbData.users[email];
      if (user) {
        dbData.scores[`${email}_${user.batch}`] = dbData.scores[email];
      }
      delete dbData.scores[email];
      needsSave = true;
    }
  });

  if (needsSave) {
    saveDB(dbData);
  }

  return dbData;
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ENDPOINTS

// 1. Users Directory (Admin & Auth)
app.get('/api/users', (req, res) => {
  const db = loadDB();
  res.json(db.users);
});

app.post('/api/users/forgot-password', async (req, res) => {
  const { email } = req.body;
  const db = loadDB();

  if (!db.users[email]) {
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

app.post('/api/users/reset-password', (req, res) => {
  const { email, otp, newPassword } = req.body;
  const db = loadDB();

  if (!db.users[email]) {
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
  db.users[email].password = newPassword;
  saveDB(db);
  delete otpStore[email]; // clean up
  
  res.json({ success: true, message: 'Password reset successful' });
});

app.post('/api/users/register', (req, res) => {
  const { username, email, password, batch } = req.body;
  const db = loadDB();

  if (db.users[email]) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Save new user profile
  db.users[email] = { username, email, password, batch, purchasedBatches: [] };

  // Initialize their default tasks from templates
  const defaults = db.planners[batch] || [];
  db.tasks[`${email}_${batch}`] = defaults.map((t, idx) => ({
    id: `task-${idx}-${Date.now()}`,
    text: t,
    completed: false
  }));

  // Initialize mock test scores
  db.scores[`${email}_${batch}`] = [
    { id: '1', subject: 'Physics Mock 1', score: 82, date: '2026-07-15' },
    { id: '2', subject: 'Chemistry Revision Test', score: 88, date: '2026-07-18' },
    { id: '3', subject: 'Math/Bio Olympiad Prep', score: 76, date: '2026-07-20' }
  ];

  // Welcome chat message
  const mentorMap = {
    '10': { name: "Aarav Sharma", college: "CBSE State Topper (98.6%)" },
    '11': { name: "Sameer Verma", college: "IIT Delhi (EE)" },
    '12': { name: "Divya Patel", college: "IIT Bombay (CSE)" },
    'jee-dropper': { name: "Rohan Gupta", college: "IIT Kharagpur (CSE)" },
    'neet-dropper': { name: "Riya Sen", college: "AIIMS New Delhi (AIR 42)" }
  };
  const mentor = mentorMap[batch] || { name: "RestartClub Senior Topper", college: "IIT/NEET Topper" };
  db.chat[email] = [
    {
      sender: 'mentor',
      text: `Hey ${username}! Welcome to your dashboard. I am your assigned topper mentor, ${mentor.name} (${mentor.college}). Main aapko call pe update dunga, but any query or doubts ke liye type here! Aapki revision sheets share kar di gayi hain left side check karo.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  saveDB(db);
  res.json({ success: true, user: db.users[email] });
});

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const db = loadDB();

  const user = db.users[email];
  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  res.json({ success: true, user });
});

app.post('/api/users/update-password', (req, res) => {
  const { email, password } = req.body;
  const db = loadDB();

  if (!db.users[email]) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.users[email].password = password;
  saveDB(db);
  res.json({ success: true });
});

app.post('/api/users/update-batch', (req, res) => {
  const { email, batch } = req.body;
  const db = loadDB();

  if (!db.users[email]) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.users[email].batch = batch;
  saveDB(db);
  res.json({ success: true, user: db.users[email] });
});

app.post('/api/users/toggle-payment', (req, res) => {
  const { email, batch, tier = 'premium' } = req.body;
  const db = loadDB();

  if (!db.users[email]) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = db.users[email];
  if (!user.purchasedBatches) user.purchasedBatches = [];
  
  const currentBatch = batch || user.batch || '12';
  
  // Format for purchased batches: "{batch}_{tier}".
  // Backward compatibility: If an array element is exactly "{batch}", it implies premium.
  const isPremiumExisting = user.purchasedBatches.includes(currentBatch);
  const isStandardExisting = user.purchasedBatches.includes(`${currentBatch}_standard`);
  const isNewPremiumExisting = user.purchasedBatches.includes(`${currentBatch}_premium`);
  
  let hasStandardAccess = isPremiumExisting || isStandardExisting || isNewPremiumExisting;
  let hasPremiumAccess = isPremiumExisting || isNewPremiumExisting;

  // We are toggling the specific tier
  // If admin toggles standard, we either remove it (if they only had standard) or add standard.
  // Wait, the logic is simpler:
  // If toggling standard:
  //   - If they currently have standard or premium, we revoke ALL access for this batch.
  //   - If they have no access, we grant standard.
  // If toggling premium:
  //   - If they currently have premium, we revoke ALL access.
  //   - If they have no access or only standard, we upgrade them to premium.

  // First, remove all variations of this batch from the array to clean it up
  user.purchasedBatches = user.purchasedBatches.filter(b => b !== currentBatch && b !== `${currentBatch}_standard` && b !== `${currentBatch}_premium`);

  let addedAccess = false;

  if (tier === 'standard') {
    if (!hasStandardAccess) {
      user.purchasedBatches.push(`${currentBatch}_standard`);
      addedAccess = true;
    }
    // If they already had access, we just removed it above, so it acts as a toggle-off
  } else if (tier === 'premium') {
    if (!hasPremiumAccess) {
      user.purchasedBatches.push(`${currentBatch}_premium`);
      addedAccess = true;
    }
  }
  
  saveDB(db);

  res.json({ success: true, bought: addedAccess, purchasedBatches: user.purchasedBatches });
});

// Razorpay Payment Gateway Endpoints
app.post('/api/payments/create-order', async (req, res) => {
  const { email } = req.body;
  const db = loadDB();
  
  if (!db.users[email]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Client-side integration bypass: No need to create a server order
  res.json({ id: "client_only", amount: 50000, currency: "INR" });
});

app.post('/api/payments/verify', (req, res) => {
  const { razorpay_payment_id, email, batch, tier = 'premium' } = req.body;
  
  if (razorpay_payment_id) {
    // Payment is verified directly from client success
    const db = loadDB();
    if (db.users[email]) {
      if (!db.users[email].purchasedBatches) {
        db.users[email].purchasedBatches = [];
      }
      
      const newEntry = `${batch}_${tier}`;
      
      // Remove any existing standard if upgrading to premium
      if (tier === 'premium') {
        db.users[email].purchasedBatches = db.users[email].purchasedBatches.filter(b => b !== `${batch}_standard`);
      }
      
      if (!db.users[email].purchasedBatches.includes(newEntry) && !db.users[email].purchasedBatches.includes(batch)) {
        db.users[email].purchasedBatches.push(newEntry);
      }
      saveDB(db);
    }
    return res.json({ success: true, message: "Payment verified successfully" });
  } else {
    return res.status(400).json({ error: "Invalid payment ID" });
  }
});

// 2. Student Checklist Tasks
app.get('/api/tasks/:email/:batch', (req, res) => {
  const { email, batch } = req.params;
  const db = loadDB();
  res.json(db.tasks[`${email}_${batch}`] || []);
});

app.post('/api/tasks/:email/:batch', (req, res) => {
  const { email, batch } = req.params;
  const { tasks } = req.body;
  const db = loadDB();

  db.tasks[`${email}_${batch}`] = tasks;
  saveDB(db);
  res.json({ success: true });
});

// 3. Mock Test Scores
app.get('/api/scores/:email/:batch', (req, res) => {
  const { email, batch } = req.params;
  const db = loadDB();
  res.json(db.scores[`${email}_${batch}`] || []);
});

app.post('/api/scores/:email/:batch', (req, res) => {
  const { email, batch } = req.params;
  const { scores } = req.body;
  const db = loadDB();

  db.scores[`${email}_${batch}`] = scores;
  saveDB(db);
  res.json({ success: true });
});

// 4. Batch Planners Templates (Admin Settings)
app.get('/api/templates/planner/:batch', (req, res) => {
  const { batch } = req.params;
  const db = loadDB();
  res.json(db.planners[batch] || []);
});

app.post('/api/templates/planner/:batch', (req, res) => {
  const { batch } = req.params;
  const { planners } = req.body;
  const db = loadDB();

  db.planners[batch] = planners;
  saveDB(db);
  res.json({ success: true });
});

// 5. Revision Notes Templates (Admin Settings)
app.get('/api/templates/notes/:batch', (req, res) => {
  const { batch } = req.params;
  const db = loadDB();
  res.json(db.notes[batch] || []);
});

app.post('/api/templates/notes/:batch', (req, res) => {
  const { batch } = req.params;
  const { notes } = req.body;
  const db = loadDB();

  db.notes[batch] = notes;
  saveDB(db);
  res.json({ success: true });
});

// 6. Mentor Chat Workspace
app.get('/api/chat/:email', (req, res) => {
  const { email } = req.params;
  const db = loadDB();
  res.json(db.chat[email] || []);
});

app.post('/api/chat/:email', (req, res) => {
  const { email } = req.params;
  const { chat } = req.body;
  const db = loadDB();

  db.chat[email] = chat;
  saveDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Shared RestartClub Database API Server active on http://localhost:${PORT}`);
});
