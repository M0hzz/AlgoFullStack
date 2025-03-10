<template>
  <div class="auth-form-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo-container">
          <div class="code-logo">&lt;/&gt;</div>
          <h1>CodeMatrix</h1>
        </div>
        <div class="auth-tabs">
          <button
              class="tab-btn"
              :class="{ active: activeTab === 'login' }"
              @click="activeTab = 'login'"
          >
            Sign In
          </button>
          <button
              class="tab-btn"
              :class="{ active: activeTab === 'register' }"
              @click="activeTab = 'register'"
          >
            Register
          </button>
        </div>
      </div>

      <!-- Login Form -->
      <div class="form-container" v-if="activeTab === 'login'">
        <h2>Welcome Back</h2>
        <p>Sign in to continue your learning journey</p>

        <form @submit.prevent="handleLogin">
          <div class="alert error" v-if="loginError">
            {{ loginError }}
          </div>

          <div class="form-group">
            <label for="login-email">Email</label>
            <input
                type="email"
                id="login-email"
                v-model="loginForm.email"
                placeholder="Your email address"
                required
            />
          </div>

          <div class="form-group">
            <div class="password-label">
              <label for="login-password">Password</label>
              <a href="#" @click.prevent="forgotPassword" class="forgot-password">Forgot Password?</a>
            </div>
            <div class="password-input">
              <input
                  :type="showLoginPassword ? 'text' : 'password'"
                  id="login-password"
                  v-model="loginForm.password"
                  placeholder="Your password"
                  required
              />
              <button
                  type="button"
                  class="toggle-password"
                  @click="showLoginPassword = !showLoginPassword"
              >
                <span v-if="showLoginPassword">👁️</span>
                <span v-else>👁️‍🗨️</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="loginForm.remember" />
              <label for="remember">Remember me</label>
            </div>
          </div>

          <button type="submit" class="auth-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loader"></span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="social-auth">
          <div class="divider">
            <span>or continue with</span>
          </div>

          <div class="social-buttons">
            <button
                class="social-btn google"
                @click="signInWithGoogle"
                :disabled="isLoading"
            >
              <span v-if="isLoading" class="loader small"></span>
              <span v-else>Google</span>
            </button>
            <button
                class="social-btn github"
                @click="signInWithGithub"
                :disabled="isLoading"
            >
              <span v-if="isLoading" class="loader small"></span>
              <span v-else>GitHub</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Register Form -->
      <div class="form-container" v-if="activeTab === 'register'">
        <h2>Create Account</h2>
        <p>Join our community of learners</p>

        <form @submit.prevent="handleRegister">
          <div class="alert error" v-if="registerError">
            {{ registerError }}
          </div>

          <div class="form-group">
            <label for="register-name">Full Name</label>
            <input
                type="text"
                id="register-name"
                v-model="registerForm.name"
                placeholder="Your full name"
                required
            />
          </div>

          <div class="form-group">
            <label for="register-email">Email</label>
            <input
                type="email"
                id="register-email"
                v-model="registerForm.email"
                placeholder="Your email address"
                required
            />
          </div>

          <div class="form-group">
            <label for="register-password">Password</label>
            <div class="password-input">
              <input
                  :type="showRegisterPassword ? 'text' : 'password'"
                  id="register-password"
                  v-model="registerForm.password"
                  placeholder="Create a password"
                  required
                  @input="checkPasswordStrength"
              />
              <button
                  type="button"
                  class="toggle-password"
                  @click="showRegisterPassword = !showRegisterPassword"
              >
                <span v-if="showRegisterPassword">👁️</span>
                <span v-else>👁️‍🗨️</span>
              </button>
            </div>
            <div class="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li :class="{ 'requirement-met': passwordRequirements.length }">
                  At least 8 characters
                </li>
                <li :class="{ 'requirement-met': passwordRequirements.hasUppercase }">
                  At least one uppercase letter
                </li>
                <li :class="{ 'requirement-met': passwordRequirements.hasLowercase }">
                  At least one lowercase letter
                </li>
                <li :class="{ 'requirement-met': passwordRequirements.hasNumber }">
                  At least one number
                </li>
                <li :class="{ 'requirement-met': passwordRequirements.hasSpecial }">
                  At least one special character
                </li>
              </ul>
            </div>
            <div class="password-strength" v-if="registerForm.password">
              <div class="strength-bar">
                <div
                    class="strength-level"
                    :style="{ width: `${passwordStrength * 25}%` }"
                    :class="strengthClass"
                ></div>
              </div>
              <span class="strength-text" :class="strengthClass">{{ strengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <div class="terms-checkbox">
              <input type="checkbox" id="terms" v-model="registerForm.terms" required />
              <label for="terms">
                I agree to the <a href="#" @click.prevent="showTerms">Terms of Service</a> and
                <a href="#" @click.prevent="showPrivacyPolicy">Privacy Policy</a>
              </label>
            </div>
          </div>

          <button type="submit" class="auth-btn" :disabled="isLoading || !isPasswordValid">
            <span v-if="isLoading" class="loader"></span>
            <span v-else>Create Account</span>
          </button>
        </form>
      </div>

      <!-- Password Reset Form -->
      <div class="form-container" v-if="activeTab === 'reset'">
        <h2>Reset Password</h2>
        <p>Enter your email to receive a reset link</p>

        <form @submit.prevent="handlePasswordReset">
          <div class="alert error" v-if="resetError">
            {{ resetError }}
          </div>

          <div class="alert success" v-if="resetSuccess">
            {{ resetSuccess }}
          </div>

          <div class="form-group">
            <label for="reset-email">Email</label>
            <input
                type="email"
                id="reset-email"
                v-model="resetForm.email"
                placeholder="Your email address"
                required
            />
          </div>

          <button type="submit" class="auth-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loader"></span>
            <span v-else>Send Reset Link</span>
          </button>

          <button type="button" class="back-btn" @click="activeTab = 'login'">
            Back to Sign In
          </button>
        </form>
      </div>
    </div>

    <div class="auth-benefits">
      <h2>Benefits of joining CodeMatrix</h2>
      <div class="benefits-list">
        <div class="benefit-item">
          <div class="benefit-icon">📚</div>
          <div class="benefit-content">
            <h3>Comprehensive Learning</h3>
            <p>Access to all courses, tutorials, and resources</p>
          </div>
        </div>

        <div class="benefit-item">
          <div class="benefit-icon">🔍</div>
          <div class="benefit-content">
            <h3>Interactive Visualizations</h3>
            <p>See algorithms and data structures in action</p>
          </div>
        </div>

        <div class="benefit-item">
          <div class="benefit-icon">📊</div>
          <div class="benefit-content">
            <h3>Progress Tracking</h3>
            <p>Monitor your learning journey with detailed statistics</p>
          </div>
        </div>

        <div class="benefit-item">
          <div class="benefit-icon">🏆</div>
          <div class="benefit-content">
            <h3>Earn Certificates</h3>
            <p>Get recognition for your completed courses</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'

export default defineComponent({
  name: 'AuthForm',
  setup() {
    const router = useRouter();
    const auth = getAuth();

    // Form state
    const activeTab = ref('login');
    const isLoading = ref(false);
    const showLoginPassword = ref(false);
    const showRegisterPassword = ref(false);

    // Login state
    const loginForm = ref({
      email: '',
      password: '',
      remember: false
    });
    const loginError = ref('');

    // Register state
    const registerForm = ref({
      name: '',
      email: '',
      password: '',
      terms: false
    });
    const registerError = ref('');

    // Password reset state
    const resetForm = ref({
      email: ''
    });
    const resetError = ref('');
    const resetSuccess = ref('');

    // Password strength
    const passwordRequirements = ref({
      length: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false
    });

    const passwordStrength = computed(() => {
      let strength = 0;
      if (passwordRequirements.value.length) strength++;
      if (passwordRequirements.value.hasUppercase) strength++;
      if (passwordRequirements.value.hasLowercase) strength++;
      if (passwordRequirements.value.hasNumber || passwordRequirements.value.hasSpecial) strength++;

      return strength;
    });

    const strengthClass = computed(() => {
      switch (passwordStrength.value) {
        case 1: return 'weak';
        case 2: return 'fair';
        case 3: return 'good';
        case 4: return 'strong';
        default: return '';
      }
    });

    const strengthText = computed(() => {
      switch (passwordStrength.value) {
        case 1: return 'Weak';
        case 2: return 'Fair';
        case 3: return 'Good';
        case 4: return 'Strong';
        default: return '';
      }
    });

    const isPasswordValid = computed(() => {
      return passwordStrength.value >= 3;
    });

    // Methods
    const checkPasswordStrength = () => {
      const password = registerForm.value.password;

      passwordRequirements.value.length = password.length >= 8;
      passwordRequirements.value.hasUppercase = /[A-Z]/.test(password);
      passwordRequirements.value.hasLowercase = /[a-z]/.test(password);
      passwordRequirements.value.hasNumber = /[0-9]/.test(password);
      passwordRequirements.value.hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    };

    const handleLogin = async () => {
      loginError.value = '';
      isLoading.value = true;

      try {
        await signInWithEmailAndPassword(
            auth,
            loginForm.value.email,
            loginForm.value.password
        );

        // If successful, redirect to dashboard
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Login error:', error);

        // Handle common auth errors
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            loginError.value = 'Invalid email or password';
            break;
          case 'auth/too-many-requests':
            loginError.value = 'Too many failed login attempts. Please try again later or reset your password';
            break;
          default:
            loginError.value = 'Failed to sign in. Please try again.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    const handleRegister = async () => {
      registerError.value = '';
      isLoading.value = true;

      try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            registerForm.value.email,
            registerForm.value.password
        );

        // Update user profile with display name
        await updateProfile(userCredential.user, {
          displayName: registerForm.value.name
        });

        // If successful, redirect to dashboard
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Registration error:', error);

        // Handle common auth errors
        switch (error.code) {
          case 'auth/email-already-in-use':
            registerError.value = 'Email is already in use';
            break;
          case 'auth/invalid-email':
            registerError.value = 'Invalid email address';
            break;
          case 'auth/weak-password':
            registerError.value = 'Password is too weak';
            break;
          default:
            registerError.value = 'Failed to create account. Please try again.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    const signInWithGoogle = async () => {
      loginError.value = '';
      isLoading.value = true;

      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);

        // If successful, redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Google sign-in error:', error);
        loginError.value = 'Failed to sign in with Google. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const signInWithGithub = async () => {
      loginError.value = '';
      isLoading.value = true;

      try {
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider);

        // If successful, redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('GitHub sign-in error:', error);
        loginError.value = 'Failed to sign in with GitHub. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const forgotPassword = () => {
      activeTab.value = 'reset';
      resetForm.value.email = loginForm.value.email;
    };

    const handlePasswordReset = async () => {
      resetError.value = '';
      resetSuccess.value = '';
      isLoading.value = true;

      try {
        await sendPasswordResetEmail(auth, resetForm.value.email);
        resetSuccess.value = 'Password reset email sent. Check your inbox.';
      } catch (error: any) {
        console.error('Password reset error:', error);

        // Handle common auth errors
        switch (error.code) {
          case 'auth/user-not-found':
            resetError.value = 'No account found with this email';
            break;
          case 'auth/invalid-email':
            resetError.value = 'Invalid email address';
            break;
          default:
            resetError.value = 'Failed to send reset email. Please try again.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    const showTerms = () => {
      // Show terms of service modal or navigate to terms page
      console.log('Show terms of service');
    };

    const showPrivacyPolicy = () => {
      // Show privacy policy modal or navigate to privacy page
      console.log('Show privacy policy');
    };

    return {
      activeTab,
      isLoading,
      showLoginPassword,
      showRegisterPassword,
      loginForm,
      loginError,
      registerForm,
      registerError,
      resetForm,
      resetError,
      resetSuccess,
      passwordRequirements,
      passwordStrength,
      strengthClass,
      strengthText,
      isPasswordValid,
      checkPasswordStrength,
      handleLogin,
      handleRegister,
      signInWithGoogle,
      signInWithGithub,
      forgotPassword,
      handlePasswordReset,
      showTerms,
      showPrivacyPolicy
    };
  }
})
</script>

<style scoped>
.auth-form-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-dark), var(--secondary-dark));
}

.auth-card {
  flex: 1;
  background-color: white;
  padding: 2rem;
  max-width: 500px;
  display: flex;
  flex-direction: column;
}

.dark-mode .auth-card {
  background-color: var(--card-dark);
}

.auth-header {
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.code-logo {
  font-size: 2rem;
  color: var(--accent);
  font-family: 'Courier New', monospace;
  margin-right: 0.5rem;
}

.logo-container h1 {
  font-size: 1.5rem;
  color: var(--text-primary-light);
  margin: 0;
}

.dark-mode .logo-container h1 {
  color: var(--text-primary-dark);
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dark-mode .auth-tabs {
  border-color: rgba(255, 255, 255, 0.1);
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 1rem;
  font-weight: 600;
  color: var(--text-secondary-light);
  cursor: pointer;
  position: relative;
}

.dark-mode .tab-btn {
  color: var(--text-secondary-dark);
}

.tab-btn.active {
  color: var(--accent);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--accent);
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-container h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary-light);
}

.dark-mode .form-container h2 {
  color: var(--text-primary-dark);
}

.form-container p {
  color: var(--text-secondary-light);
  margin-bottom: 2rem;
}

.dark-mode .form-container p {
  color: var(--text-secondary-dark);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-secondary-light);
}

