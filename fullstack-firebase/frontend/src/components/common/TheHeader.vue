<template>
  <header class="cs-header">
    <div class="container">
      <div class="logo-container">
        <router-link to="/" class="logo-link">
          <div class="binary-logo">&lt;/&gt;</div>
          <h1 class="site-title">CodeMatrix</h1>
        </router-link>
      </div>

      <nav class="main-nav" :class="{ 'mobile-open': mobileMenuOpen }">
        <ul>
          <li><router-link to="/" class="nav-link">Home</router-link></li>
          <li><router-link to="/algorithms" class="nav-link">Algorithms</router-link></li>
          <li><router-link to="/data-structures" class="nav-link">Data Structures</router-link></li>
          <li><router-link to="/math-topics" class="nav-link">Math</router-link></li>
          <li><router-link to="/dashboard" class="nav-link">Dashboard</router-link></li>
        </ul>
      </nav>

      <div class="header-actions">
        <div class="user-actions" v-if="currentUser">
          <div class="user-dropdown" @click="toggleDropdown" ref="dropdownRef">
            <div class="user-avatar">
              <img v-if="currentUser.photoURL" :src="currentUser.photoURL" alt="User avatar">
              <div v-else class="avatar-fallback">{{ userInitials }}</div>
            </div>
            <span class="user-name">{{ currentUser.displayName }}</span>
            <span class="dropdown-arrow">▼</span>

            <div class="dropdown-menu" v-if="dropdownOpen">
              <router-link to="/profile" class="dropdown-item">Profile</router-link>
              <router-link to="/settings" class="dropdown-item">Settings</router-link>
              <div class="dropdown-divider"></div>
              <button @click="handleSignOut" class="dropdown-item">Sign Out</button>
            </div>
          </div>
        </div>

        <div class="auth-actions" v-else>
          <router-link to="/login" class="login-btn">Sign In</router-link>
          <router-link to="/register" class="register-btn">Register</router-link>
        </div>

        <div class="theme-toggle" @click="toggleTheme">
          <span v-if="isDarkMode">☀️</span>
          <span v-else>🌙</span>
        </div>

        <button class="mobile-menu-button" @click="toggleMobileMenu">
          <span class="menu-icon"></span>
        </button>
      </div>
    </div>

    <div class="binary-background">
      <div v-for="n in 20" :key="n" class="binary-bit">
        {{ Math.round(Math.random()) }}
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth'

export default defineComponent({
  name: 'TheHeader',
  setup() {
    const router = useRouter();
    const auth = getAuth();

    const currentUser = ref<User | null>(null);
    const isDarkMode = ref(false);
    const mobileMenuOpen = ref(false);
    const dropdownOpen = ref(false);
    const dropdownRef = ref<HTMLElement | null>(null);

    // Listen for authentication state changes
    onMounted(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        currentUser.value = user;
      });

      // Check if dark mode was previously set
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        isDarkMode.value = true;
        document.body.classList.add('dark-mode');
      }

      // Close dropdown when clicking outside
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
          dropdownOpen.value = false;
        }
      };

      document.addEventListener('click', handleClickOutside);

      // Clean up event listeners when component unmounts
      onBeforeUnmount(() => {
        unsubscribe();
        document.removeEventListener('click', handleClickOutside);
      });
    });

    const userInitials = computed(() => {
      if (!currentUser.value || !currentUser.value.displayName) return '?';

      const nameParts = currentUser.value.displayName.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    });

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;

      if (isDarkMode.value) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    };

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;

      if (mobileMenuOpen.value) {
        // Prevent background scrolling when mobile menu is open
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    const toggleDropdown = (event: MouseEvent) => {
      event.stopPropagation();
      dropdownOpen.value = !dropdownOpen.value;
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
      currentUser,
      isDarkMode,
      mobileMenuOpen,
      dropdownOpen,
      dropdownRef,
      userInitials,
      toggleTheme,
      toggleMobileMenu,
      toggleDropdown,
      handleSignOut
    };
  }
})
</script>

