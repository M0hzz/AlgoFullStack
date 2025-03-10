<template>
  <BaseLayout>
    <template #header>
      <TheHeader />
    </template>

    <div class="home-container">
      <h1>Welcome to AlgoMath Academy</h1>
      <p>Explore mathematics and algorithms essential for programming.</p>

      <div class="sections">
        <router-link to="/math" class="section-card">📚 Math Topics</router-link>
        <router-link to="/algorithms" class="section-card">🔢 Algorithms</router-link>
        <router-link to="/login" class="section-card">🔐 Login</router-link>
      </div>
    </div>

    <template #footer>
      <TheFooter />
    </template>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from "@/components/BaseLayout.vue";
import TheHeader from "@/components/common/TheHeader.vue";
import TheFooter from "@/components/common/TheFooter.vue";
</script>

<style scoped>
.home-container {
  text-align: center;
  padding: 2rem;
}

.sections {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.section-card {
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
}

.section-card:hover {
  background-color: #ddd;
}
</style>
