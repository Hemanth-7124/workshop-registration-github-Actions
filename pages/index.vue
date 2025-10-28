<template>
  <div class="container">
    <h1>Workshop Registration System</h1>
    <WorkshopRegistrationForm />
  </div>
  
</template>

<script setup>
useHead({
  title: 'Workshop Registration',
  meta: [
    { name: 'description', content: 'Register for our workshops' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}
</style>