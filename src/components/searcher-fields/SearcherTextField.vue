<template>
  <el-form-item :label="label">
    <el-input
      type="text"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"/>
  </el-form-item>
</template>

<script>
export default {
  name: 'SearcherTextField',
  emits: ['update:modelValue'],
  props: {
    label: String,
    modelValue: String
  },
}
</script>

<style scoped>

</style>
