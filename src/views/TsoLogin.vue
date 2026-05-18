<template>
  <div class="login-container">
    <div class="login-card glass-panel slide-up-enter-active">
      <div class="login-header">
        <div class="login-logo" style="overflow: hidden;">
          <img src="/icon.png" alt="Solar TPC Logo" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        <h1 class="login-title">SOLAR TPC</h1>
        <p class="login-subtitle">Hệ thống Giám sát & Quản trị Năng lượng</p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMsg" class="error-alert">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span>{{ errorMsg }}</span>
      </div>

      <form @submit.prevent="handleLogin">
        <!-- Username input -->
        <div class="form-group">
          <label class="form-label">Tài khoản quản trị</label>
          <div class="input-wrapper">
            <input 
              v-model="username" 
              type="text" 
              class="form-input" 
              placeholder="Nhập tài khoản (admin)..." 
              required
              :disabled="loading"
            />
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
          </div>
        </div>

        <!-- Password input -->
        <div class="form-group">
          <label class="form-label">Mật khẩu</label>
          <div class="input-wrapper">
            <input 
              v-model="password" 
              type="password" 
              class="form-input" 
              placeholder="Nhập mật khẩu (admin123)..." 
              required
              :disabled="loading"
            />
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
          </div>
        </div>

        <!-- Remember & Forgot pwd -->
        <div class="form-actions">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" class="checkbox-input" />
            <span>Ghi nhớ phiên đăng nhập</span>
          </label>
        </div>

        <!-- Submit button -->
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading">Đang xác thực...</span>
          <template v-else>
            <span>Đăng Nhập</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </template>
        </button>
      </form>
      
      <!-- Hint box -->
      <div style="margin-top: 25px; font-size: 12px; color: var(--text-muted); text-align: center; border-top: 1px dashed var(--border-color); padding-top: 15px;">
        Gợi ý thử nghiệm: Tài khoản <strong>admin</strong> | Mật khẩu <strong>admin123</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const rememberMe = ref(true)
const errorMsg = ref('')
const loading = ref(false)

const handleLogin = () => {
  loading.value = true
  errorMsg.value = ''
  
  // Simulate network request latency
  setTimeout(() => {
    // Basic verification - accepts admin / admin123
    if (username.value.trim() === 'admin' && password.value === 'admin123') {
      // Set session/local tokens
      localStorage.setItem('solar_admin_token', 'mock-jwt-token-xyz-123')
      localStorage.setItem('solar_admin_user', JSON.stringify({
        name: 'Nguyễn Đinh Sơn',
        role: 'Quản trị viên Hệ thống',
        avatar: 'S'
      }))
      
      // Redirect to dashboard
      router.push({ name: 'Dashboard' })
    } else {
      errorMsg.value = 'Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại!'
      loading.value = false
    }
  }, 1000)
}
</script>

<style scoped>
.slide-up-enter-active {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
