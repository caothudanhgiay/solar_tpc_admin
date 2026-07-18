<template>
  <div class="login-page">
    <div class="login-wrapper">
      <div class="login-card">
        <!-- Form Area -->
        <div class="form-area">
          <img src="/icon.png" alt="Solar TPC" class="login-brand-logo" />
          <h3 class="form-title">Welcome back,</h3>
          <p class="form-subtitle">Please sign in to your account below.</p>

          <!-- Error Alert -->
          <div v-if="errorMsg" class="alert-danger">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <input
                v-model="username"
                type="text"
                class="form-control"
                :placeholder="$t('loginPage.usernamePlaceholder')"
                :disabled="loading"
              />
            </div>

            <div class="form-group mt-3">
              <input
                v-model="password"
                type="password"
                class="form-control"
                :placeholder="$t('loginPage.passwordPlaceholder')"
                :disabled="loading"
              />
            </div>

            <div class="form-options mt-3">
              <label class="checkbox-wrap">
                <input type="checkbox" v-model="rememberMe" />
                <span>{{ $t('loginPage.rememberMe') }}</span>
              </label>
            </div>

            <div class="form-actions mt-4">
              <a href="#" class="forgot-link">Recover Password</a>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner"></span>
                <span v-else>Login to Dashboard</span>
              </button>
            </div>
          </form>
        </div>
        
        <!-- Footer -->
        <div class="card-footer">
          No account? <a href="#" class="signup-link">Sign up now</a>
        </div>
      </div>
      <div class="login-footer-text">
        Copyright © Solar TPC 2026
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { apiPost } from '../api/apiClient'
import { ApiException } from '../exception/exception'
import { API_AUTH_LOGIN } from '../utils/constants'
import { LocalStorageUtils } from '../utils/LocalStorageUtils'

const router = useRouter()
const { t } = useI18n()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMsg = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value.trim() || !password.value) {
    errorMsg.value = t('loginPage.errorEmpty')
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const dataJson = {
      username: username.value.trim(),
      password: password.value
    };

    const response = await apiPost(API_AUTH_LOGIN, dataJson);
    if (response && response.statusCode === 200) {
      const data = response.data
      LocalStorageUtils.setToken(data.token)
      LocalStorageUtils.setUser({
        userId: data.userId,
        name: data.username,
        role: data.role,
        avatar: data.username.charAt(0).toUpperCase()
      })
      router.push({ name: 'TsoDashboard' })
    } else {
      errorMsg.value = response?.message || t('loginPage.errorServer')
    }
  } catch (error: any) {
    if (error instanceof ApiException) {
      errorMsg.value = error.message
    } else {
      errorMsg.value = t('loginPage.errorServer')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ========== Page Level ========== */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* ArchitectUI Free gradient background */
  background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  padding: 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ========== Logo Area ========== */
.login-brand-logo {
  width: 420px;
  max-width: 100%;
  height: auto;
  max-height: none;
  object-fit: contain;
}

/* ========== Card ========== */
.login-card {
  width: 100%;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.4s ease;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-area {
  padding: 40px 48px;
  text-align: center;
}

.form-title {
  font-size: 24px;
  font-weight: 400;
  color: #495057;
  margin: 0 0 8px;
}
.form-subtitle {
  font-size: 15px;
  color: #888;
  margin: 0 0 32px;
}

/* ========== Form Elements ========== */
.form-group {
  text-align: left;
}
.mt-3 { margin-top: 16px; }
.mt-4 { margin-top: 24px; }

.form-control {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}
.form-control:focus {
  outline: 0;
  border-color: #3f6ad8;
  box-shadow: 0 0 0 0.2rem rgba(63, 106, 216, 0.25);
}

/* Checkbox */
.form-options {
  text-align: left;
}
.checkbox-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: #6c757d;
  cursor: pointer;
}
.checkbox-wrap input {
  accent-color: #3f6ad8;
}

/* Actions */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e9ecef;
  padding-top: 24px;
}
.forgot-link {
  color: #3f6ad8;
  text-decoration: none;
  font-size: 14px;
}
.forgot-link:hover {
  text-decoration: underline;
}



/* ========== Alert ========== */
.alert-danger {
  padding: 12px 20px;
  margin-bottom: 24px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  background-color: #f8d7da;
  color: #721c24;
  font-size: 14px;
}

/* ========== Footer ========== */
.card-footer {
  padding: 16px 24px;
  background-color: #fff; /* White in free theme, just separator */
  border-top: 1px solid #e9ecef;
  text-align: center;
  font-size: 14px;
  color: #6c757d;
}
.signup-link {
  color: #3f6ad8;
  text-decoration: none;
  font-weight: 600;
}
.signup-link:hover {
  text-decoration: underline;
}

.login-footer-text {
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 576px) {
  .form-area { padding: 30px 24px; }
  .form-actions { flex-direction: column; gap: 16px; }
  .btn-primary { width: 100%; }
}
</style>
