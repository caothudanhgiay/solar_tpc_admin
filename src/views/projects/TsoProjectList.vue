<template>
  <div class="project-list">
    <div class="action-bar">
      <button class="btn btn-primary" @click="router.push('/projects/form')">Thêm Dự Án</button>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên Dự Án</th>
          <th>Công Suất</th>
          <th>Trạng Thái</th>
          <th>Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in projects" :key="item.projectId">
          <td>{{ item.projectId }}</td>
          <td>{{ item.projectName }}</td>
          <td>{{ item.solarPower }} kWp</td>
          <td>{{ item.processStatus === 1 ? 'Hoàn Thành' : 'Đang Thi Công' }}</td>
          <td class="actions">
            <button class="btn btn-small" @click="router.push(`/projects/form/${item.projectId}`)">Sửa</button>
            <button class="btn btn-small btn-danger" @click="deleteItem(item.projectId)">Xóa</button>
            <button class="btn btn-small" @click="copyItem(item.projectId)">Copy</button>
          </td>
        </tr>
        <tr v-if="projects.length === 0">
          <td colspan="5" style="text-align: center;">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="page === 0" @click="changePage(page - 1)">Trang Trước</button>
      <span>Trang {{ page + 1 }}</span>
      <button :disabled="projects.length < size" @click="changePage(page + 1)">Trang Sau</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TsoProjectApi } from '../../api/TsoProjectApi'

const router = useRouter()
const projects = ref<any[]>([])
const page = ref(0)
const size = ref(10)

const fetchProjects = async () => {
  try {
    const res = await TsoProjectApi.getProjectsPage(page.value, size.value)
    if (res.data.code === '200') {
      projects.value = res.data.data.content
    }
  } catch (error) {
    console.error('Failed to fetch projects', error)
  }
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
    await TsoProjectApi.deleteProject(id)
    fetchProjects()
  }
}

const copyItem = async (id: number) => {
  try {
    const res = await TsoProjectApi.getProjectById(id)
    if (res.data.code === '200') {
      const data = res.data.data
      data.projectId = null
      data.projectName = data.projectName + ' (Copy)'
      if (data.details) {
        data.details.forEach((d: any) => { d.projectDetailId = null; d.projectId = null })
      }
      await TsoProjectApi.createProject(data)
      fetchProjects()
    }
  } catch (error) {
    console.error('Failed to copy project', error)
  }
}

const changePage = (newPage: number) => {
  page.value = newPage
  fetchProjects()
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.action-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--surface-color);
  border-radius: 8px;
  overflow: hidden;
}
.data-table th, .data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}
.data-table th {
  background: var(--background-color);
  font-weight: 600;
}
.actions {
  display: flex;
  gap: 8px;
}
.btn-danger {
  background: var(--danger, #ff4d4f);
  color: white;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
</style>
