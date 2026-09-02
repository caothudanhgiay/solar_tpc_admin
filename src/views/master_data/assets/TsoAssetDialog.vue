<template>
  <div class="modal-backdrop">
    <div class="modal-dialog" ref="dialogRef">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">{{ isEdit ? 'Cập nhật Tài sản' : 'Thêm mới Tài sản' }}</h5>
        <button class="modal-close" @click="closeForm">&times;</button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <div v-if="errorMsg" class="alert-danger">
          {{ errorMsg }}
        </div>

        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Tên tài sản <span class="required">*</span></label>
              <input type="text" v-model="form.assetName" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Nhóm tài sản <span class="required">*</span></label>
              <input type="text" v-model="form.assetGroup" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Loại tài sản <span class="required">*</span></label>
              <input type="text" v-model="form.assetType" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Người cấp <span class="required">*</span></label>
              <input type="text" v-model="form.provider" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Người dùng hiện tại <span class="required">*</span></label>
              <input type="text" v-model="form.currentUsr" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Giá</label>
              <input type="number" step="0.0001" v-model="form.price" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Ngày sử dụng <span class="required">*</span></label>
              <input type="datetime-local" v-model="form.startDate" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Ngày hết hạn <span class="required">*</span></label>
              <input type="datetime-local" v-model="form.endDate" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Ngày mua <span class="required">*</span></label>
              <input type="datetime-local" v-model="form.dateOfPurchase" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Thời gian bảo hành (tháng)</label>
              <input type="number" v-model="form.warrantyPeriod" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Trạng thái</label>
              <TsoSelectOption v-model="form.assetStatus" :options="assetStatuses" />
            </div>
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
import { TsoAssetManagementApi } from '../../../api/TsoAssetManagementApi'
import { useFocusTrap } from '../../../composables/useFocusTrap'
import TsoSelectOption from '../../components/common/TsoSelectOption.vue'

const dialogRef = ref<HTMLElement | null>(null)
useFocusTrap(dialogRef)

const props = defineProps<{
  initialData: any
  assetStatuses: any[]
}>()

const emit = defineEmits(['close', 'saved'])

const isEdit = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const form = ref({
  assetId: null as number | null,
  assetName: '',
  assetGroup: '',
  assetType: '',
  provider: '',
  currentUsr: '',
  price: 0,
  startDate: '',
  endDate: '',
  dateOfPurchase: '',
  warrantyPeriod: null as number | null,
  assetStatus: 1
})

onMounted(() => {
  if (props.initialData) {
    isEdit.value = !!props.initialData.assetId
    form.value = {
      ...props.initialData,
      startDate: props.initialData.startDate ? props.initialData.startDate.substring(0, 16) : '',
      endDate: props.initialData.endDate ? props.initialData.endDate.substring(0, 16) : '',
      dateOfPurchase: props.initialData.dateOfPurchase ? props.initialData.dateOfPurchase.substring(0, 16) : ''
    }
  }
})

const closeForm = () => {
  emit('close')
}

const submitForm = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    const payload = { ...form.value }
    if (isEdit.value) {
      await TsoAssetManagementApi.updateAsset(form.value.assetId!, payload)
    } else {
      await TsoAssetManagementApi.createAsset(payload)
    }
    emit('saved')
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message || 'Có lỗi xảy ra'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '../../../style.css';

.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-dialog {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #a0aec0;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}
.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 6px;
}

.required {
  color: #e53e3e;
}

.form-control {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.alert-danger {
  padding: 12px;
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #feb2b2;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>
