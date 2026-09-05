<template>
  <div class="app-container">
    <!-- Sidebar -->
    <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Logo -->
      <div class="sidebar-header">
        <img src="/icon.png" alt="Solar TPC" class="sidebar-logo" />
      </div>

      <!-- Navigation -->
      <div class="sidebar-nav">
        <div class="nav-label">QUẢN LÝ</div>
        <ul class="nav-list">
          <li
            class="nav-item"
            :class="{ active: $route.path === '/dashboard' }"
            @click="router.push('/dashboard')"
          >
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            </span>
            <span class="nav-text">Tổng quan</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: $route.path.startsWith('/projects') }"
            @click="router.push('/projects')"
          >
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </span>
            <span class="nav-text">Sản phẩm</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: $route.path.startsWith('/assets') }"
            @click="router.push('/assets')"
          >
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </span>
            <span class="nav-text">{{ $t('menu.asset_management') || 'Quản lí tài sản' }}</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: $route.path.startsWith('/services') }"
            @click="router.push('/services')"
          >
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            </span>
            <span class="nav-text">{{ $t('menu.service_management') || 'Quản lý dịch vụ' }}</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: $route.path.startsWith('/users') }"
            @click="router.push('/users')"
          >
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </span>
            <span class="nav-text">Người dùng</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: $route.path.startsWith('/items') }"
            @click="router.push('/items')"
          >
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            </span>
            <span class="nav-text">Danh mục chung</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Wrapper -->
    <div class="main-wrapper">
      <!-- Top Header Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          
          <div class="search-wrap">
            <input type="text" class="topbar-search" placeholder="Type to search..." />
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>
        
        <div class="topbar-right">
          <div class="header-action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span class="badge badge-danger">3</span>
          </div>

          <div class="header-action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span class="badge badge-warning">2</span>
          </div>

          <div class="user-dropdown" @click.stop="showUserMenu = !showUserMenu">
            <div class="user-info">
              <span class="user-name">{{ user.name || 'Admin' }}</span>
              <span class="user-role">{{ user.role || 'Administrator' }}</span>
            </div>
            <div class="user-avatar">{{ (user.name || 'A').charAt(0).toUpperCase() }}</div>
            
            <!-- Dropdown Menu -->
            <div v-if="showUserMenu" class="dropdown-menu">
              <div class="dropdown-item" @click="showChangePasswordModal = true; showUserMenu = false">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                Đổi mật khẩu
              </div>
              <div class="dropdown-item" @click="handleLogout">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Đăng xuất
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- App Main Content Area -->
      <div class="app-main">
        <div class="app-content-header">
          <div class="page-title-heading">
            <div class="page-title-icon">
              <svg v-if="route.path === '/dashboard'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3f6ad8" stroke-width="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
              <svg v-else-if="route.path.startsWith('/projects')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f7b924" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2-2v16"></path></svg>
              <svg v-else-if="route.path.startsWith('/items')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d92550" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3ac47d" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div>
              <div class="page-title">{{ routeTitle }}</div>
              <div class="page-title-subheading">Quản trị viên có toàn quyền kiểm soát hệ thống.</div>
            </div>
          </div>
        </div>

        <div class="app-content-body">
          <router-view></router-view>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <TsoChangePasswordDialog
      v-if="showChangePasswordModal"
      :userId="user.userId"
      @close="showChangePasswordModal = false"
      @saved="showChangePasswordModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LocalStorageUtils } from '../../utils/LocalStorageUtils'
import TsoChangePasswordDialog from '../admin/TsoChangePasswordDialog.vue'

const router = useRouter()
const route = useRoute()
const user = ref({ userId: 0, name: '', role: '', avatar: '' })
const sidebarCollapsed = ref(false)
const showUserMenu = ref(false)
const showChangePasswordModal = ref(false)

const routeTitle = computed(() => {
  if (route.path === '/dashboard') return 'Dashboard'
  if (route.path.startsWith('/projects')) return 'Sản phẩm'
  if (route.path.startsWith('/assets')) return 'Quản lí tài sản'
  if (route.path.startsWith('/services')) return 'Quản lý Dịch vụ'
  if (route.path.startsWith('/users')) return 'Quản lý Người dùng'
  if (route.path.startsWith('/items')) return 'Danh mục chung'
  return ''
})

