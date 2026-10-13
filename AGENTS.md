# Solar TPC Admin - AI Coding Rules

> Vue 3.5 · Vite 8 · TypeScript · Axios · vue-i18n · vue-router 5

Đọc file `../AGENTS.md` (root) để hiểu tổng quan dự án.

---

## 0. Quy tắc Thiết kế (Design System Rule)

**Phạm vi áp dụng — đọc kỹ để tránh sửa nhầm giao diện đã có:**
- Mẫu **ArchitectUI Free Theme** (🔗 [xem demo](https://dashboardpack.com/live-demo-free/?livedemo=2380&v=e14da64a5617)) chỉ dùng làm **tài liệu tham khảo khi tạo MÀN HÌNH MỚI hoàn toàn** (chưa có file `.vue` nào tồn tại).
- **TUYỆT ĐỐI KHÔNG** tự ý chỉnh sửa, "làm đẹp lại", đổi màu, đổi layout, đổi spacing của bất kỳ màn hình/component **đã tồn tại** với lý do "cho giống ArchitectUI hơn" hoặc "cải thiện UI". Nếu người dùng không yêu cầu rõ ràng việc thay đổi giao diện, **giữ nguyên 100%** layout/CSS hiện tại — kể cả khi nó có vẻ không khớp hoàn toàn với theme mẫu.
- Nguồn sự thật (source of truth) về màu sắc/theme hiện tại là các CSS variables đã khai báo trong `src/style.css` (`var(--bg-main)`, `var(--primary)`...) — KHÔNG suy diễn lại từ link demo mỗi lần code, vì AI không truy cập được link để lấy giá trị chính xác, dễ gây trôi giao diện qua từng lần sửa.
- Chỉ khi task yêu cầu rõ "tạo màn hình mới" hoặc "redesign lại màn hình X" thì mới áp dụng tham khảo từ ArchitectUI Free Theme.

## 1. Kiến trúc Ứng dụng (Architecture)

```
src/
├── api/
│   ├── apiClient.ts        # Axios instance + interceptors + wrapper functions (apiGet/apiPost/...)
│   └── TsoXxxApi.ts        # 1 file / module nghiệp vụ (TsoProjectApi.ts, TsoUserApi.ts...) — xem 3.4b
├── assets/                 # Static assets (images, fonts...)
├── composables/             # Vue composables dùng chung (useXxx.ts) — xem 3.7
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
│   ├── NumberUtils.ts      # Number helper functions
│   └── TsoXxxEnum.ts       # Enum nghiệp vụ dùng ở frontend (vd TsoRoleEnum.ts) — đặt trong utils/, KHÔNG tạo thư mục enums/ riêng (khác server)
├── views/                  # Page-level components (1 view = 1 route)
│   ├── layout/             # Layout components (Sidebar, Header, etc.)
│   ├── components/         # Reusable components
│   │   └── common/         # Component dùng lại nhiều nơi, không gắn 1 module cụ thể (vd TsoSelectOption.vue)
│   ├── master_data/        # Chứa các danh mục Master Data
│   │   ├── projects/       # CHỈ chứa TsoProjectManagement.vue & TsoProjectDialog.vue
│   │   └── users/          # CHỈ chứa TsoUserManagement.vue & TsoUserDialog.vue
│   ├── admin/              # Chứa các form/dialog đặc thù hệ thống (vd: TsoChangePasswordDialog)
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
- Master Data: `src/views/master_data/[tên_danh_mục]/` (Chỉ được chứa ĐÚNG 2 file: `Tso[Tên]Management.vue` và `Tso[Tên]Dialog.vue`)
- Admin Forms: `src/views/admin/` (vd: `TsoChangePasswordDialog.vue`)
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

### 3.2b. So sánh giá trị Enum/Role (số)

Các giá trị nghiệp vụ dạng số (roleId, statusId... — vd `TsoRoleEnumOptions`) có thể bị lưu/trả về không đồng nhất kiểu dữ liệu giữa API response, LocalStorage và code (string vs number). **LUÔN ép kiểu `Number(...)` trước khi so sánh `===`** với các giá trị này, đặc biệt là giá trị đọc từ `LocalStorageUtils.getUser()`/`getItem()`:

```typescript
// ❌ SAI — role đọc từ LocalStorage có thể là number nhưng so sánh với string
const role = currentUser.value?.role;
if (role === '1') { ... }

// ✅ ĐÚNG
const role = Number(currentUser.value?.role);
if (role === 1) { ... }
```

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
- **KHÔNG khai báo 2 route với `path` trùng nhau** (kể cả `path: '/'`) — route đăng ký trước sẽ luôn thắng khi match, route trùng phía sau thành dead code không bao giờ chạy tới. Nếu route cha có `children` và cần redirect ở đúng path gốc (vd `/` → `/dashboard`), khai báo child với `path: ''` và `redirect` bên trong `children`, KHÔNG tạo thêm route riêng cùng path ở ngoài.

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

### 3.4b. API Module theo nghiệp vụ (`api/TsoXxxApi.ts`)

Mỗi module Master Data (Project, User, Service, Asset, Item...) có 1 file API riêng trong `src/api/`, KHÔNG gọi `apiGet`/`apiPost` trực tiếp từ trong view/component:

```typescript
// src/api/TsoProjectApi.ts
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'
import { API_PROJECTS } from '../utils/constants'

export const getProjects = (params?: any) => apiGet(API_PROJECTS, { params })
export const getProjectById = (id: number) => apiGet(`${API_PROJECTS}/${id}`)
export const createProject = (data: FormData) => apiPost(API_PROJECTS, data)
export const updateProject = (id: number, data: FormData) => apiPut(`${API_PROJECTS}/${id}`, data)
export const deleteProject = (id: number) => apiDelete(`${API_PROJECTS}/${id}`)
```

**Quy tắc:**
- Tên file: `Tso[Module]Api.ts`, đặt trong `src/api/`, mỗi module Master Data 1 file riêng (không gộp nhiều module vào 1 file)
- Chỉ export các hàm gọi API thuần (không chứa logic UI/state) — component gọi hàm từ file này, không tự dựng URL/gọi `apiClient` trực tiếp
- Với API có upload file: nhận `FormData` (không phải object JSON thường) — khớp rule Atomic Save ở backend

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

**Quy tắc riêng cho các class tiện ích thuần TS (`src/exception/*.ts`, `src/utils/*.ts`...):** các file này KHÔNG phải Vue component nên không dùng được `useI18n()`, nhưng vẫn PHẢI qua i18n khi hiển thị text cho người dùng (vd `alert()` trong `ApiException.handle()`/`AppError.handle()`). Import trực tiếp instance global: `import i18n from '../i18n'` rồi gọi `i18n.global.t('key')` — giống cách `apiClient.ts` đang làm ở response interceptor. KHÔNG viết chuỗi tiếng Việt/Anh cố định trong các file này.

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

### 3.7. Composables (`src/composables/`)

```typescript
// src/composables/useXxx.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useXxx() {
  const state = ref(false)
  onMounted(() => { /* setup */ })
  onUnmounted(() => { /* cleanup */ })
  return { state }
}
```

**Quy tắc Composable:**
- Tên file/hàm: `useXxx.ts` theo convention chuẩn của Vue (KHÔNG thêm prefix `Tso` — composable không phải component/view)
- Chỉ tạo composable khi logic (state + lifecycle) cần **dùng lại ở ≥ 2 component** — nếu chỉ 1 component dùng thì để trực tiếp trong `<script setup>` của component đó
- Đặt trong `src/composables/`, không đặt lẫn trong `utils/` (utils là hàm thuần không dùng Vue reactivity/lifecycle)

### 3.8. Excel Export & Rich Text Editor

- **Xuất Excel**: dùng thư viện `xlsx` đã có sẵn trong `package.json`. Nút "Xuất Excel" ở mỗi màn Master Data (theo Quy chuẩn Layout Master Data ở cuối file) gọi hàm export dựng `Workbook`/`Worksheet` từ data đang hiển thị trên bảng — đặt logic export trong chính view `Tso[Module]Management.vue`, KHÔNG cần tạo file riêng trừ khi logic dùng lại ở nhiều module.
  - **TUYỆT ĐỐI KHÔNG** tự dựng chuỗi CSV (`"﻿" + ...join(',')`) rồi tải xuống file `.csv` và gắn nhãn "Xuất Excel" — đây không phải Excel thật và không tuân thủ rule trên. PHẢI dùng đúng API của `xlsx`: `XLSX.utils.aoa_to_sheet(...)` (hoặc `json_to_sheet`) → `XLSX.utils.book_new()` → `XLSX.utils.book_append_sheet(wb, ws, sheetName)` → `XLSX.writeFile(wb, 'ten_file.xlsx')`.
  - Header cột trong file xuất cũng phải qua `t()`/`$t()` như header bảng, không hardcode text.
- **Rich text editor**: dùng `@vueup/vue-quill` (component `QuillEditor`) cho các field mô tả dài cần định dạng (vd mô tả dự án). Nội dung lưu dưới dạng HTML string, submit cùng payload `FormData` như các field khác — Backend nhận HTML này qua field kiểu `TEXT`/`LONGTEXT`, KHÔNG tự ý sanitize/strip HTML ở frontend trừ khi được yêu cầu.

## 4. Quy tắc Styling (Design System)

> Xem điều kiện áp dụng ArchitectUI Free Theme ở **Section 0** phía trên — chỉ dùng khi tạo màn hình mới, KHÔNG dùng để chỉnh sửa màn hình đã có.

- **Bảng màu hiện tại** (đã chốt trong `src/style.css`, dùng khi tạo mới): nền trắng (`#fff`) cho Sidebar/Card, hover xanh nhạt (`#e0f3ff`), Primary là Royal Blue (`#3f6ad8`), box-shadow mềm nhiều lớp.
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
- Rule chi tiết + checklist bắt buộc: xem section **"🚫 Quy tắc Tránh Hardcode Text / i18n"** phía dưới

