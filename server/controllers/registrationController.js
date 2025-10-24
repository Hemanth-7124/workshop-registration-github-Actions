import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendThankYouEmail } from '../../service/emailService.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });


const db = mysql.createPool({
  host: process.env.MYSQL_HOST || process.env.DB_HOST,
  port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306'),
  user: process.env.MYSQL_USER || process.env.DB_USER,
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000, // 60 seconds
});

db.on('error', err => {
  console.error('Database connection lost:', err);
});




// Test the connection
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ Connected to AWS RDS successfully!');
    conn.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
})();



console.log("DB connection",db)

console.log("Loading registration controller...");

const createRegistration = async (req, res) => {

  console.log("Creating registration...");
  try {
    const { student_name, student_email, workshop_name, mode } = req.body;
    console.log('Registration request:', req.body);

    // Validate required fields
    if (!student_name || !student_email || !workshop_name || !mode) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student_email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate workshop mode
    if (!['Online', 'Offline'].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workshop mode'
      });
    }

    // Create new registration using the server's executeQuery function
    const registrationResult = await db.execute(
      `INSERT INTO workshop_registrations (studentName, emailId, workshopName, workshopMode)
       VALUES (?, ?, ?, ?)`,
      [
        student_name.trim(),
        student_email.trim().toLowerCase(),
        workshop_name.trim(),
        mode.trim()
      ]
    );

    // Send thank you email (async, don't wait for it)
     // ✅ Send thank you email asynchronously (non-blocking)
    sendThankYouEmail({
      student_name,
      student_email,
      workshop_name,
      mode
    }).catch((err) => console.error('Email sending failed:', err.message));
 

    // Return success response
    res.status(201).json({
      success: true,
      message: `Successfully registered for ${workshop_name}! A confirmation email has been sent to ${student_email}.`,
      data: {
        id: registrationResult.insertId,
        student_name,
        student_email,
        workshop_name,
        mode,
        registration_date: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during registration. Please try again.'
    });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await req.app.locals.executeQuery(
      'SELECT * FROM workshop_registrations ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      message: 'Registrations retrieved successfully',
      data: registrations,
      count: registrations.length
    });

  } catch (error) {
    console.error('Error retrieving registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations'
    });
  }
};

const getRegistrationByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    const registration = await req.app.locals.executeQuery(
      'SELECT * FROM workshop_registrations WHERE emailId = ?',
      [email]
    );

    if (registration.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No registration found for this email'
      });
    }

    res.json({
      success: true,
      message: 'Registration found',
      data: registration[0]
    });

  } catch (error) {
    console.error('Error retrieving registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registration'
    });
  }
};

export {
  createRegistration,
  getAllRegistrations,
  getRegistrationByEmail
};