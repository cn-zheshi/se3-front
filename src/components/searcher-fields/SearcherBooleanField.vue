<template>
  <el-form-item :label="label">
    <el-checkbox-group
      @update:modelValue="$emit('update:modelValue', $event === [] ? undefined : $event[$event.length - 1])"
      :model-value="this.modelValue === undefined ? [] : [this.modelValue]">
      <el-checkbox-button :label="true">是</el-checkbox-button>
      <el-checkbox-button :label="false">否</el-checkbox-button>
    </el-checkbox-group>
  </el-form-item>
  <!-- <el-checkbox
    :label="label"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"/> -->
</template>

<script>
export default {
  name: "SearcherCheckBox",
  emits: ["update:modelValue"],
  props: {
    label: String,
    modelValue: Boolean,
  },
};
</script>

<style scoped>
</style>
