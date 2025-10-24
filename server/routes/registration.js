import express from 'express';
import {
  createRegistration,
  getAllRegistrations,
  getRegistrationByEmail
} from '../controllers/registrationController.js';

const router = express.Router();

console.log("Registration routes loaded")
// POST /api/register - Create new registration
router.post('/register', createRegistration);

// GET /api/registrations - Get all registrations
router.get('/registrations', getAllRegistrations);

// GET /api/registration/:email - Get registration by email
router.get('/registration/:email', getRegistrationByEmail);

export default router;