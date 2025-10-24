<template>
  <div class="container">
    <div class="success-card">
      <div class="success-icon">✓</div>
      <h1>Registration Successful!</h1>
      <p>Thank you for registering for our workshop. A confirmation email has been sent to your email address.</p>

      <div class="actions">
        <NuxtLink to="/" class="btn primary">Register Another</NuxtLink>
        <NuxtLink to="/registrations" class="btn secondary">View Registrations</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Registration Successful',
  meta: [
    { name: 'description', content: 'Workshop registration confirmation' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.success-card {
  text-align: center;
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.success-icon {
  font-size: 4rem;
  color: #27ae60;
  margin-bottom: 1rem;
  font-weight: bold;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s;
  font-weight: 500;
}

.btn.primary {
  background: #27ae60;
  color: white;
}

.btn.primary:hover {
  background: #219a52;
  transform: translateY(-1px);
}

.btn.secondary {
  background: #ecf0f1;
  color: #2c3e50;
  border: 1px solid #bdc3c7;
}

.btn.secondary:hover {
  background: #d5dbdb;
  transform: translateY(-1px);
}
</style>