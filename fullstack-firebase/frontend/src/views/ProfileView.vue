<template>
  <BaseLayout>
    <template #header>
      <TheHeader />
    </template>

    <div class="profile-container">
      <div v-if="user" class="profile-card">
        <img :src="user.photoURL || defaultAvatar" alt="User Avatar" class="profile-avatar" />
        <h2>{{ user.displayName || "Anonymous" }}</h2>
        <p>{{ user.email }}</p>
        <button @click="logout" class="logout-button">Logout</button>
      </div>

      <div v-else class="profile-message">
        <h2>You are not logged in</h2>
        <router-link to="/login" class="login-link">Go to Login</router-link>
      </div>
    </div>

    <template #footer>
      <TheFooter />
    </template>
  </BaseLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import BaseLayout from "@/components/BaseLayout.vue";
import TheHeader from "@/components/common/TheHeader.vue";
import TheFooter from "@/components/common/TheFooter.vue";

const auth = getAuth();
const user = ref(null);
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Placeholder avatar

// Fetch user data when the component is mounted
onMounted(() => {
  onAuthStateChanged(auth, (authUser) => {
    user.value = authUser;
  });
});

// Logout function
const logout = async () => {
  try {
    await signOut(auth);
    user.value = null;
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
}

.profile-card {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.profile-card h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.profile-card p {
  color: #666;
  margin-bottom: 1rem;
}

.logout-button {
  padding: 10px 20px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.logout-button:hover {
  background: #e60000;
}

.profile-message {
  text-align: center;
}

.login-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