<style scoped>
.cs-header {
  background: linear-gradient(90deg, var(--primary-dark), var(--secondary-dark));
  color: var(--text-primary-dark);
  padding: 1rem 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.binary-logo {
  font-size: 2rem;
  font-weight: bold;
  margin-right: 1rem;
  color: var(--accent);
  font-family: 'Courier New', monospace;
}

.site-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  color: var(--accent);
}

.main-nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.main-nav li {
  margin: 0 1rem;
}

.nav-link {
  color: var(--text-primary-dark);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--accent);
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--accent);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}

.router-link-active {
  color: var(--accent);
}

.header-actions {
  display: flex;
  align-items: center;
}

.user-actions {
  margin-right: 1rem;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.user-dropdown:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  color: var(--primary-dark);
  font-weight: 600;
  font-size: 0.9rem;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 500;
  margin-right: 0.5rem;
}

.dropdown-arrow {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}

.user-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 200px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100;
}

.dark-mode .dropdown-menu {
  background-color: var(--card-dark);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--text-primary-light);
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  text-align: left;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
}

.dark-mode .dropdown-item {
  color: var(--text-primary-dark);
}

.dropdown-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.dropdown-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
}

.dark-mode .dropdown-divider {
  background-color: rgba(255, 255, 255, 0.1);
}

.auth-actions {
  display: flex;
  gap: 1rem;
}

.login-btn, .register-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-btn {
  color: var(--accent);
  background-color: transparent;
  border: 1px solid var(--accent);
}

.login-btn:hover {
  background-color: rgba(100, 255, 218, 0.1);
}

.register-btn {
  color: var(--primary-dark);
  background-color: var(--accent);
  border: 1px solid var(--accent);
}

.register-btn:hover {
  background-color: var(--light-accent);
  transform: translateY(-2px);
}

.theme-toggle {
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 1.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: rotate(30deg);
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: relative;
  margin-left: 1rem;
}

.menu-icon,
.menu-icon::before,
.menu-icon::after {
  content: '';
  display: block;
  height: 2px;
  width: 24px;
  background-color: var(--text-primary-dark);
  position: absolute;
  transition: all 0.3s ease;
}

.menu-icon {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.menu-icon::before {
  top: -8px;
  left: 0;
}

.menu-icon::after {
  bottom: -8px;
  left: 0;
}

.mobile-open .menu-icon {
  background-color: transparent;
}

.mobile-open .menu-icon::before {
  transform: rotate(45deg);
  top: 0;
}

.mobile-open .menu-icon::after {
  transform: rotate(-45deg);
  bottom: 0;
}

.binary-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  opacity: 0.05;
  z-index: 1;
}

.binary-bit {
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  color: var(--accent);
  margin: 0 1rem;
  animation: float 5s infinite ease-in-out;
  opacity: 0.8;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 1024px) {
  .nav-link {
    font-size: 0.85rem;
  }

  .main-nav li {
    margin: 0 0.75rem;
  }

  .user-name {
    display: none;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .site-title {
    font-size: 1.25rem;
  }

  .main-nav {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 80%;
    max-width: 300px;
    background-color: var(--primary-dark);
    z-index: 1000;
    transition: right 0.3s ease;
    padding: 5rem 2rem 2rem;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  }

  .dark-mode .main-nav {
    background-color: var(--secondary-dark);
  }

  .main-nav.mobile-open {
    right: 0;
  }

  .main-nav ul {
    flex-direction: column;
  }

  .main-nav li {
    margin: 1rem 0;
  }

  .nav-link {
    font-size: 1.1rem;
    display: block;
    padding: 0.5rem 0;
  }

  .mobile-menu-button {
    display: block;
  }

  .auth-actions {
    display: none;
  }

  .auth-actions.mobile-open {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    gap: 1rem;
  }

  .theme-toggle {
    margin-left: 0;
    margin-right: 1rem;
  }

  .binary-background {
    display: none;
  }
}
</style>