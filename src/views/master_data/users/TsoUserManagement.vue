<template>
  <div class="users-content" ref="mainContainerRef">
    <!-- Card: Toolbar + Table -->
    <div class="card">
      <!-- Card Header: Buttons Row -->
      <div class="action-buttons">
          <button class="btn btn-primary" @click="openForm(null)">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            {{ $t('button.add') }}
          </button>
          <button class="btn btn-primary" :disabled="!isSingleSelected" @click="handleEdit">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            {{ $t('button.edit') }}
          </button>
          <button class="btn btn-info" :disabled="!isSingleSelected" @click="handleCopy">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            {{ $t('button.copy') }}
          </button>
          <button class="btn btn-danger" :disabled="selectedIds.length === 0" @click="handleDelete">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            {{ $t('button.delete') }}
          </button>
          <button class="btn btn-success" @click="exportExcel">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            {{ $t('button.exportExcel') }}
          </button>
      </div>

      <div class="card-search">
        <div class="search-wrap">
          <svg class="search-svg" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            v-model="tempSearchUsername"
            :placeholder="$t('button.searchUsernamePlaceholder')"
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="search-wrap">
          <svg class="search-svg" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            v-model="tempSearchEmail"
            :placeholder="$t('button.searchEmailPlaceholder')"
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>
        
        <button class="btn btn-primary" @click="handleSearch" style="margin-left: 8px; width: max-content;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          {{ $t('button.search') }}
        </button>
      </div>

      <!-- Card Body: Table -->
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="th-check">
                  <input type="checkbox" :checked="isAllSelected" @change="toggleAll" />
                </th>
                <th>ID</th>
                <th>Tài khoản</th>
                <th>Email</th>
                <th>Quyền hạn</th>
                <th>Access ID</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in paginatedUsers"
                :key="user.userId"
                :class="{ 'row-selected': selectedIds.includes(user.userId) }"
              >
                <td class="td-check">
                  <input type="checkbox" :value="user.userId" v-model="selectedIds" />
                </td>
                <td class="text-muted">#{{ user.userId }}</td>
                <td class="fw-bold">{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge badge-primary">{{ getRoleName(user.roleId) }}</span>
                </td>
                <td class="text-muted">{{ user.accessId }}</td>
              </tr>
              <tr v-if="paginatedUsers.length === 0">
                <td colspan="6" class="empty-row">Không có dữ liệu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card Footer: Pagination -->
      <div class="card-footer" v-if="filteredUsers.length > 0">
        <span class="showing-text">
          Hiển thị {{ startIndex + 1 }}–{{ Math.min(endIndex, filteredUsers.length) }} / {{ filteredUsers.length }}
        </span>
        <div class="pagination">
          <button class="page-link" :disabled="currentPage === 1" @click="currentPage--">‹</button>
          <button
            v-for="p in totalPages"
            :key="p"
            class="page-link"
            :class="{ active: p === currentPage }"
            @click="currentPage = p"
          >{{ p }}</button>
          <button class="page-link" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
        </div>
      </div>
    </div>

    <!-- Dialog -->
    <TsoUserDialog 
      v-if="showModal" 
      :initialData="form" 
      @close="closeForm" 
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { TsoUserApi } from '../../../api/TsoUserApi'
import { TsoRoleEnumOptions } from '../../../utils/TsoRoleEnum'
import TsoUserDialog from './TsoUserDialog.vue'
import TsoChangePasswordDialog from '../../admin/TsoChangePasswordDialog.vue'
import { useFocusTrap } from '../../../composables/useFocusTrap'

const { t } = useI18n()
const mainContainerRef = ref<HTMLElement | null>(null)
useFocusTrap(mainContainerRef, { autoFocus: false })

const users = ref<any[]>([])
const showModal = ref(false)
const tempSearchUsername = ref('')
const tempSearchEmail = ref('')
const searchUsername = ref('')
const searchEmail = ref('')
const selectedIds = ref<number[]>([])

const currentPage = ref(1)
const pageSize = ref(10)

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchUser = !searchUsername.value || (u.username || '').toLowerCase().includes(searchUsername.value.toLowerCase())
    const matchEmail = !searchEmail.value || (u.email || '').toLowerCase().includes(searchEmail.value.toLowerCase())
    return matchUser && matchEmail
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize.value) || 1)
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => startIndex.value + pageSize.value)
const paginatedUsers = computed(() => filteredUsers.value.slice(startIndex.value, endIndex.value))
const isAllSelected = computed(() => paginatedUsers.value.length > 0 && selectedIds.value.length === paginatedUsers.value.length)
const isSingleSelected = computed(() => selectedIds.value.length === 1)

const getRoleName = (roleId: number) => {
  const role = TsoRoleEnumOptions.find(r => r.value === roleId)
  return role ? t(role.labelKey) : roleId
}

const toggleAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  selectedIds.value = checked ? paginatedUsers.value.map(u => u.userId) : []
}

const handleSearch = () => {
  searchUsername.value = tempSearchUsername.value
  searchEmail.value = tempSearchEmail.value
  currentPage.value = 1
}

const handleEdit = () => {
  if (selectedIds.value.length !== 1) return
  const user = users.value.find(u => u.userId === selectedIds.value[0])
  if (user) openForm(user)
}

