<template>
  <div class="hash-table-container">
    <h2 class="title">Hash Table Insertion</h2>

    <!-- Controls -->
    <div class="controls-container">
      <input
          type="text"
          v-model="newItem"
          placeholder="Enter a value to insert"
          class="input"
          :disabled="animationStep > 0"
      />
      <button @click="addItem" :disabled="!newItem.trim() || animationStep > 0" class="button">
        Add Item
      </button>
      <button @click="clearTable" class="clear-button">Clear Table</button>
    </div>

    <!-- Table Size Controls -->
    <div class="table-size-container">
      <label>Table Size:</label>
      <select v-model="tableSize" class="select" :disabled="items.length > 0 || animationStep > 0">
        <option v-for="size in [4, 8, 16]" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>

    <!-- Animation Status -->
    <div class="status-container">
      <p v-if="animationStep === 0">Enter a value and click "Add Item" to see the insertion process.</p>
      <p v-if="animationStep === 1">Computing hash value for <span class="blue-text">{{ animatingItem }}</span>...</p>
      <p v-if="animationStep === 2">
        Hash value for <span class="blue-text">{{ animatingItem }}</span> is <span class="green-text">{{ hashValue }}</span>.
      </p>
      <p v-if="animationStep === 3">
        Item maps to index <span class="purple-text">{{ hashIndex }}</span>. Checking for collisions...
      </p>
      <p v-if="animationStep === 4">
        <span v-if="isCollision" class="red-text">Collision detected! Resolving...</span>
        <span v-else>No collision. Inserting at index <span class="purple-text">{{ hashIndex }}</span>.</span>
      </p>
      <p v-if="animationStep === 5" class="green-text">
        Item <span class="blue-text">{{ animatingItem }}</span> inserted successfully!
      </p>
    </div>

    <!-- Hash Table Visualization -->
    <div class="table-container">
      <div class="indexes-row">
        <div v-for="index in tableSize" :key="index" class="index-cell">{{ index - 1 }}</div>
      </div>
      <div class="cells-row">
        <div v-for="index in tableSize" :key="index" :class="['cell', { activeCell: hashIndex === index - 1 && animationStep >= 3 }]">
          <div class="items-container">
            <div v-for="item in itemsAtIndex(index - 1)" :key="item" class="item">{{ item }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Reactive state
const tableSize = ref(8);
const items = ref([]);
const newItem = ref("");
const animationStep = ref(0);
const animatingItem = ref(null);
const hashValue = ref(null);
const hashIndex = ref(null);
const isCollision = ref(false);

// Hash function
const hashFunction = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Get index from hash
const getIndex = (hash) => hash % tableSize.value;

// Reset animation state
const resetAnimation = () => {
  animationStep.value = 0;
  animatingItem.value = null;
  hashValue.value = null;
  hashIndex.value = null;
  isCollision.value = false;
};

// Add new item to hash table
const addItem = () => {
  if (!newItem.value.trim()) return;

  resetAnimation();
  animatingItem.value = newItem.value;
  animationStep.value = 1;
};

// Watch animation progress
watch(animationStep, (step) => {
  if (!animatingItem.value) return;

  setTimeout(() => {
    if (step === 1) {
      hashValue.value = hashFunction(animatingItem.value);
      animationStep.value = 2;
    } else if (step === 2) {
      hashIndex.value = getIndex(hashValue.value);
      animationStep.value = 3;
    } else if (step === 3) {
      isCollision.value = items.value.some((item) => getIndex(hashFunction(item)) === hashIndex.value);
      animationStep.value = 4;
    } else if (step === 4) {
      items.value.push(animatingItem.value);
      newItem.value = "";
      animationStep.value = 5;
    } else if (step === 5) {
      resetAnimation();
    }
  }, 1000);
});

// Get items at a specific index
const itemsAtIndex = (index) => items.value.filter((item) => getIndex(hashFunction(item)) === index);

// Clear table
const clearTable = () => {
  items.value = [];
  resetAnimation();
};
</script>

<style scoped>
.hash-table-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.controls-container {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.button, .clear-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.button {
  background-color: #3b82f6;
  color: white;
}

.clear-button {
  background-color: #ef4444;
  color: white;
}

.table-container {
  overflow-x: auto;
}

.indexes-row, .cells-row {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.index-cell {
  width: 48px;
  text-align: center;
  font-weight: bold;
}

.cell {
  width: 48px;
  height: 64px;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.activeCell {
  border: 2px solid #ef4444;
  background-color: #fee2e2;
}

.items-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.item {
  width: 100%;
  text-align: center;
  background-color: #dbeafe;
  color: #1e40af;
  padding: 2px 4px;
}
</style>