## 6. Authentication Flow

1. Login: `POST /api/auth/login` → nhận `{ token, username, role }`
2. Lưu token: `LocalStorageUtils.setToken(token, rememberMe)` — tham số `rememberMe` (từ checkbox "Ghi nhớ đăng nhập") PHẢI được truyền thật, KHÔNG bỏ qua. `true`/mặc định → lưu ở `localStorage` (giữ đăng nhập qua các lần mở trình duyệt); `false` → lưu ở `sessionStorage` (mất khi đóng tab/trình duyệt). Checkbox kiểu "remember me" mà chỉ cập nhật state cục bộ, không ảnh hưởng tới nơi lưu token, bị coi là tính năng chưa hoàn thành.
3. Lưu user info: `LocalStorageUtils.setUser({ name, role, avatar })` (gọi SAU `setToken` vì `setToken` quyết định storage đang active)
4. Auto-attach: Interceptor tự gắn `Authorization: Bearer {token}`
5. 401 handling: TẤT CẢ các custom Axios instance phải có Response Interceptor tự redirect về `TsoLogin` (hoặc `/login`) + `clearAuth()` khi nhận lỗi 401.
6. Logout: `LocalStorageUtils.clearAuth()` + redirect

## 7. Build & Dev

```bash
npm run dev      # Vite dev server
npm run build    # Production build (vue-tsc + vite build)
npm run preview  # Preview production build
```

