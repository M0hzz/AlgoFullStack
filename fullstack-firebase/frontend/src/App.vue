<script setup>
import { RouterView } from "vue-router";
// TheSidebar might be useful at the app level if it should appear on all pages
// import TheSidebar from "./common/TheSidebar.vue";
</script>

<template>
  <div id="app" class="app-container">
    <!-- Main content area -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Base styles that should apply to the entire application */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

/* You can add more global styles here */
</style>