<template>
  <BaseLayout>
    <template #header>
      <TheHeader />
    </template>

    <div class="math-topics-container">
      <h1>Mathematical Foundations</h1>
      <p>Explore mathematical concepts crucial for computer science.</p>

      <div class="topics-list">
        <router-link v-for="topic in topics" :key="topic.id" :to="`/math/${topic.id}`" class="topic-card">
          {{ topic.title }}
        </router-link>
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

const topics = [
  { id: "discrete-math", title: "Discrete Mathematics" },
  { id: "linear-algebra", title: "Linear Algebra" },
  { id: "calculus", title: "Calculus" },
  { id: "probability", title: "Probability & Statistics" },
];
</script>

<style scoped>
.math-topics-container {
  text-align: center;
  padding: 2rem;
}

.topics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.topic-card {
  padding: 1rem 2rem;
  background-color: #eee;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
}

.topic-card:hover {
  background-color: #ccc;
}
</style>