const closeDropdown = (e: Event) => {
  const el = e.target as HTMLElement;
  if (!el.closest('.user-dropdown')) {
    showUserMenu.value = false;
  }
}

onMounted(() => {
  const storedUser = LocalStorageUtils.getUser()
  if (storedUser) user.value = storedUser
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const handleLogout = () => {
  LocalStorageUtils.clearAuth()
  router.push({ name: 'TsoLogin' })
}
</script>

<style scoped>
/* ========== App Container ========== */
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-main);
  color: var(--text-primary);
}

/* ========== Sidebar ========== */
.sidebar {
  width: 280px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
  z-index: 100;
  border-right: 1px solid var(--border-color);
}
.sidebar.collapsed {
  width: 80px;
}
.sidebar.collapsed .sidebar-header { padding: 18px 0; overflow: hidden; }
.sidebar.collapsed .sidebar-logo {
  width: 120px;
  margin-left: -40px;
} /* fallback icon logic could go here */
.sidebar.collapsed .nav-text,
.sidebar.collapsed .nav-label {
  display: none;
}

/* Logo */
.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--border-color);
  background: #ffffff;
}
.sidebar-logo {
  width: 260px;
  max-width: none;
  height: auto;
  max-height: none;
  object-fit: contain;
  margin-top: -25px;
  margin-bottom: -25px;
  margin-left: -15px;
  flex-shrink: 0;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}
.nav-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 14px;
  margin-bottom: 4px;
}
.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  user-select: none;
  position: relative;
}
.nav-item:hover {
  background: #f1f4f6;
}
/* ArchitectUI Active State */
.nav-item.active {
  background: #e0f3ff;
  color: var(--primary);
  font-weight: 600;
}
.nav-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--primary);
  border-radius: 4px 0 0 4px;
}
.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  flex-shrink: 0;
  color: var(--text-secondary);
}
.nav-item.active .nav-icon {
  color: var(--primary);
}

/* ========== Top Bar ========== */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}
.topbar {
  height: 60px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  box-shadow: 0 0.125rem 0.625rem rgba(4,9,20,0.04);
  z-index: 50;
}
.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  color: #adb5bd;
  padding: 0;
  display: flex;
  transition: color 0.15s;
}
.hamburger:hover { color: var(--primary); }

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: #f1f4f6;
  border-radius: 40px;
  padding: 6px 16px 6px 36px;
}
.search-icon {
  position: absolute;
  left: 12px;
  color: #6c757d;
}
.topbar-search {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  width: 150px;
  color: var(--text-primary);
}

/* Header Icons */
.header-action-icon {
  position: relative;
  cursor: pointer;
  color: #6c757d;
  display: flex;
  align-items: center;
}
.header-action-icon:hover { color: var(--primary); }
.header-action-icon .badge {
  position: absolute;
  top: -6px;
  right: -8px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  padding: 2px 5px;
  border-radius: 10px;
}
.badge-danger { background: var(--danger); }
.badge-warning { background: var(--warning); color: #fff !important; }

/* User Dropdown */
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  padding-left: 12px;
  border-left: 1px solid var(--border-color);
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.user-role {
  font-size: 12px;
  color: var(--text-secondary);
}
.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--info);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dropdown-menu {
  position: absolute;
  right: 0;
  top: 50px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 0.5rem 2rem rgba(0,0,0,0.1);
  min-width: 180px;
  padding: 8px 0;
  animation: fadeDown 0.15s ease;
}
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--text-primary);
  transition: background 0.1s;
}
.dropdown-item:hover { background: #f8f9fa; color: var(--danger); }

/* ========== Content Area ========== */
.app-main {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.app-content-header {
  padding: 30px;
  background: #f1f4f6;
}
.page-title-heading {
  display: flex;
  align-items: center;
  gap: 16px;
}
.page-title-icon {
  width: 60px;
  height: 60px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.46875rem 2.1875rem rgba(4,9,20,0.03), 0 0.9375rem 1.40625rem rgba(4,9,20,0.03), 0 0.25rem 0.53125rem rgba(4,9,20,0.05);
}
.page-title {
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 4px;
}
.page-title-subheading {
  font-size: 14px;
  color: var(--text-secondary);
}

.app-content-body {
  padding: 0 30px 30px;
  flex: 1;
}
</style>