.dark-mode .form-group label {
  color: var(--text-secondary-dark);
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.dark-mode .form-group input[type="text"],
.dark-mode .form-group input[type="email"],
.dark-mode .form-group input[type="password"] {
  background-color: rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary-dark);
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.2);
}

.password-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  font-size: 0.85rem;
  color: var(--accent);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-secondary-light);
}

.dark-mode .toggle-password {
  color: var(--text-secondary-dark);
}

.remember-me,
.terms-checkbox {
  display: flex;
  align-items: center;
}

.remember-me input,
.terms-checkbox input {
  margin-right: 0.5rem;
}

.auth-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--accent);
  color: var(--primary-dark);
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.auth-btn:hover:not(:disabled) {
  background-color: var(--light-accent);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--accent);
  font-weight: 500;
  margin-top: 1rem;
  cursor: pointer;
}

.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: var(--text-secondary-light);
}

.dark-mode .divider {
  color: var(--text-secondary-dark);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
}

.dark-mode .divider::before,
.dark-mode .divider::after {
  background-color: rgba(255, 255, 255, 0.1);
}

.divider span {
  padding: 0 1rem;
  font-size: 0.85rem;
}

.social-buttons {
  display: flex;
  gap: 1rem;
}

.social-btn {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.dark-mode .social-btn {
  background-color: rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary-dark);
}

