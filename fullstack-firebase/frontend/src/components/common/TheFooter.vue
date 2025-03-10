<template>
  <footer class="cs-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-logo">
          <div class="code-brackets">&lt;/&gt;</div>
          <h2>CodeMatrix</h2>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h3>Learn</h3>
            <ul>
              <li><router-link to="/algorithms">Algorithms</router-link></li>
              <li><router-link to="/data-structures">Data Structures</router-link></li>
              <li><router-link to="/math-topics">Math Foundations</router-link></li>
              <li><router-link to="/design-patterns">Design Patterns</router-link></li>
            </ul>
          </div>
          <div class="link-group">
            <h3>Resources</h3>
            <ul>
              <li><router-link to="/documentation">Documentation</router-link></li>
              <li><router-link to="/tutorials">Tutorials</router-link></li>
              <li><router-link to="/community">Community</router-link></li>
              <li><router-link to="/challenges">Challenges</router-link></li>
            </ul>
          </div>
          <div class="link-group">
            <h3>Connect</h3>
            <ul>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord</a></li>
              <li><router-link to="/newsletter">Newsletter</router-link></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; {{ currentYear }} CodeMatrix. All rights reserved.</p>
        </div>
        <div class="terminal">
          <span class="terminal-prompt">$ </span>
          <span class="terminal-text">{{ terminalText }}</span>
          <span class="terminal-cursor"></span>
        </div>
        <div class="theme-toggle" @click="toggleTheme">
          <span v-if="isDarkMode">☀️</span>
          <span v-else>🌙</span>
        </div>
      </div>
    </div>
    <div class="circuit-background"></div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'

export default defineComponent({
  name: 'TheFooter',
  setup() {
    const currentYear = new Date().getFullYear();
    const isDarkMode = ref(false);
    const terminalText = ref('');

    const terminalPhrases = [
      'while(true) { learnAndGrow(); }',
      'function solve(problem) { return algorithm.apply(dataStructure); }',
      'if(knowledge === undefined) { learn(); }',
      'for(let i=0; i<Infinity; i++) { improve(skills); }',
      'try { code(); } catch(error) { learn(); }',
    ];

    // Randomly select a terminal phrase on component mount
    onMounted(() => {
      const randomIndex = Math.floor(Math.random() * terminalPhrases.length);
      terminalText.value = terminalPhrases[randomIndex];

      // Check if dark mode was previously set
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        isDarkMode.value = true;
        document.body.classList.add('dark-mode');
      }
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

    return {
      currentYear,
      isDarkMode,
      terminalText,
      toggleTheme
    };
  }
})
</script>

<style scoped>
.cs-footer {
  background-color: var(--primary-dark);
  color: var(--text-primary-dark);
  padding: 4rem 0 2rem;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-right: 2rem;
}

.code-brackets {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--accent);
  font-family: 'Courier New', monospace;
  margin-right: 0.5rem;
}

.footer-logo h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  color: var(--accent);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

.link-group h3 {
  color: var(--accent);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  position: relative;
}

.link-group h3::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 2px;
  background-color: var(--accent);
  bottom: -5px;
  left: 0;
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: 0.8rem;
}

.link-group a {
  color: var(--text-secondary-dark);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  position: relative;
  padding-left: 0;
  transition: padding-left 0.3s ease;
}

.link-group a:hover {
  color: var(--accent);
  padding-left: 8px;
}

.link-group a::before {
  content: '>';
  position: absolute;
  left: -8px;
  opacity: 0;
  transition: opacity 0.3s ease, left 0.3s ease;
  color: var(--accent);
}

.link-group a:hover::before {
  opacity: 1;
  left: 0;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(100, 255, 218, 0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  font-size: 0.8rem;
  color: var(--text-secondary-dark);
}

.terminal {
  background-color: rgba(22, 33, 58, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  font-family: 'Courier New', monospace;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.terminal-prompt {
  color: var(--accent);
  margin-right: 0.5rem;
}

.terminal-text {
  color: var(--text-primary-dark);
}

.terminal-cursor {
  width: 8px;
  height: 16px;
  background-color: var(--accent);
  display: inline-block;
  margin-left: 0.5rem;
  animation: blink 1s infinite;
}

.theme-toggle {
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: rotate(30deg);
}

.circuit-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(rgba(100, 255, 218, 0.05) 2px, transparent 2px),
  linear-gradient(to right, rgba(100, 255, 218, 0.03) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(100, 255, 218, 0.03) 1px, transparent 1px);
  background-size: 40px 40px, 20px 20px, 20px 20px;
  z-index: 1;
  opacity: 0.2;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
  }

  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .theme-toggle {
    margin-top: 1rem;
  }
}
</style>