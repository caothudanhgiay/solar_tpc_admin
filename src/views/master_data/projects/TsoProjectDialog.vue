<template>
  <div class="modal-backdrop">
    <div class="modal-dialog" ref="dialogRef">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">{{ isEdit ? 'Cập nhật Dự án' : 'Thêm mới Dự án' }}</h5>
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
              <label class="form-label">Mã dự án <span class="required">*</span></label>
              <input type="text" v-model="form.projectCode" required class="form-control" placeholder="Ví dụ: DA001" />
            </div>
            <div class="form-group">
              <label class="form-label">Tiêu đề dự án <span class="required">*</span></label>
              <input type="text" v-model="form.projectTitle" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Tên dự án <span class="required">*</span></label>
              <input type="text" v-model="form.projectName" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Địa chỉ <span class="required">*</span></label>
              <input type="text" v-model="form.projectAddress" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Công suất điện (kWp)</label>
              <input type="number" step="0.0001" v-model="form.solarPower" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Tiết kiệm (kHw)</label>
              <input type="number" step="0.0001" v-model="form.savingPower" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Trạng thái</label>
              <TsoSelectOption v-model="form.processStatus" :options="projectStatuses" />
            </div>
            <div class="form-group">
              <label class="form-label">Ngày bắt đầu</label>
              <input type="date" v-model="form.startDate" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Ngày kết thúc</label>
              <input type="date" v-model="form.endDate" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Dự án tiêu biểu?</label>
              <div style="padding: 8px 0;">
                <input type="checkbox" v-model="form.isFeatured" :true-value="1" :false-value="0" />
              </div>
            </div>
            <div class="form-group full-width">
              <label class="form-label">Mô tả</label>
              <div style="background-color: white; border-radius: 4px; margin-bottom: 20px;">
                <QuillEditor v-model:content="form.description" contentType="html" theme="snow" toolbar="full" />
              </div>
            </div>
            <div class="form-group full-width">
              <label class="form-label">Ảnh đại diện (Featured Image)</label>
              <input type="file" @change="uploadMainImage" class="form-control" />
              <img v-if="form.featuredImage" :src="form.featuredImage" style="max-height: 150px; width: auto; max-width: 100%; object-fit: contain; margin-top: 10px; border-radius: 4px; border: 1px solid #ddd;" />
            </div>
          </div>

          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #dee2e6;" />
          
          <div class="details-section">
            <div class="details-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h6 style="margin: 0; font-weight: 600; color: #343a40; text-transform: uppercase; font-size: 14px;">Chi tiết dự án</h6>
              <div class="details-actions" style="display: flex; gap: 8px;">
                <button type="button" class="btn btn-primary btn-action" @click="addDetail">Thêm</button>
                <button type="button" class="btn btn-info btn-action" @click="duplicateSelectedDetails">Nhân bản</button>
                <button type="button" class="btn btn-danger btn-action" @click="removeSelectedDetails">Xóa</button>
              </div>
            </div>
            
            <div style="overflow-x: auto;">
              <table class="table details-table">
                <thead>
                  <tr>
                    <th style="width: 40px; text-align: center;">
                      <input type="checkbox" @change="toggleAllDetails" :checked="isAllDetailsSelected" />
                    </th>
                    <th>Nội dung</th>
                    <th style="width: 150px;">Ngày thi công</th>
                    <th style="width: 250px;">Ảnh chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="form.details.length === 0">
                    <td colspan="4" style="text-align: center; padding: 20px; color: #6c757d;">Chưa có chi tiết nào.</td>
                  </tr>
                  <tr v-for="(detail, index) in form.details" :key="index">
                    <td style="text-align: center; vertical-align: middle;">
                      <input type="checkbox" v-model="selectedDetails" :value="index" />
                    </td>
                    <td>
                      <textarea v-model="detail.content" class="form-control" rows="2"></textarea>
                    </td>
                    <td>
                      <input type="date" v-model="detail.constructionDate" class="form-control" />
                    </td>
                    <td>
                      <input type="file" @change="uploadDetailImage($event, index)" class="form-control" style="font-size: 12px;" />
                      <img v-if="detail.imageUrl" :src="detail.imageUrl" style="max-height: 60px; margin-top: 5px; border-radius: 4px;" />
                    </td>
                  </tr>
                </tbody>
              </table>
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
import { ref, onMounted, computed } from 'vue'
import { TsoProjectApi } from '../../../api/TsoProjectApi'
import { useFocusTrap } from '../../../composables/useFocusTrap'
import TsoSelectOption from '../../components/common/TsoSelectOption.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const dialogRef = ref<HTMLElement | null>(null)
useFocusTrap(dialogRef)