## 8. Quy tắc Testing

- Project **hiện chưa có test framework** (không Vitest/Cypress trong `package.json`) — đây là chủ ý hiện tại, không phải thiếu sót cần tự ý bổ sung framework mới.
- Cách verify hiện tại: `npm run dev`, kiểm tra bằng tay qua trình duyệt (đặc biệt các màn Master Data — CRUD, upload ảnh, xuất Excel) + `npm run build` để bắt lỗi type (`vue-tsc`).
- Nếu người dùng yêu cầu thêm test framework, đề xuất Vitest (đồng bộ hệ sinh thái Vite) và hỏi rõ phạm vi (unit cho `utils/`+`composables/`, hay cả component test).

## 9. Quy tắc Tránh Lỗi Hiệu Năng & Lỗi Thường Gặp (Performance & Common Pitfalls)

### 9.1. Tránh gọi API tuần tự / trong vòng lặp (tương đương N+1 ở Frontend)
- **TUYỆT ĐỐI KHÔNG** gọi API riêng cho từng item trong 1 danh sách (vd lấy detail cho từng dòng trong bảng Master Data) — mỗi item 1 request làm chậm trang tỉ lệ thuận với số dòng.
- **TUYỆT ĐỐI KHÔNG** `await` tuần tự nhiều API độc lập không phụ thuộc kết quả của nhau — dùng `Promise.all`.
```typescript
// ❌ SAI — N+1: gọi API riêng cho từng item, await tuần tự trong for
for (const item of selectedIds.value) {
  await apiDelete(`${API_PROJECTS}/${item}`); // N request tuần tự, chậm dần theo số item
}

// ✅ ĐÚNG — song song hoá (nếu backend hỗ trợ), hoặc tốt hơn là 1 API nhận list id (bulk delete)
await Promise.all(selectedIds.value.map((id) => apiDelete(`${API_PROJECTS}/${id}`)));
// Ưu tiên hơn nữa: bổ sung API bulk (POST /api/projects/bulk-delete { ids: [...] }) để chỉ 1 request
```
- Ưu tiên đề xuất/dùng API bulk từ backend (1 request xử lý nhiều id) thay vì N request song song từ frontend khi thao tác trên nhiều dòng đã chọn (xóa nhiều, cập nhật trạng thái nhiều...).

