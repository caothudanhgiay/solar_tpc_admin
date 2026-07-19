<template>
  <div class="modal-backdrop">
    <div class="modal-dialog" ref="dialogRef">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">{{ isEdit ? 'Cập nhật Người dùng' : 'Thêm mới Người dùng' }}</h5>
        <button class="modal-close" @click="closeForm">&times;</button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <div v-if="errorMsg" class="alert-danger">
          {{ errorMsg }}
        </div>

        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label class="form-label">Tên đăng nhập <span class="required">*</span></label>
            <input type="text" v-model="form.username" required class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Email <span class="required">*</span></label>
            <input type="email" v-model="form.email" required class="form-control" />
          </div>
          <div class="form-group" v-if="!isEdit">
            <label class="form-label">Mật khẩu <span class="required">*</span></label>
            <input type="password" v-model="form.password" required class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Quyền hạn (Role) <span class="required">*</span></label>
            <TsoSelectOption v-model="form.roleId" :options="TsoRoleEnumOptions" />
          </div>
          <div class="form-group">
            <label class="form-label">Access ID <span class="required">*</span></label>
            <input type="number" v-model="form.accessId" required class="form-control" />
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-dialog" @click="closeForm">Hủy</button>
            <button type="submit" class="btn btn-primary btn-dialog" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>Lưu thông tin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TsoUserApi } from '../../../api/TsoUserApi'
import TsoSelectOption from '../../components/common/TsoSelectOption.vue'
import { TsoRoleEnumOptions } from '../../../utils/TsoRoleEnum'
import { useFocusTrap } from '../../../composables/useFocusTrap'

const dialogRef = ref<HTMLElement | null>(null)
useFocusTrap(dialogRef)

const props = defineProps<{
  initialData: any
}>()

const emit = defineEmits(['close', 'saved'])

const isEdit = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const form = ref({
  userId: null as number | null,
  username: '',
  password: '',
  email: '',
  roleId: 1,
  accessId: 1
})

onMounted(() => {
  if (props.initialData) {
    if (props.initialData.userId) {
      isEdit.value = true
    }
    form.value = { ...props.initialData }
  }
})

const closeForm = () => {
  emit('close')
}

const submitForm = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    if (isEdit.value) {
      await TsoUserApi.updateUser(form.value.userId!, form.value)
    } else {
      await TsoUserApi.createUser(form.value)
    }
    emit('saved')
  } catch (error: any) {
    console.error('Save failed', error)
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg.value = error.response.data.message
      if (error.response.data.data) {
        errorMsg.value += ' ' + JSON.stringify(error.response.data.data)
      }
    } else {
      errorMsg.value = 'Có lỗi xảy ra khi lưu dữ liệu.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  animation: fadeIn 0.15s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Dialog */
.modal-dialog {
  width: 480px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 60px);
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideDown 0.2s ease;
}
@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #dee2e6;
  background: #f8f9fa;
}
.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #343a40;
  margin: 0;
}
.modal-close {
  background: none;
  border: none;
  font-size: 22px;
  color: #6c757d;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  transition: color 0.15s;
}
.modal-close:hover { color: #d92550; }

/* Body */
.modal-body {
  padding: 20px;
  overflow-y: auto;
}

/* Form */
.form-group {
  margin-bottom: 16px;
}
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 5px;
}
.required { color: #d92550; }
.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
  color: #495057;
  background: #fff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}
.form-control:focus {
  border-color: #3f6ad8;
  box-shadow: 0 0 0 0.2rem rgba(63, 106, 216, 0.25);
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #dee2e6;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
  min-width: 80px;
}
.btn-dialog {
  width: 150px;
}
.btn-secondary {
  background: #fff;
  border: 1px solid #dee2e6;
  color: #495057;
}
.btn-secondary:hover {
  background: #f8f9fa;
}
.btn-primary {
  background: #3f6ad8;
  color: white;
}
.btn-primary:hover {
  background: #3458b3;
}


/* Alert */
.alert-danger {
  padding: 10px 14px;
  background: #fdf0f2;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  color: #d92550;
  font-size: 13px;
  margin-bottom: 16px;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
