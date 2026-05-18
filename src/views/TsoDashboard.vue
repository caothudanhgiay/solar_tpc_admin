<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <svg class="brand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-9a1 1 0 0 1 .993.883L13 1v2a1 1 0 0 1-1.993.117L11 3V1a1 1 0 0 1 1-1Zm0 20a1 1 0 0 1 .993.883L13 21v2a1 1 0 0 1-1.993.117L11 23v-2a1 1 0 0 1 1-1ZM3.515 3.515a1 1 0 0 1 1.32-.083l.094.083 1.414 1.414a1 1 0 0 1-1.32 1.497l-.094-.083-1.414-1.414a1 1 0 0 1 0-1.414Zm14.142 14.142a1 1 0 0 1 1.32-.083l.094.083 1.414 1.414a1 1 0 0 1-1.32 1.497l-.094-.083-1.414-1.414a1 1 0 0 1 0-1.414ZM1 11a1 1 0 0 1 .993.883L2 12h2a1 1 0 0 1 .117 1.993L4 14H2a1 1 0 0 1-1-1Zm20 0a1 1 0 0 1 .993.883L22 12h2a1 1 0 0 1 .117 1.993L24 14h-2a1 1 0 0 1-1-1ZM5.029 17.566a1 1 0 0 1 .083 1.32l-.083.094-1.414 1.414a1 1 0 0 1-1.497-1.32l.083-.094 1.414-1.414a1 1 0 0 1 1.414 0Zm14.142-14.142a1 1 0 0 1 .083 1.32l-.083.094-1.414 1.414a1 1 0 0 1-1.497-1.32l.083-.094 1.414-1.414a1 1 0 0 1 1.414 0Z"/>
        </svg>
        <div class="brand-name">SOLAR TPC</div>
      </div>
      <ul class="sidebar-menu">
        <li class="menu-item active">
          <span class="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
          </span>
          Tổng quan
        </li>
        <li class="menu-item">
          <span class="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </span>
          Giám sát
        </li>
        <li class="menu-item">
          <span class="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
          </span>
          Báo cáo
        </li>
        <li class="menu-item">
          <span class="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </span>
          Cài đặt
        </li>
      </ul>
      <div class="sidebar-footer">
        <div class="user-profile-widget">
          <div class="avatar">{{ user.avatar || 'U' }}</div>
          <div class="user-info">
            <span class="user-name">{{ user.name || 'Admin User' }}</span>
            <span class="user-role">{{ user.role || 'Administrator' }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="topbar">
        <div class="page-title-group">
          <h2>Dashboard</h2>
        </div>
        <div class="topbar-actions">
          <div class="weather-indicator">
            <span class="sun-glow">☀️</span>
            <span>Nắng ráo - 32°C</span>
          </div>
          <button class="btn-icon-only">
            <div class="notification-badge-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span class="badge">3</span>
            </div>
          </button>
          <button class="btn-icon-only" @click="handleLogout" title="Đăng xuất">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </header>

      <div class="content-body">
        <div class="metrics-grid">
          <div class="metric-card glass-panel">
            <div class="metric-card-header">
              <span class="metric-title">Sản Lượng Hôm Nay</span>
              <div class="metric-icon-box icon-yellow">⚡</div>
            </div>
            <div class="metric-value">1,245 kWh</div>
            <div class="metric-footer">
              <span class="trend-up">↑ 12%</span>
              <span class="trend-text">so với hôm qua</span>
            </div>
          </div>
          <div class="metric-card glass-panel">
            <div class="metric-card-header">
              <span class="metric-title">Doanh Thu Dự Kiến</span>
              <div class="metric-icon-box icon-emerald">💵</div>
            </div>
            <div class="metric-value">2,850,000 đ</div>
            <div class="metric-footer">
              <span class="trend-up">↑ 8%</span>
              <span class="trend-text">so với hôm qua</span>
            </div>
          </div>
          <div class="metric-card glass-panel">
            <div class="metric-card-header">
              <span class="metric-title">Hiệu Suất Hệ Thống</span>
              <div class="metric-icon-box icon-blue">📈</div>
            </div>
            <div class="metric-value">94.5%</div>
            <div class="metric-footer">
              <span class="trend-stable">→ 0%</span>
              <span class="trend-text">ổn định</span>
            </div>
          </div>
          <div class="metric-card glass-panel">
            <div class="metric-card-header">
              <span class="metric-title">Cảnh Báo</span>
              <div class="metric-icon-box icon-red">⚠️</div>
            </div>
            <div class="metric-value">2</div>
            <div class="metric-footer">
              <span class="trend-down">↓ 1</span>
              <span class="trend-text">cần xử lý</span>
            </div>
          </div>
        </div>

        <div class="sections-grid">
          <div class="section-panel glass-panel">
            <div class="panel-header">
              <span class="panel-title">Biểu Đồ Sản Lượng</span>
              <div class="panel-actions">
                <button class="btn-small active">Hôm nay</button>
                <button class="btn-small">Tuần này</button>
              </div>
            </div>
            <!-- Mock Chart -->
            <div class="chart-container" style="height: 250px;">
              <div class="chart-y-labels">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>
              <div class="chart-main">
                <div class="chart-grid-line" style="bottom: 0%"></div>
                <div class="chart-grid-line" style="bottom: 25%"></div>
                <div class="chart-grid-line" style="bottom: 50%"></div>
                <div class="chart-grid-line" style="bottom: 75%"></div>
                <div class="chart-grid-line" style="bottom: 100%"></div>
                
                <svg class="chart-svg" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <linearGradient id="chartGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.5"/>
                    <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
                  </linearGradient>
                  <!-- Area -->
                  <path d="M0,200 L0,150 L50,120 L100,100 L150,60 L200,40 L250,50 L300,20 L350,30 L400,80 L450,140 L500,160 L500,200 Z" fill="url(#chartGlow)" />
                  <!-- Line -->
                  <path d="M0,150 L50,120 L100,100 L150,60 L200,40 L250,50 L300,20 L350,30 L400,80 L450,140 L500,160" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <div class="section-panel glass-panel">
            <div class="panel-header">
              <span class="panel-title">Trạng Thái Inverter</span>
            </div>
            <div class="control-grid">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="status-indicator status-active"></span>
                  <span>Inverter #1</span>
                </div>
                <span style="font-weight: bold; color: var(--success);">Online</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="status-indicator status-active"></span>
                  <span>Inverter #2</span>
                </div>
                <span style="font-weight: bold; color: var(--success);">Online</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="status-indicator status-maintenance"></span>
                  <span>Inverter #3</span>
                </div>
                <span style="font-weight: bold; color: var(--primary);">Bảo trì</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref({ name: '', role: '', avatar: '' })

onMounted(() => {
  const storedUser = localStorage.getItem('solar_admin_user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

const handleLogout = () => {
  localStorage.removeItem('solar_admin_token')
  localStorage.removeItem('solar_admin_user')
  router.push({ name: 'TsoLogin' })
}
</script>

<style scoped>
/* Additional component specific styles if needed, mostly handled by global CSS */
</style>