### 9.2. Cleanup `watch`/interval/listener trong `onUnmounted`
- Mọi `setInterval`/`setTimeout` dài hạn, `window.addEventListener`, hoặc `watch` không tự dừng khi component unmount PHẢI được dọn trong `onUnmounted` — không dọn gây memory leak và lỗi cập nhật state trên component đã hủy.
```typescript
// ❌ SAI — không cleanup, leak listener/interval khi component unmount
onMounted(() => {
  window.addEventListener('resize', handleResize)
  setInterval(fetchStatus, 5000)
})

// ✅ ĐÚNG
let timer: number
onMounted(() => {
  window.addEventListener('resize', handleResize)
  timer = window.setInterval(fetchStatus, 5000)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  clearInterval(timer)
})
```
- `watch(..., { deep: true })` trên object/array lớn tốn chi phí theo dõi từng field lồng nhau — chỉ dùng `deep: true` khi thực sự cần phát hiện thay đổi sâu; nếu chỉ cần theo dõi 1 field cụ thể, `watch(() => obj.field, ...)` thay vì deep-watch cả object.

### 9.3. Danh sách lớn — Pagination thay vì fetch/tự phân trang ở client
- Bảng Master Data (theo Quy chuẩn Layout Master Data ở cuối file) **PHẢI** dùng Pagination gọi từ backend (`Pageable`) — **TUYỆT ĐỐI KHÔNG** fetch hết toàn bộ bảng về rồi tự `slice()`/`filter()` phân trang ở client khi dữ liệu có khả năng lớn.
- Riêng chức năng **Xuất Excel** (mục 3.8) khi cần xuất *toàn bộ* dữ liệu (không chỉ trang đang xem), gọi API riêng lấy full data không phân trang — hiển thị loading rõ ràng, không block UI, và cân nhắc giới hạn số dòng tối đa hợp lý phía backend nếu bảng có thể quá lớn.

