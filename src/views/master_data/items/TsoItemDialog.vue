<template>
  <!-- Backdrop -->
  <div class="modal-backdrop">
    <!-- Dialog -->
    <div class="modal-dialog" @click.stop>
      
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">{{ isEdit ? 'Cập nhật danh mục' : 'Thêm mới danh mục' }}</h5>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <!-- Body -->
      <div class="modal-body">
        <form @submit.prevent="handleSubmit" id="itemForm">
          <div class="form-grid">
            
            <div class="form-group">
              <label class="form-label">Mã mục <span class="text-danger">*</span></label>
              <input type="text" v-model="form.itemCode" class="form-control" required />
            </div>
            
            <div class="form-group">
              <label class="form-label">Mã nhóm mục <span class="text-danger">*</span></label>
              <input type="text" v-model="form.groupItemCode" class="form-control" required />
            </div>
            
            <div class="form-group col-span-2">
              <label class="form-label">Tên nhóm mục <span class="text-danger">*</span></label>
              <input type="text" v-model="form.groupItemName" class="form-control" required />
            </div>
            
            <div class="form-group">
              <label class="form-label">Mã mục con <span class="text-danger">*</span></label>
              <input type="text" v-model="form.itemSubCode" class="form-control" required />
            </div>

            <div class="form-group">
              <label class="form-label">Tên mục con <span class="text-danger">*</span></label>
              <input type="text" v-model="form.itemSubName" class="form-control" required />
            </div>
            
            <div class="form-group col-span-2">
              <label class="form-label">Mô tả chức năng</label>
              <textarea v-model="form.itemDescription" class="form-control" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
              <select v-model="form.serviceStatus" class="form-control" required>
                <option value="" disabled>-- Chọn trạng thái --</option>
                <option v-for="st in statuses" :key="st.id" :value="st.id">
                  {{ st.name }}
                </option>
              </select>
            </div>
            
          </div>
        </form>
      </div>
      
      <!-- Footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-dialog" @click="closeModal" :disabled="isSubmitting">
          {{ $t('button.cancel') || 'Hủy bỏ' }}
        </button>
        <button type="submit" form="itemForm" class="btn btn-primary btn-dialog" :disabled="isSubmitting">
          <svg v-if="isSubmitting" class="spinner" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          {{ $t('button.save') || 'Lưu' }}
        </button>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TsoItemApi } from '../../../api/TsoItemApi'

const props = defineProps<{
  initialData?: any
  statuses: any[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const isEdit = computed(() => !!props.initialData?.itemId)
const isSubmitting = ref(false)

const form = ref<any>({
  itemId: null,
  itemCode: '',
  groupItemCode: '',
  groupItemName: '',
  itemSubCode: '',
  itemSubName: '',
  itemDescription: '',
  serviceStatus: 1
})

if (props.initialData) {
  form.value = { ...props.initialData }
}

const closeModal = () => emit('close')

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const dataToSend = { ...form.value }
    if (isEdit.value) {
      await TsoItemApi.updateItem(dataToSend.itemId, dataToSend)
    } else {
      await TsoItemApi.createItem(dataToSend)
    }
    emit('saved')
  } catch (error) {
    console.error(error)
    alert('Có lỗi xảy ra khi lưu dữ liệu!')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

/* Dialog Container */
.modal-dialog {
  background: #fff;
  border-radius: 4px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header */
.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 4px 4px 0 0;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #3f6ad8;
  letter-spacing: 0.2px;
}

.btn-close {
  background: transparent;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}

.btn-close:hover {
  color: #495057;
}

/* Body */
.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.col-span-2 {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #495057;
}

.text-danger {
  color: #d92550;
}

.form-control {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 13px;
  color: #495057;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
}

.form-control:focus {
  border-color: #3f6ad8;
  box-shadow: 0 0 0 0.2rem rgba(63, 106, 216, 0.25);
}

.form-control:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

/* Footer */
.modal-footer {
  padding: 12px 20px;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background: #f8f9fa;
  border-radius: 0 0 4px 4px;
}

/* Buttons */
.btn-dialog {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13.5px;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
  min-width: 90px;
}

.btn-dialog:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-secondary {
  background: #fff;
  border-color: #ced4da;
  color: #495057;
}

.btn-secondary:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #b1bcc4;
}

.btn-primary {
  background: #3f6ad8;
  border-color: #3f6ad8;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #3158c5;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}
</style>