.social-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.social-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.social-btn.google {
  background-color: #fff;
  color: #444;
}

.social-btn.github {
  background-color: #24292e;
  color: white;
}

.dark-mode .social-btn.google {
  background-color: rgba(255, 255, 255, 0.9);
  color: #444;
}

.loader {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.loader.small {
  width: 14px;
  height: 14px;
  border-width: 1.5px;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.password-requirements {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-secondary-light);
}

.dark-mode .password-requirements {
  color: var(--text-secondary-dark);
}

.password-requirements p {
  margin-bottom: 0.5rem;
}

.password-requirements ul {
  padding-left: 1.5rem;
  margin: 0;
}

.password-requirements li {
  margin-bottom: 0.25rem;
  position: relative;
}

.requirement-met {
  color: #4CAF50;
}

.password-strength {
  margin-top: 1rem;
}

.strength-bar {
  height: 4px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.dark-mode .strength-bar {
  background-color: rgba(255, 255, 255, 0.1);
}

.strength-level {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.strength-level.weak {
  background-color: #f44336;
}

.strength-level.fair {
  background-color: #ff9800;
}

.strength-level.good {
  background-color: #4caf50;
}

.strength-level.strong {
  background-color: #2e7d32;
}

.strength-text {
  font-size: 0.75rem;
}

.strength-text.weak {
  color: #f44336;
}

.strength-text.fair {
  color: #ff9800;
}

.strength-text.good {
  color: #4caf50;
}

.strength-text.strong {
  color: #2e7d32;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.alert.error {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border-left: 3px solid #f44336;
}

.alert.success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border-left: 3px solid #4caf50;
}

.auth-benefits {
  flex: 1;
  background: linear-gradient(135deg, var(--primary-dark), var(--secondary-dark));
  padding: 3rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-benefits h2 {
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: var(--accent);
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.benefit-icon {
  font-size: 1.5rem;
  background-color: rgba(100, 255, 218, 0.1);
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.benefit-content h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary-dark);
}

.benefit-content p {
  color: var(--text-secondary-dark);
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .auth-form-container {
    flex-direction: column;
  }

  .auth-card {
    max-width: 100%;
  }

  .auth-benefits {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .auth-form-container {
    padding: 1rem;
  }

  .auth-card {
    padding: 1.5rem;
  }

  .social-buttons {
    flex-direction: column;
  }
}
</style>