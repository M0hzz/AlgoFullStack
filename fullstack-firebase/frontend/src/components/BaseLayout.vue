<script setup>
// Import common components
import TheHeader from "@/components/common/TheHeader.vue";
import TheFooter from "@/components/common/TheFooter.vue";
import TheSidebar from "@/components/common/TheSidebar.vue";

// Define props if needed
defineProps({
  // You can add props to control layout behavior
  // For example, showSidebar to toggle sidebar visibility
  showSidebar: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div class="base-layout">
    <TheHeader />

    <div class="content-wrapper">
      <TheSidebar v-if="showSidebar" />

      <main class="main-content">
        <!-- Default slot for page content -->
        <slot></slot>
      </main>
    </div>

    <TheFooter />
  </div>
</template>

<style scoped>
.base-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>