### 9.4. `reactive`/`ref` pitfalls
- **KHÔNG destructure trực tiếp** 1 object `reactive()` (vd `const { name } = reactive({...})`) — mất reactivity vì destructure lấy ra giá trị nguyên thủy tại thời điểm đó, không còn liên kết với object gốc. Dùng `toRefs()` nếu cần destructure.
- **KHÔNG mutate `props` trực tiếp** trong component con (vd `props.modelValue = x`) — Vue cảnh báo và vi phạm luồng dữ liệu 1 chiều; dùng `emit` để báo component cha cập nhật, hoặc `defineModel()`/`v-model` cho 2-way binding chuẩn.
- Với danh sách lớn hiển thị trong bảng (hàng trăm dòng) chỉ cần render, không cần theo dõi thay đổi sâu từng field lồng nhau, cân nhắc `shallowRef`/`shallowReactive` thay vì `ref`/`reactive` mặc định để giảm overhead Proxy tracking.

### 9.5. Các lỗi thường gặp khác
- **`v-for` phải có `:key` duy nhất và ổn định** (id thật từ data) — KHÔNG dùng `index` làm key khi list có thể sort/filter/thêm/xóa (gây bug UI: state/input của dòng bị lẫn sang dòng khác sau khi re-order).
- **Search input gọi API mỗi keystroke**: PHẢI debounce (composable riêng trong `src/composables/`, vd `useDebounce`) trước khi gọi API tìm kiếm, tránh spam request khi user gõ nhanh — đặc biệt các ô tìm kiếm ở màn Master Data.
- **`v-if` vs `v-show`**: dùng `v-show` khi toggle qua lại thường xuyên (giữ DOM, chỉ ẩn/hiện — tránh chi phí mount/unmount lặp lại, vd tab chuyển đổi liên tục); dùng `v-if` khi điều kiện hiếm thay đổi hoặc cần giải phóng hẳn resource của component con khi ẩn (vd đóng dialog nặng).
- **Lazy load route lớn**: mọi `component: () => import(...)` trong router (đã là rule chuẩn ở mục 3.3) — khi thêm view mới cho module lớn (chart, editor...), giữ đúng pattern lazy import, không đổi sang import tĩnh ở đầu file làm phình bundle ban đầu.

## 🚫 Quy tắc Tránh Hardcode Text / i18n (BẮT BUỘC — xem thêm `../AGENTS.md`)

**KHÔNG bao giờ** viết text tiếng Việt/Anh trực tiếp trong `<template>`. Luôn dùng `$t('key')` (template) hoặc `t('key')` (script, qua `useI18n()`).

```vue
<!-- ❌ SAI — text cứng trong template -->
<button>Lưu</button>
<button>Xóa</button>
<span class="error">Tên đăng nhập không được để trống</span>
<input placeholder="Tìm kiếm theo tên dự án" />
<h3>Xác nhận xóa</h3>
<p>Bạn có chắc chắn muốn xóa mục này không?</p>

<!-- ✅ ĐÚNG — qua i18n, key thêm ở CẢ 2 file: src/locales/vi.json và src/locales/en.json -->
<button>{{ $t('common.save') }}</button>
<button>{{ $t('common.delete') }}</button>
<span class="error">{{ $t('validation.usernameRequired') }}</span>
<input :placeholder="$t('project.searchPlaceholder')" />
<h3>{{ $t('common.confirmDeleteTitle') }}</h3>
<p>{{ $t('common.confirmDeleteMessage') }}</p>
```

```typescript
// ❌ SAI — text cứng trong script
errorMsg.value = 'Lỗi kết nối server'
alert('Lưu thành công!')

// ✅ ĐÚNG
errorMsg.value = t('common.errorServer')
alert(t('common.saveSuccess'))
```

**Checklist trước khi hoàn thành task:**
1. Không còn chuỗi text nào literal trong `<template>` (kể cả `placeholder`, `title`, `aria-label`) hay trong `<script setup>` (`errorMsg.value = '...'`, `alert('...')`).
2. Mọi key mới đã thêm vào **cả** `src/locales/vi.json` **và** `src/locales/en.json`.
3. Các cột bảng, tên nút hành động (Thêm/Sửa/Copy/Xóa/Xuất Excel), tiêu đề dialog, message validate — tất cả đều qua `$t()`/`t()`, kể cả ở các màn Master Data mới tạo theo mẫu `TsoProjectManagement.vue`.

