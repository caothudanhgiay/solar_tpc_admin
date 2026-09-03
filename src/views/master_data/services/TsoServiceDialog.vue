<template>
  <div class="modal-backdrop">
    <div class="modal-dialog" ref="dialogRef">
      <div class="modal-header">
        <h5 class="modal-title">{{ isEdit ? $t('service.edit_title') : $t('service.add_title') }}</h5>
        <button class="modal-close" @click="closeForm">&times;</button>
      </div>

      <div class="modal-body">
        <div v-if="errorMsg" class="alert-danger">
          {{ errorMsg }}
        </div>

        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">{{ $t('service.code') }} <span class="required">*</span></label>
              <input type="text" v-model="form.serviceCode" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ $t('service.name') }} <span class="required">*</span></label>
              <input type="text" v-model="form.serviceName" required class="form-control" />
            </div>
            <div class="form-group full-width">
              <label class="form-label">{{ $t('service.image') }}</label>
              <input type="file" @change="onFileChange" accept="image/*" class="form-control" />
              <img v-if="form.serviceImage" :src="form.serviceImage" style="max-height: 150px; width: auto; max-width: 100%; object-fit: contain; margin-top: 10px; border-radius: 4px; border: 1px solid #ddd;" />
            </div>
            <div class="form-group full-width">
              <label class="form-label">{{ $t('service.description') }}</label>
              <textarea v-model="form.serviceDescription" rows="3" class="form-control"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">{{ $t('service.group') }} <span class="required">*</span></label>
              <input type="text" v-model="form.serviceGroup" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ $t('service.type') }} <span class="required">*</span></label>
              <input type="text" v-model="form.serviceType" required class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ $t('service.status') }}</label>
              <TsoSelectOption v-model="form.serviceStatus" :options="serviceStatuses" />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-dialog" @click="closeForm">{{ $t('button.cancel') }}</button>
            <button type="submit" class="btn btn-primary btn-dialog" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>{{ $t('button.save') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TsoServiceManagementApi } from '../../../api/TsoServiceManagementApi'
import { useFocusTrap } from '../../../composables/useFocusTrap'
import TsoSelectOption from '../../components/common/TsoSelectOption.vue'

const dialogRef = ref<HTMLElement | null>(null)
useFocusTrap(dialogRef)

const props = defineProps<{
  initialData: any
  serviceStatuses: any[]
}>()

const emit = defineEmits(['close', 'saved'])

const isEdit = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const selectedFile = ref<File | null>(null)

const form = ref({
  serviceId: null as number | null,
  serviceCode: '',
  serviceImage: '',
  serviceName: '',
  serviceGroup: '',
  serviceType: '',
  serviceStatus: 1,
  serviceDescription: ''
})

onMounted(() => {
  if (props.initialData) {
    isEdit.value = !!props.initialData.serviceId
    form.value = {
      ...props.initialData
    }
    selectedFile.value = null
  }
})

const closeForm = () => {
  selectedFile.value = null
  emit('close')
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    form.value.serviceImage = URL.createObjectURL(target.files[0])
  } else {
    selectedFile.value = null
  }
}

const submitForm = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    const payload = { ...form.value }
    if (isEdit.value) {
      await TsoServiceManagementApi.updateService(form.value.serviceId!, payload, selectedFile.value || undefined)
    } else {
      await TsoServiceManagementApi.createService(payload, selectedFile.value || undefined)
    }
    emit('saved')
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message || 'Error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '../../../style.css';
.modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1050; }
.modal-dialog { background: white; border-radius: 8px; width: 90%; max-width: 800px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.modal-header { padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.modal-title { margin: 0; font-size: 18px; font-weight: 600; color: #2d3748; }
.modal-close { background: transparent; border: none; font-size: 24px; color: #a0aec0; cursor: pointer; }
.modal-body { padding: 20px; overflow-y: auto; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; }
.form-group.full-width { grid-column: 1 / -1; }
.form-label { font-size: 14px; font-weight: 500; color: #4a5568; margin-bottom: 6px; }
.required { color: #e53e3e; }
.form-control { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 14px; }
.modal-footer { padding: 16px 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 12px; }
.alert-danger { padding: 12px; background-color: #fff5f5; color: #c53030; border: 1px solid #feb2b2; border-radius: 4px; margin-bottom: 16px; }
</style>
