# Workshop Registration System

A modern student workshop registration system built with Nuxt 4, Node.js, and MySQL. The system allows students to register for various workshops and automatically sends thank-you emails with registration details.

## Features

- 🎓 Workshop registration form with validation
- 📧 Automatic thank-you email delivery
- 🗄️ MySQL database for registration storage
- 🎨 Modern, responsive UI design
- ✅ Client-side and server-side validation
- 📱 Mobile-friendly interface
- 🔒 Secure API endpoints

## Tech Stack

- **Frontend**: Nuxt 4, Vue 3
- **Backend**: Node.js, Nuxt Server API
- **Database**: MySQL
- **Email Service**: Nodemailer
- **Styling**: CSS3 with modern design

## Project Structure

```
workshop-registration-system/
├── app/
│   └── app.vue                    # Main application component
├── components/
│   └── WorkshopRegistrationForm.vue  # Registration form component
├── server/
│   └── api/
│       ├── register.post.js       # Registration API endpoint
│       └── registrations.get.js   # Get all registrations endpoint
├── service/
│   └── emailService.js            # Email sending service
├── utils/
│   └── db.js                      # Database connection utilities
├── database/
│   └── schema.sql                 # Database schema
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- npm or yarn

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

1. Create a MySQL database using the provided schema:

```bash
mysql -u root -p < database/schema.sql
```

2. Or manually execute the SQL commands in `database/schema.sql`

### 4. Environment Configuration

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=workshop_registration

# Email Configuration (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
FROM_EMAIL=your_email@gmail.com
FROM_NAME=Workshop Registration System
```

**Email Setup Notes:**
- For Gmail, enable 2-factor authentication and create an App Password
- For other email providers, adjust SMTP settings accordingly

### 5. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### POST /api/register
Register a student for a workshop.

**Request Body:**
```json
{
  "student_name": "John Doe",
  "student_email": "john@example.com",
  "workshop_name": "Web Development Basics",
  "mode": "Online"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered for Web Development Basics!",
  "data": {
    "id": 1,
    "student_name": "John Doe",
    "student_email": "john@example.com",
    "workshop_name": "Web Development Basics",
    "mode": "Online",
    "registration_date": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /api/registrations
Get all workshop registrations (admin endpoint).

**Response:**
```json
{
  "success": true,
  "message": "Registrations retrieved successfully",
  "data": [
    {
      "id": 1,
      "student_name": "John Doe",
      "student_email": "john@example.com",
      "workshop_name": "Web Development Basics",
      "mode": "Online",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

## Database Schema

The `workshop_registrations` table structure:

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | PRIMARY KEY |
| student_name | VARCHAR(255) | NOT NULL |
| student_email | VARCHAR(255) | NOT NULL, UNIQUE |
| workshop_name | VARCHAR(255) | NOT NULL |
| mode | ENUM('Online', 'Offline') | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

## Form Validation

The registration form includes comprehensive validation:

- **Student Name**: Required, minimum 2 characters
- **Email**: Required, valid email format, unique
- **Workshop**: Required selection from dropdown
- **Mode**: Required (Online/Offline selection)

## Email Templates

The system sends a professionally designed HTML email with:

- Personalized greeting
- Workshop details and mode information
- Next steps based on workshop mode
- Modern, responsive design

## Development

### Adding New Workshops

To add new workshop options, update the `workshop_name` select options in `components/WorkshopRegistrationForm.vue`:

```vue
<option value="New Workshop Name">New Workshop Name</option>
```

### Customizing Email Templates

Modify the `generateThankYouEmail` function in `service/emailService.js` to customize email content and styling.

### Database Modifications

Update `database/schema.sql` for any database structure changes and modify the corresponding database utilities in `utils/db.js`.

## Production Deployment

### Build the application:

```bash
npm run build
```

### Preview production build:

```bash
npm run preview
```

### Deployment Considerations:

1. Set production environment variables
2. Ensure MySQL server is accessible
3. Configure proper email service credentials
4. Set up proper CORS if needed
5. Consider adding rate limiting for the registration endpoint

## Security Features

- Input validation and sanitization
- SQL injection prevention with parameterized queries
- Email validation
- Duplicate registration prevention
- Secure environment variable handling

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL server status
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check firewall settings
   - For Gmail, ensure App Password is used

3. **Form Validation Errors**
   - Check browser console for JavaScript errors
   - Verify all required fields are filled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support and questions, please open an issue in the repository.
