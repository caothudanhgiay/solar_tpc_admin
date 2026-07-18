<template>
  <div class="project-form glass-panel">
    <h3>{{ isEdit ? 'Cập nhật Dự Án' : 'Thêm mới Dự Án' }}</h3>

    <form @submit.prevent="submitForm">
      <div class="form-grid">
        <div class="form-group">
          <label>Tiêu đề dự án *</label>
          <input type="text" v-model="form.projectTitle" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Tên dự án *</label>
          <input type="text" v-model="form.projectName" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Địa chỉ *</label>
          <input type="text" v-model="form.projectAddress" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Công suất điện (kWp)</label>
          <input type="number" step="0.0001" v-model="form.solarPower" class="form-control" />
        </div>
        <div class="form-group">
          <label>Tiết kiệm (VNĐ/Năm)</label>
          <input type="number" step="0.0001" v-model="form.savingPower" class="form-control" />
        </div>
        <div class="form-group">
          <label>Trạng thái</label>
          <select v-model="form.processStatus" class="form-control">
            <option :value="1">Hoàn thành</option>
            <option :value="0">Đang thi công</option>
          </select>
        </div>
        <div class="form-group">
          <label>Ngày bắt đầu</label>
          <input type="date" v-model="form.startDate" class="form-control" />
        </div>
        <div class="form-group">
          <label>Ngày kết thúc</label>
          <input type="date" v-model="form.endDate" class="form-control" />
        </div>
        <div class="form-group">
          <label>Dự án tiêu biểu?</label>
          <input type="checkbox" v-model="form.isFeatured" :true-value="1" :false-value="0" />
        </div>
        <div class="form-group full-width">
          <label>Mô tả</label>
          <textarea v-model="form.description" class="form-control" rows="3"></textarea>
        </div>
        <div class="form-group full-width">
          <label>Ảnh đại diện (Featured Image)</label>
          <input type="file" @change="uploadMainImage" class="form-control" />
          <img v-if="form.featuredImage" :src="form.featuredImage" style="max-height: 100px; margin-top: 10px;" />
        </div>
      </div>

      <hr />
      
      <div class="details-section">
        <h4>Chi tiết dự án (Tiến độ)</h4>
        <div v-for="(detail, index) in form.details" :key="index" class="detail-item glass-panel">
          <div class="detail-grid">
            <div class="form-group">
              <label>Nội dung</label>
              <textarea v-model="detail.content" class="form-control" rows="2"></textarea>
            </div>
            <div class="form-group">
              <label>Ngày thi công</label>
              <input type="date" v-model="detail.constructionDate" class="form-control" />
            </div>
            <div class="form-group">
              <label>Ảnh chi tiết</label>
              <input type="file" @change="uploadDetailImage($event, index)" class="form-control" />
              <img v-if="detail.imageUrl" :src="detail.imageUrl" style="max-height: 80px; margin-top: 10px;" />
            </div>
            <div class="form-group action-col">
              <button type="button" class="btn btn-small btn-danger" @click="removeDetail(index)">Xóa ảnh này</button>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-secondary mt-2" @click="addDetail">Thêm hình ảnh chi tiết</button>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="router.push('/projects')">Hủy</button>
        <button type="submit" class="btn btn-primary" :disabled="loading">Lưu thông tin</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { TsoProjectApi } from '../../api/TsoProjectApi'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const isEdit = ref(false)

const form = ref({
  projectId: null as number | null,
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

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    try {
      const res = await TsoProjectApi.getProjectById(Number(id))
      if (res.data.code === '200') {
        form.value = res.data.data
        // Format dates if they exist so input type="date" can read them
      }
    } catch (e) {
      console.error(e)
    }
  }
})

const addDetail = () => {
  form.value.details.push({
    imageUrl: '',
    content: '',
    constructionDate: ''
  })
}

const removeDetail = (index: number) => {
  form.value.details.splice(index, 1)
}

const uploadMainImage = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    try {
      const res = await TsoProjectApi.uploadImage(target.files[0])
      if (res.data.code === '200') {
        form.value.featuredImage = res.data.data
      }
    } catch (e) {
      console.error('Failed to upload main image', e)
    }
  }
}

const uploadDetailImage = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    try {
      const res = await TsoProjectApi.uploadImage(target.files[0])
      if (res.data.code === '200') {
        form.value.details[index].imageUrl = res.data.data
      }
    } catch (e) {
      console.error('Failed to upload detail image', e)
    }
  }
}

const submitForm = async () => {
  loading.value = true
  try {
    if (isEdit.value) {
      await TsoProjectApi.updateProject(form.value.projectId!, form.value)
    } else {
      await TsoProjectApi.createProject(form.value)
    }
    router.push('/projects')
  } catch (error) {
    console.error('Save failed', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.project-form {
  padding: 24px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.full-width {
  grid-column: 1 / -1;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-control {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--background-color);
  color: var(--text-color);
}
.details-section {
  margin: 30px 0;
}
.detail-item {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}
.detail-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr auto;
  gap: 16px;
  align-items: end;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}
.mt-2 {
  margin-top: 16px;
}
</style>
