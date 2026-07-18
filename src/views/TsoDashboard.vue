<template>
  <div>
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
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>

