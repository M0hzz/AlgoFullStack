<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <button class="toggle-btn" @click="toggleSidebar">
        <span class="toggle-icon"></span>
      </button>
    </div>

    <div class="sidebar-content">
      <div class="user-info" v-if="currentUser">
        <div class="user-avatar">
          <img v-if="currentUser.photoURL" :src="currentUser.photoURL" alt="User avatar">
          <div v-else class="avatar-fallback">{{ userInitials }}</div>
        </div>
        <div class="user-details" v-if="!isCollapsed">
          <h3 class="user-name">{{ currentUser.displayName || 'User' }}</h3>
          <p class="user-email">{{ currentUser.email }}</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li v-for="item in menuItems" :key="item.path">
            <router-link
                :to="item.path"
                class="nav-item"
                :class="{ 'active': isActive(item.path) }"
                :title="item.title"
            >
              <span class="nav-icon" v-html="item.icon"></span>
              <span class="nav-label" v-if="!isCollapsed">{{ item.title }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="progress-section" v-if="!isCollapsed">
          <h4>Your Progress</h4>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
          </div>
          <p class="progress-text">{{ completedCourses }} of {{ totalCourses }} courses completed</p>
        </div>

        <button class="sign-out-btn" @click="handleSignOut" :title="isCollapsed ? 'Sign Out' : ''">
          <span class="sign-out-icon">⟲</span>
          <span class="sign-out-text" v-if="!isCollapsed">Sign Out</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth'

export default defineComponent({
  name: 'TheSidebar',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const auth = getAuth();

    const isCollapsed = ref(false);
    const currentUser = ref<User | null>(null);
    const completedCourses = ref(5);
    const totalCourses = ref(12);

    const menuItems = [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>'
      },
      {
        title: 'Algorithms',
        path: '/algorithms',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>'
      },
      {
        title: 'Data Structures',
        path: '/data-structures',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>'
      },
      {
        title: 'Math Topics',
        path: '/math-topics',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>'
      },
      {
        title: 'Lessons',
        path: '/lessons',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>'
      },
      {
        title: 'Profile',
        path: '/profile',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
      },
      {
        title: 'Settings',
        path: '/settings',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
      }
    ];

    // Authentication state
    onMounted(() => {
      // Check if sidebar was previously collapsed
      const storedState = localStorage.getItem('sidebar-collapsed');
      if (storedState === 'true') {
        isCollapsed.value = true;
      }

      // Listen for auth state changes
      onAuthStateChanged(auth, (user) => {
        currentUser.value = user;
      });
    });

    const progressPercentage = computed(() => {
      return (completedCourses.value / totalCourses.value) * 100;
    });

    const userInitials = computed(() => {
      if (!currentUser.value || !currentUser.value.displayName) return '?';

      const nameParts = currentUser.value.displayName.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    });

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value;
      localStorage.setItem('sidebar-collapsed', isCollapsed.value.toString());
    };

    const isActive = (path: string) => {
      return route.path === path || route.path.startsWith(`${path}/`);
    };

    const handleSignOut = async () => {
      try {
        await signOut(auth);
        router.push('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    return {
      isCollapsed,
      currentUser,
      menuItems,
      completedCourses,
      totalCourses,
      progressPercentage,
      userInitials,
      toggleSidebar,
      isActive,
      handleSignOut
    };
  }
})
</script>

<style scoped>
.sidebar {
  background-color: white;
  height: 100%;
  width: 250px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  overflow: hidden;
}

.dark-mode .sidebar {
  background-color: var(--card-dark);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-mode .sidebar-header {
  border-color: rgba(255, 255, 255, 0.05);
}

.toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.toggle-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.toggle-icon,
.toggle-icon::before,
.toggle-icon::after {
  content: '';
  display: block;
  height: 2px;
  width: 18px;
  background-color: var(--text-primary-light);
  position: relative;
  transition: all 0.3s ease;
}

.dark-mode .toggle-icon,
.dark-mode .toggle-icon::before,
.dark-mode .toggle-icon::after {
  background-color: var(--text-primary-dark);
}

.toggle-icon::before {
  position: absolute;
  top: -5px;
}

.toggle-icon::after {
  position: absolute;
  bottom: -5px;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.user-info {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-mode .user-info {
  border-color: rgba(255, 255, 255, 0.05);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  color: var(--primary-dark);
  font-weight: 600;
  font-size: 1rem;
}

.user-details {
  overflow: hidden;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark-mode .user-name {
  color: var(--text-primary-dark);
}

.user-email {
  font-size: 0.8rem;
  color: var(--text-secondary-light);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark-mode .user-email {
  color: var(--text-secondary-dark);
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: var(--text-primary-light);
  transition: all 0.3s ease;
  position: relative;
}

.dark-mode .nav-item {
  color: var(--text-primary-dark);
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--accent);
}

.dark-mode .nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  color: var(--accent);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: var(--accent);
}

.nav-icon {
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.collapsed .nav-icon {
  margin-right: 0;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-mode .sidebar-footer {
  border-color: rgba(255, 255, 255, 0.05);
}

.progress-section {
  margin-bottom: 1.5rem;
}

.progress-section h4 {
  font-size: 0.9rem;
  margin: 0 0 0.75rem 0;
  color: var(--text-primary-light);
}

.dark-mode .progress-section h4 {
  color: var(--text-primary-dark);
}

.progress-bar {
  height: 6px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.dark-mode .progress-bar {
  background-color: rgba(255, 255, 255, 0.05);
}

.progress-fill {
  height: 100%;
  background-color: var(--accent);
  border-radius: 3px;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--text-secondary-light);
  margin: 0;
}

.dark-mode .progress-text {
  color: var(--text-secondary-dark);
}

.sign-out-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary-light);
}

.dark-mode .sign-out-btn {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-primary-dark);
}

.sign-out-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dark-mode .sign-out-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sign-out-icon {
  margin-right: 0.75rem;
}

.collapsed .sign-out-icon {
  margin-right: 0;
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    z-index: 100;
    box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
  }

  .dark-mode .sidebar {
    box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
  }
}
</style>