const props = defineProps<{
  initialData: any
  projectStatuses: any[]
}>()

const emit = defineEmits(['close', 'saved'])

const isEdit = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const form = ref({
  projectId: null as number | null,
  projectCode: '',
  projectTitle: '',
  projectName: '',
  description: '',
  projectAddress: '',
  solarPower: 0,
  savingPower: 0,
  processStatus: 1,
  startDate: '',
  endDate: '',
  featuredImage: '',
  isFeatured: 0,
  details: [] as any[]
})

onMounted(() => {
  if (props.initialData) {
    if (props.initialData.projectId) {
      isEdit.value = true
    }
    form.value = { ...props.initialData }
    if (!form.value.details) {
      form.value.details = []
    }
  }
})

const selectedMainFile = ref<File | null>(null)
const selectedDetailFiles = ref<Map<number, File>>(new Map())
const selectedDetails = ref<number[]>([])

const isAllDetailsSelected = computed(() => {
  return form.value.details.length > 0 && selectedDetails.value.length === form.value.details.length
})

const toggleAllDetails = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    selectedDetails.value = form.value.details.map((_, index) => index)
  } else {
    selectedDetails.value = []
  }
}

const addDetail = () => {
  form.value.details.push({
    imageUrl: '',
    content: '',
    constructionDate: ''
  })
}

const duplicateSelectedDetails = () => {
  if (selectedDetails.value.length === 0) return
  const newDetails = selectedDetails.value.map(index => {
    return { ...form.value.details[index] }
  })
  form.value.details.push(...newDetails)
  selectedDetails.value = []
}

const removeSelectedDetails = () => {
  if (selectedDetails.value.length === 0) return
  const sortedIndices = [...selectedDetails.value].sort((a, b) => b - a)
  sortedIndices.forEach(index => {
    form.value.details.splice(index, 1)
  })
  selectedDetails.value = []
}

const uploadMainImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedMainFile.value = target.files[0]
    form.value.featuredImage = URL.createObjectURL(target.files[0])
  }
}

const uploadDetailImage = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedDetailFiles.value.set(index, target.files[0])
    form.value.details[index].imageUrl = URL.createObjectURL(target.files[0])
  }
}

const closeForm = () => {
  emit('close')
}

const submitForm = async () => {
  if (!form.value.projectCode) {
    errorMsg.value = 'Vui lòng nhập Mã dự án'
    return
  }

  loading.value = true
  errorMsg.value = ''
  try {
    // Create FormData for multipart request
    const formData = new FormData()
    
    // Prepare payload
    const payload: any = { ...form.value }
    if (!payload.startDate) payload.startDate = null
    if (!payload.endDate) payload.endDate = null

    // Append the JSON data
    formData.append('project', JSON.stringify(payload))
    
    // Append main file if selected
    if (selectedMainFile.value) {
      formData.append('mainFile', selectedMainFile.value)
    }
    
    // Append detail files
    for (const [index, file] of selectedDetailFiles.value.entries()) {
      formData.append(`detailFile_${index}`, file)
    }

    // 3. Save project data
    if (isEdit.value) {
      await TsoProjectApi.updateProject(form.value.projectId!, formData)
    } else {
      await TsoProjectApi.createProject(formData)
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

/* Fix Quill Editor Overlap */
:deep(.ql-editor) {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  font-family: inherit;
  font-size: 14px;
}
:deep(.ql-container.ql-snow) {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  height: auto !important; /* Force container to expand */
  min-height: 200px;
}
:deep(.ql-toolbar.ql-snow) {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

/* Dialog */
.modal-dialog {
  width: 1000px;
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
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.full-width {
  grid-column: 1 / -1;
}
.form-group {
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
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

/* Details Section */
.details-section {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 16px;
  background-color: #f8f9fa;
  margin-top: 20px;
}
.details-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}
.details-table th, .details-table td {
  border: 1px solid #dee2e6;
  padding: 10px;
  vertical-align: middle;
}
.details-table th {
  background: #f8f9fa;
  font-weight: 600;
  font-size: 13px;
  color: #495057;
  text-align: center;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
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
.btn-sm {
  padding: 4px 10px;
  font-size: 13px;
  min-width: auto;
}
.btn-action {
  height: 30px;
  width: 130px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
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
.btn-info {
  background: #17a2b8;
  color: white;
}
.btn-info:hover {
  background: #138496;
}
.btn-danger {
  background: #dc3545;
  color: white;
}
.btn-danger:hover {
  background: #c82333;
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
.mt-2 {
  margin-top: 16px;
}
</style>
