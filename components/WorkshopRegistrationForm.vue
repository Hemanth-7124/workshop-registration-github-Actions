<template>
  <div class="registration-container">
    <div class="form-card">
      <div class="form-header">
        <h1>🎓 Workshop Registration</h1>
        <p>Register for our upcoming workshops</p>
      </div>

      <form @submit.prevent="handleSubmit" class="registration-form">
        <div class="form-group">
          <label for="student_name">Student Name *</label>
          <input
            id="student_name"
            v-model="form.student_name"
            type="text"
            required
            placeholder="Enter your full name"
            :class="{ 'error': errors.student_name }"
          />
          <span v-if="errors.student_name" class="error-message">{{ errors.student_name }}</span>
        </div>

        <div class="form-group">
          <label for="student_email">Email Address *</label>
          <input
            id="student_email"
            v-model="form.student_email"
            type="email"
            required
            placeholder="your.email@example.com"
            :class="{ 'error': errors.student_email }"
          />
          <span v-if="errors.student_email" class="error-message">{{ errors.student_email }}</span>
        </div>

        <div class="form-group">
          <label for="workshop_name">Workshop Name *</label>
          <select
            id="workshop_name"
            v-model="form.workshop_name"
            required
            :class="{ 'error': errors.workshop_name }"
          >
            <option value="">Select a workshop</option>
            <option value="Web Development Basics">Web Development Basics</option>
            <option value="Advanced JavaScript">Advanced JavaScript</option>
            <option value="React.js Fundamentals">React.js Fundamentals</option>
            <option value="Node.js Backend Development">Node.js Backend Development</option>
            <option value="Database Design & SQL">Database Design & SQL</option>
            <option value="UI/UX Design Principles">UI/UX Design Principles</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="Cloud Computing Basics">Cloud Computing Basics</option>
          </select>
          <span v-if="errors.workshop_name" class="error-message">{{ errors.workshop_name }}</span>
        </div>

        <div class="form-group">
          <label class="mode-label">Workshop Mode *</label>
          <div class="mode-options">
            <label class="mode-option">
              <input
                type="radio"
                v-model="form.mode"
                value="Online"
                required
              />
              <span class="mode-indicator online">💻 Online</span>
            </label>
            <label class="mode-option">
              <input
                type="radio"
                v-model="form.mode"
                value="Offline"
                required
              />
              <span class="mode-indicator offline">🏢 Offline</span>
            </label>
          </div>
          <span v-if="errors.mode" class="error-message">{{ errors.mode }}</span>
        </div>

        <div v-if="form.mode" class="mode-info">
          <div v-if="form.mode === 'Online'" class="info-box online">
            <strong>Online Workshop:</strong> You will receive a meeting link via email before the workshop.
          </div>
          <div v-else class="info-box offline">
            <strong>Offline Workshop:</strong> Please arrive at the venue 15 minutes before the scheduled time.
          </div>
        </div>

        <button
          type="submit"
          class="submit-btn"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">
            <span class="spinner"></span>
            Registering...
          </span>
          <span v-else>Register for Workshop</span>
        </button>
      </form>

      <div v-if="successMessage" class="success-message">
        <h3>🎉 Registration Successful!</h3>
        <p>{{ successMessage }}</p>
      </div>

      <div v-if="errorMessage" class="error-message-box">
        <h3>❌ Registration Failed</h3>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// Form state
const form = ref({
  student_name: '',
  student_email: '',
  workshop_name: '',
  mode: ''
})

// UI state
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const errors = ref({})

// Validate form
const validateForm = () => {
  errors.value = {}

  if (!form.value.student_name.trim()) {
    errors.value.student_name = 'Student name is required'
  } else if (form.value.student_name.trim().length < 2) {
    errors.value.student_name = 'Name must be at least 2 characters long'
  }

  if (!form.value.student_email.trim()) {
    errors.value.student_email = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.student_email)) {
    errors.value.student_email = 'Please enter a valid email address'
  }

  if (!form.value.workshop_name) {
    errors.value.workshop_name = 'Please select a workshop'
  }

  if (!form.value.mode) {
    errors.value.mode = 'Please select a workshop mode'
  }

  return Object.keys(errors.value).length === 0
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await $fetch(`${apiBase}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: form.value
    })

    successMessage.value = response.message || 'Registration successful! A confirmation email has been sent to your email address.'

    // Reset form
    form.value = {
      student_name: '',
      student_email: '',
      workshop_name: '',
      mode: ''
    }

  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = error.data?.message || error.message || 'Registration failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Page metadata
useHead({
  title: 'Workshop Registration System',
  meta: [
    { name: 'description', content: 'Register for upcoming workshops and enhance your skills' }
  ]
})
</script>

<style scoped>
.registration-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.form-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
}

.form-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.form-header h1 {
  margin: 0 0 10px 0;
  font-size: 2rem;
  font-weight: 700;
}

.form-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.registration-form {
  padding: 40px 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group input.error,
.form-group select.error {
  border-color: #ef4444;
}

.mode-label {
  margin-bottom: 15px;
}

.mode-options {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.mode-option {
  flex: 1;
  cursor: pointer;
}

.mode-option input[type="radio"] {
  display: none;
}

.mode-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: white;
}

.mode-option input[type="radio"]:checked + .mode-indicator {
  border-color: #4f46e5;
  background: #4f46e5;
  color: white;
}

.mode-indicator.online {
  border-color: #10b981;
}

.mode-indicator.offline {
  border-color: #f59e0b;
}

.mode-info {
  margin: 20px 0;
}

.info-box {
  padding: 15px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.info-box.online {
  background: #d1fae5;
  border: 1px solid #10b981;
  color: #065f46;
}

.info-box.offline {
  background: #fed7aa;
  border: 1px solid #f59e0b;
  color: #92400e;
}

.submit-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.success-message {
  margin: 20px 30px 30px;
  padding: 20px;
  background: #d1fae5;
  border: 1px solid #10b981;
  border-radius: 10px;
  color: #065f46;
  text-align: center;
}

.success-message h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
}

.error-message-box {
  margin: 20px 30px 30px;
  padding: 20px;
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 10px;
  color: #991b1b;
  text-align: center;
}

.error-message-box h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
}

@media (max-width: 640px) {
  .registration-container {
    padding: 10px;
  }

  .form-header {
    padding: 30px 20px;
  }

  .registration-form {
    padding: 30px 20px;
  }

  .mode-options {
    flex-direction: column;
    gap: 10px;
  }

  .form-header h1 {
    font-size: 1.5rem;
  }
}
</style>