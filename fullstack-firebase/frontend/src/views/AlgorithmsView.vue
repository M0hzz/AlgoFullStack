<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const algorithms = ref([]);

onMounted(async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5000/api/algorithms", {
    headers: { Authorization: `Bearer ${token}` }
  });
  algorithms.value = response.data;
});
</script>

<template>
  <div>
    <h1>Algorithms</h1>
    <ul>
      <li v-for="algo in algorithms" :key="algo.id">
        <strong>{{ algo.name }}</strong> - {{ algo.category }}
      </li>
    </ul>
  </div>
</template>
