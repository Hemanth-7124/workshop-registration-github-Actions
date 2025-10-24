<template>
  <div class="container">
    <h1>Workshop Registrations</h1>

    <div v-if="pending" class="loading">
      Loading registrations...
    </div>

    <div v-else-if="error" class="error">
      <p>Error loading registrations: {{ error.message }}</p>
      <button @click="refresh">Try Again</button>
    </div>

    <div v-else>
      <div v-if="registrations.length === 0" class="no-data">
        <p>No registrations found.</p>
      </div>

      <div v-else class="registrations-list">
        <div v-for="registration in registrations" :key="registration.id" class="registration-card">
          <h3>{{ registration.name }}</h3>
          <p><strong>Email:</strong> {{ registration.email }}</p>
          <p><strong>Workshop:</strong> {{ registration.workshop }}</p>
          <p><strong>Date:</strong> {{ formatDate(registration.created_at) }}</p>
        </div>
      </div>
    </div>

    <div class="actions">
      <NuxtLink to="/" class="btn">Back to Registration</NuxtLink>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'View Registrations',
  meta: [
    { name: 'description', content: 'View all workshop registrations' }
  ]
})

const { data: registrations, pending, error, refresh } = await useFetch('/api/registrations')

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #e74c3c;
}

.registrations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.registration-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
}

.registration-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.registration-card p {
  margin: 0.5rem 0;
  color: #555;
}

.actions {
  text-align: center;
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn:hover {
  background: #2980b9;
}

button {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #c0392b;
}
</style>