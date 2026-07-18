# Solar TPC Admin - AI Coding Rules

> Vue 3.5 · Vite 8 · TypeScript · Axios · vue-i18n · vue-router 5

Đọc file `../AGENTS.md` (root) để hiểu tổng quan dự án.

---

## 0. Quy tắc Thiết kế (Design System Rule)
**BẮT BUỘC:** Luôn luôn thiết kế layout, màu sắc, font chữ, hiệu ứng dựa trên mẫu **ArchitectUI Free Theme**:
🔗 [https://dashboardpack.com/live-demo-free/?livedemo=2380&v=e14da64a5617](https://dashboardpack.com/live-demo-free/?livedemo=2380&v=e14da64a5617)

## 1. Kiến trúc Ứng dụng (Architecture)

```
src/
├── api/
│   └── apiClient.ts       # Axios instance + interceptors + wrapper functions
├── assets/                 # Static assets (images, fonts...)
├── exception/              # Custom exception/error classes
│   ├── exception.ts        # ApiException class
│   └── error.ts            # AppError class
├── locales/                # i18n translation files (vi.json, en.json)
├── router/
│   └── index.ts            # Vue Router config + navigation guards
├── utils/
│   ├── constants.ts        # API URLs + app constants
│   ├── LocalStorageUtils.ts# LocalStorage wrapper
│   ├── StringUtils.ts      # String helper functions
│   └── NumberUtils.ts      # Number helper functions
├── views/                  # Page-level components (1 view = 1 route)
│   ├── layout/             # Layout components (Sidebar, Header, etc.)
│   ├── components/         # Reusable components
│   ├── TsoLogin.vue
│   └── TsoDashboard.vue
├── i18n.ts                 # i18n configuration
├── main.ts                 # App entry point
├── TsoApp.vue              # Root App component
└── style.css               # Global CSS styles
```

## 2. Naming Convention

### Prefix bắt buộc: `Tso`
- View (trang): `TsoXxx.vue` → `TsoLogin.vue`, `TsoDashboard.vue`
- Component: `TsoXxx.vue` → `TsoHelloWorld.vue`, `TsoSidebar.vue`
- Root App: `TsoApp.vue`
- Utility class: `PascalCase` → `LocalStorageUtils.ts`, `StringUtils.ts`
- Router name: `'TsoXxx'` → `'TsoLogin'`, `'TsoDashboard'`

### File Organization
- Views (page-level): `src/views/TsoXxx.vue`
- Components (reusable): `src/views/components/TsoXxx.vue`
- Layout: `src/views/layout/TsoXxx.vue`
- API logic: `src/api/`
- Utilities: `src/utils/`
- Exceptions: `src/exception/`

## 3. Coding Patterns

### 3.1. View Component (Page)
```vue
<template>
  <div class="page-container">
    <h1>{{ $t('pageName.title') }}</h1>
    <!-- Page content -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { apiGet } from '../api/apiClient'
import { ApiException } from '../exception/exception'

const router = useRouter()
const { t } = useI18n()

const loading = ref(false)
const errorMsg = ref('')
const data = ref<any[]>([])

const fetchData = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const response = await apiGet('/api/xxx')
    if (response && response.statusCode === 200) {
      data.value = response.data
    }
  } catch (error: any) {
    if (error instanceof ApiException) {
      errorMsg.value = error.message
    } else {
      errorMsg.value = t('common.errorServer')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Component-specific styles */
</style>
```

**Quy tắc View:**
- Luôn dùng `<script setup lang="ts">` (Composition API)
- KHÔNG dùng Options API (`data()`, `methods`, `computed`...)
- Error handling: phân biệt `ApiException` vs lỗi chung
- Loading state: dùng `ref<boolean>` cho loading indicator
- i18n: dùng `$t('key')` trong template, `t('key')` trong script

### 3.2. Reusable Component
```vue
<template>
  <div class="tso-component">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const emit = defineEmits<{
  (e: 'click', value: string): void
}>()
</script>

<style scoped>
.tso-component {
  /* styles */
}
</style>
```

**Quy tắc Component:**
- Props: dùng TypeScript interface + `withDefaults`
- Events: dùng typed `defineEmits`
- Scoped styles: luôn dùng `<style scoped>`
- Slots: dùng `<slot>` cho content composition

### 3.3. Router Configuration
```typescript
// router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { LocalStorageUtils } from '../utils/LocalStorageUtils'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/xxx',
    name: 'TsoXxx',           // Prefix Tso cho route name
    component: () => import('../views/TsoXxx.vue'),  // Lazy loading
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const isLoggedIn = !!LocalStorageUtils.getToken()
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'TsoLogin' })
  } else {
    next()
  }
})
```

**Quy tắc Router:**
- Route name: prefix `Tso` → `'TsoLogin'`, `'TsoDashboard'`
- Lazy loading: dùng `() => import(...)` cho views lớn
- Auth guard: kiểm tra token qua `LocalStorageUtils.getToken()`
- Meta fields: `requiresAuth: true` cho trang cần login, `requiresGuest: true` cho trang chỉ guest

### 3.4. API Client
```typescript
// Sử dụng wrapper functions đã có:
import { apiGet, apiPost, apiPut, apiDelete } from '../api/apiClient'

// GET request
const data = await apiGet<TsoApiResponse>('/api/users')

// POST request  
const result = await apiPost<TsoApiResponse>('/api/users', { name: 'xxx' })

// PUT request
const updated = await apiPut<TsoApiResponse>('/api/users/1', { name: 'yyy' })

// DELETE request
const deleted = await apiDelete<TsoApiResponse>('/api/users/1')
```

**Quy tắc API:**
- LUÔN dùng wrapper functions (`apiGet`, `apiPost`, `apiPut`, `apiDelete`) — KHÔNG gọi `axios` trực tiếp
- Interceptors đã xử lý: Bearer token auto-attach, 401 redirect, error parsing
- API URL constants khai báo trong `src/utils/constants.ts`
- Base URL từ env: `VITE_API_URL`

### 3.5. Error Handling
```typescript
import { ApiException } from '../exception/exception'
import { AppError } from '../exception/error'

try {
  const response = await apiPost(API_AUTH_LOGIN, data)
} catch (error: any) {
  if (error instanceof ApiException) {
    // Lỗi từ server (có statusCode, message, data)
    console.error(`Server error ${error.statusCode}: ${error.message}`)
  } else if (error instanceof AppError) {
    // Lỗi kết nối
    console.error(`Connection error: ${error.message}`)
  }
}
```

### 3.6. Constants
```typescript
// utils/constants.ts
export const API_BASE = '/api'
export const API_XXX = `${API_BASE}/xxx`
```

**Quy tắc Constants:**
- API endpoints: khai báo trong `constants.ts` với prefix `API_`
- App constants: nhóm trong `APP_CONSTANTS` object
- Env variables: dùng `import.meta.env.VITE_XXX`

## 4. Quy tắc Styling (Design System)

- **Giao diện chuẩn:** Luôn bám sát thiết kế, màu sắc và bố cục của **ArchitectUI Free Theme** (Link tham khảo: https://dashboardpack.com/live-demo-free/?livedemo=2380&v=e14da64a5617).
  - Sử dụng nền trắng (`#fff`) cho Sidebar và Card, hover màu xanh nhạt (`#e0f3ff`).
  - Màu chủ đạo (Primary) là Royal Blue (`#3f6ad8`).
  - Hiệu ứng đổ bóng (box-shadow) mềm và nhiều lớp đặc trưng của ArchitectUI.
- **Global styles**: `src/style.css` — chứa CSS variables (nền, màu sắc, font, shadow), base styles, utility classes.
- **Component styles**: `<style scoped>` — tránh ảnh hưởng global.
- **Class naming**: CSS class dùng `kebab-case` → `.login-container`, `.card-header`.
- **CSS Variables**: Dùng biến CSS cho theming (ví dụ: `var(--bg-main)`, `var(--primary)`).
- **KHÔNG dùng Tailwind** — project này dùng thuần Vanilla CSS.

## 5. Quy tắc i18n

- Library: `vue-i18n`
- Template: `{{ $t('key') }}` hoặc `:placeholder="$t('key')"`
- Script: `const { t } = useI18n()` → `t('key')`
- Files: `src/locales/vi.json`, `src/locales/en.json`
- KHÔNG hardcode text hiển thị

## 6. Authentication Flow

1. Login: `POST /api/auth/login` → nhận `{ token, username, role }`
2. Lưu token: `LocalStorageUtils.setToken(token)`
3. Lưu user info: `LocalStorageUtils.setUser({ name, role, avatar })`
4. Auto-attach: Interceptor tự gắn `Authorization: Bearer {token}`
5. 401 handling: Interceptor tự redirect về `/login` + clear auth
6. Logout: `LocalStorageUtils.clearAuth()` + redirect

## 7. Build & Dev

```bash
npm run dev      # Vite dev server
npm run build    # Production build (vue-tsc + vite build)
npm run preview  # Preview production build
```
