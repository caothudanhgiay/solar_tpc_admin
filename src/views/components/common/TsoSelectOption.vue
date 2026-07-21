<template>
  <select 
    :value="modelValue" 
    @change="handleChange" 
    class="form-control tso-select"
  >
    <option value="" disabled v-if="placeholder">{{ placeholder }}</option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.labelKey }}
    </option>
  </select>
</template>

<script setup lang="ts">

const props = defineProps<{
  modelValue: string | number | null
  options: Array<{ value: string | number, labelKey: string }>
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const val = target.value;
  // Try to parse as number if the options use numbers
  const isNumeric = props.options.length > 0 && typeof props.options[0].value === 'number';
  emit('update:modelValue', isNumeric ? Number(val) : val);
}
</script>

<style scoped>
.tso-select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 6px;
  background: var(--background-color, #fff);
  color: var(--text-color, #333);
}
</style>