## Quy tắc Tránh Hardcode Cấu hình
- **TUYỆT ĐỐI KHÔNG** hardcode các giá trị cấu hình như: đường dẫn thư mục (file paths), URL, API keys, credentials, port, v.v.
- Luôn sử dụng các biến cấu hình môi trường (ví dụ: `.env`, `import.meta.env`) để lưu trữ các giá trị này.
- **Bắt buộc hỏi ý kiến người dùng** trước khi tự định nghĩa hoặc sử dụng một biến môi trường/cấu hình mới để đảm bảo tính đồng nhất với dự án.

## Quy tắc Atomic Save (Multipart File Upload)
- **Lưu dữ liệu trước khi lưu ảnh**: Đối với các tính năng có upload file, LUÔN LUÔN sử dụng giao thức `multipart/form-data` để gửi chung chuỗi JSON data và files trong cùng một Request.
- Tại Backend, phải mở `@Transactional`. Tiến hành lưu dữ liệu Entity vào Database trước, gọi `flush()` để ép Spring đẩy lệnh SQL xuống Database nhằm phát hiện sớm lỗi (vd: trùng lặp, sai format). Chỉ khi Database không có lỗi mới tiến hành lưu file vật lý ra đĩa, sau đó cập nhật lại đường dẫn file vào Entity.
- Điều này đảm bảo khi có lỗi lưu dữ liệu, transaction sẽ rollback và không sinh ra file rác trên ổ cứng.

## Quy chuẩn Layout Master Data (Giao diện Quản trị)
- **Cấu trúc Thư mục**: Mỗi module Master Data phải được đặt trong một thư mục con thuộc `src/views/master_data/` (ví dụ: `master_data/projects`). Trong thư mục này **CHỈ ĐƯỢC PHÉP** chứa đúng 2 file: `Tso[Module]Management.vue` (Màn hình chính) và `Tso[Module]Dialog.vue` (Popup thêm/sửa). Các file phụ trợ phải đặt ở nơi khác (vd: `src/views/admin/`).
- **Chuẩn mẫu (Template)**: Đối với bất kỳ tính năng quản lý Master Data (danh mục) nào được tạo mới, LUÔN LUÔN sao chép và dựa trên kiến trúc layout chuẩn của màn hình quản lý Dự án (`TsoProjectManagement.vue` và `TsoProjectDialog.vue`).
- **Màn hình Danh sách (List)**: Phải bao gồm Dãy button hành động (Thêm, Sửa, Copy, Xóa, Xuất Excel), Ô tìm kiếm, Bảng dữ liệu có Checkbox, và Phân trang (Pagination).
- **Màn hình Dialog**: Thiết kế chuẩn CSS như `.modal-backdrop`, `.modal-dialog`, `.form-grid`, có Header rõ ràng và Footer với các button kích thước chuẩn (`btn-dialog`).
- **`colspan` của dòng "Không có dữ liệu"**: PHẢI đếm đúng và bằng tổng số cột `<th>` trong `<thead>` (tính cả cột checkbox đầu bảng). Mỗi khi thêm/bớt cột trong bảng, phải rà lại và cập nhật `colspan` tương ứng — sai lệch khiến dòng "Không có dữ liệu" không căn giữa hết chiều rộng bảng.
- **Reset trang sau khi xóa (bulk delete)**: Sau khi `handleDelete` xóa xong, nếu số bản ghi vừa xóa bằng đúng số bản ghi đang hiển thị ở trang hiện tại (`selectedIds.length === danhSach.value.length`) VÀ `page > 0`, PHẢI giảm `page` đi 1 trước khi gọi lại API fetch trang — tránh trường hợp xóa hết trang cuối rồi hiển thị "Không có dữ liệu" dù các trang trước vẫn còn bản ghi.