const handleCopy = () => {
  if (selectedIds.value.length !== 1) return
  const user = users.value.find(u => u.userId === selectedIds.value[0])
  if (user) copyUser(user)
}

const handleDelete = async () => {
  if (selectedIds.value.length === 0) return
  if (confirm(t('message.confirmDelete', { count: selectedIds.value.length }))) {
    try {
      for (const id of selectedIds.value) await TsoUserApi.deleteUser(id)
      selectedIds.value = []
      fetchUsers()
    } catch (e) { alert(t('message.deleteError')) }
  }
}

const form = ref({ userId: null as number | null, username: '', password: '', email: '', roleId: 1, accessId: 1 })

const fetchUsers = async () => {
  try {
    const res = await TsoUserApi.getAllUsers()
    if (res && res.statusCode === 200) { 
      users.value = res.data || []; 
      selectedIds.value = [] 
    }
  } catch (error) { console.error('Failed to fetch users', error) }
}

const openForm = (user: any) => {
  form.value = user
    ? { userId: user.userId, username: user.username, password: '', email: user.email, roleId: user.roleId, accessId: user.accessId }
    : { userId: null, username: '', password: '', email: '', roleId: 1, accessId: 1 }
  showModal.value = true
}

const closeForm = () => { showModal.value = false }
const onSaved = () => { closeForm(); fetchUsers() }

const copyUser = (user: any) => {
  form.value = { userId: null, username: user.username, password: '', email: user.email, roleId: user.roleId, accessId: user.accessId }
  showModal.value = true
}

const exportExcel = () => {
  if (filteredUsers.value.length === 0) return
  
  const headers = ['ID', 'Tài khoản', 'Email', 'Quyền hạn', 'Access ID']
  const bom = "\uFEFF";
  
  const rows = filteredUsers.value.map(u => {
    return [
      u.userId,
      `"${(u.username || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      `"${getRoleName(u.roleId)}"`,
      u.accessId
    ].join(",")
  });

  const csvContent = bom + headers.join(",") + "\n" + rows.join("\n");
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", "danh_sach_nguoi_dung.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

onMounted(fetchUsers)
</script>

<style scoped>
/* Users Content Wrapper */
.users-content {
  /* padding handled by Layout */
}

/* Card */
.card {
  background: #ffffff;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0.46875rem 2.1875rem rgba(4,9,20,0.03), 0 0.9375rem 1.40625rem rgba(4,9,20,0.03), 0 0.25rem 0.53125rem rgba(4,9,20,0.05), 0 0.125rem 0.1875rem rgba(4,9,20,0.03);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  border-radius: 4px 4px 0 0;
}

.action-buttons .btn {
  width: auto;
  height: 30px;
  padding: 0 12px;
  font-size: 13px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

/* Search */
.card-search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid #dee2e6;
}
/* Nút bên trong card-search (Search button) */
.card-search .btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
  white-space: nowrap;
  flex: 0 0 auto;
  width: max-content;
  max-width: fit-content;
}
.card-search .btn:hover:not(:disabled) { opacity: 0.88; }
.card-search .btn:disabled { opacity: 0.45; cursor: not-allowed; }

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-svg {
  position: absolute;
  left: 10px;
  color: #adb5bd;
  pointer-events: none;
}
.search-input {
  padding: 7px 12px 7px 32px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 13px;
  width: 220px;
  color: #495057;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input:focus {
  border-color: #3f6ad8;
  box-shadow: 0 0 0 0.2rem rgba(63, 106, 216, 0.25);
}

/* Card Body */
.card-body { padding: 0; }
.table-responsive { overflow-x: auto; }

/* Table */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}
.table thead tr {
  background: #f8f9fa;
}
.table th {
  padding: 10px 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 12.5px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}
.th-check, .td-check { width: 44px; text-align: center !important; }
.table td {
  padding: 11px 16px;
  border-bottom: 1px solid #f1f3f5;
  color: #495057;
  vertical-align: middle;
}
.table tbody tr { transition: background 0.1s; }
.table tbody tr:hover { background: #f8f9fa; }
.row-selected { background: #e8f0fe !important; }
.text-muted { color: #adb5bd !important; }
.fw-bold { font-weight: 600; }

/* Badge */
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 500;
}
.badge-primary {
  background: rgba(63, 106, 216, 0.12);
  color: #3f6ad8;
}

/* Empty */
.empty-row {
  text-align: center;
  padding: 48px 20px !important;
  color: #adb5bd;
}

/* Card Footer / Pagination */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid #dee2e6;
  background: #f8f9fa;
  border-radius: 0 0 4px 4px;
}
.showing-text { font-size: 13px; color: #6c757d; }
.pagination { display: flex; gap: 2px; }
.page-link {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #fff;
  color: #3f6ad8;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.page-link:hover:not(:disabled):not(.active) {
  background: #e9ecef;
}
.page-link.active {
  background: #3f6ad8;
  color: #fff;
  border-color: #3f6ad8;
}
.page-link:disabled { opacity: 0.4; cursor: not-allowed; }

/* Checkbox */
input[type="checkbox"] {
  accent-color: #3f6ad8;
  width: 15px;
  height: 15px;
  cursor: pointer;
}
</style>
