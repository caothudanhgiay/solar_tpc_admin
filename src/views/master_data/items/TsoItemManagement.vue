<template>
  <div class="items-content" ref="mainContainerRef">
    <!-- Card: Toolbar + Table -->
    <div class="card">
      <!-- Card Header: Buttons Row -->
      <div class="action-buttons">
          <button class="btn btn-primary" @click="openForm(null)">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            {{ $t('button.add') || 'Thêm mới' }}
          </button>
          <button class="btn btn-primary" :disabled="!isSingleSelected" @click="handleEdit">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            {{ $t('button.edit') || 'Sửa' }}
          </button>
          <button class="btn btn-info" :disabled="!isSingleSelected" @click="handleCopy">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            {{ $t('button.copy') || 'Copy' }}
          </button>
          <button class="btn btn-danger" :disabled="selectedIds.length === 0" @click="handleDelete">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            {{ $t('button.delete') || 'Xóa' }}
          </button>
      </div>

      <div class="card-search">
        <div class="search-wrap">
          <svg class="search-svg" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            v-model="tempSearchName"
            placeholder="Tìm kiếm danh mục..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>
        
        <button class="btn btn-primary" @click="handleSearch" style="margin-left: 8px; width: max-content;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          {{ $t('button.search') || 'Tìm kiếm' }}
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
                <th style="width: 50px; text-align: center;">STT</th>
                <th>Mã Mục</th>
                <th>Mã Nhóm Mục</th>
                <th>Tên Nhóm Mục</th>
                <th>Mã Mục Con</th>
                <th>Tên Mục Con</th>
                <th>Mô Tả</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in items"
                :key="item.itemId"
                :class="{ 'row-selected': selectedIds.includes(item.itemId) }"
              >
                <td class="td-check">
                  <input type="checkbox" :value="item.itemId" v-model="selectedIds" />
                </td>
                <td style="text-align: center;">{{ index + 1 + page * size }}</td>
                <td>{{ item.itemCode }}</td>
                <td>{{ item.groupItemCode }}</td>
                <td class="fw-bold">{{ item.groupItemName }}</td>
                <td>{{ item.itemSubCode }}</td>
                <td>{{ item.itemSubName }}</td>
                <td><span class="truncate-desc" :title="item.itemDescription">{{ item.itemDescription }}</span></td>
                <td>{{ item.serviceStatusName }}</td>
              </tr>
              <tr v-if="items.length === 0">
                <td colspan="9" class="empty-row">Không có dữ liệu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card Footer: Pagination -->
      <div class="card-footer" v-if="items.length > 0">
        <span class="showing-text">
          Hiển thị trang {{ page + 1 }}
        </span>
        <div class="pagination">
          <button class="page-link" :disabled="page === 0" @click="changePage(page - 1)">‹</button>
          <button class="page-link active">{{ page + 1 }}</button>
          <button class="page-link" :disabled="isLastPage" @click="changePage(page + 1)">›</button>
        </div>
      </div>
    </div>

    <!-- Dialog -->
    <TsoItemDialog
      v-if="showModal"
      :initialData="form"
      :statuses="statuses"
      @close="closeForm"
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { TsoItemApi } from '../../../api/TsoItemApi'
import TsoItemDialog from './TsoItemDialog.vue'
import { useFocusTrap } from '../../../composables/useFocusTrap'

useI18n()

const mainContainerRef = ref<HTMLElement | null>(null)
useFocusTrap(mainContainerRef, { autoFocus: false })

const items = ref<any[]>([])
const statuses = ref<any[]>([])
const showModal = ref(false)
const tempSearchName = ref('')
const searchName = ref('')
const selectedIds = ref<number[]>([])
const form = ref<any>(null)

const page = ref(0)
const size = ref(10)
const isLastPage = ref(true)

const isAllSelected = computed(() => items.value.length > 0 && selectedIds.value.length === items.value.length)
const isSingleSelected = computed(() => selectedIds.value.length === 1)

const toggleAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  selectedIds.value = checked ? items.value.map(p => p.itemId) : []
}

const fetchItems = async () => {
  try {
    const res = await TsoItemApi.getItemsPage(page.value, size.value, searchName.value)
    if (res.data.code === 200 || res.data.statusCode === 200) {
      items.value = res.data.data.page.content
      statuses.value = res.data.data.statuses
      isLastPage.value = res.data.data.page.last
    }
  } catch (e) {
    console.error(e)
  }
}

const handleSearch = () => {
  searchName.value = tempSearchName.value
  page.value = 0
  fetchItems()
}

const openForm = (data: any) => {
  form.value = data ? JSON.parse(JSON.stringify(data)) : null
  showModal.value = true
}

const closeForm = () => {
  showModal.value = false
  form.value = null
}

const onSaved = () => {
  fetchItems()
  closeForm()
}

const handleEdit = () => {
  if (selectedIds.value.length !== 1) return
  const item = items.value.find(p => p.itemId === selectedIds.value[0])
  if (item) openForm(item)
}

const copyItem = (item: any) => {
  const cloned = JSON.parse(JSON.stringify(item))
  delete cloned.itemId
  openForm(cloned)
}

const handleCopy = () => {
  if (selectedIds.value.length !== 1) return
  const item = items.value.find(p => p.itemId === selectedIds.value[0])
  if (item) copyItem(item)
}

const handleDelete = async () => {
  if (selectedIds.value.length === 0) return
  if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.value.length} bản ghi đã chọn?`)) {
    try {
      for (const id of selectedIds.value) {
        await TsoItemApi.deleteItem(id)
      }
      selectedIds.value = []
      fetchItems()
    } catch (e) { alert('Có lỗi khi xóa') }
  }
}

const changePage = (newPage: number) => {
  page.value = newPage
  fetchItems()
}

onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
/* Content Wrapper */
.items-content {
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
  flex: 0 0 auto;
}
.card-search .btn:hover:not(:disabled) { opacity: 0.88; }
.card-search .btn-primary { background: #3f6ad8; color: #fff; }

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

.truncate-desc {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
