<template>
  <el-upload id="searcher-pom-uploader"
    accept=".xml"
    :auto-upload="false"
    :on-change="doUploadPom">
    <el-button>上传 pom 文件</el-button>
  </el-upload>
</template>

<script>
export default {
  name: 'SearcherPomField',
  emits: ['update:modelValue'],
  props: {
    label: String,
    modelValue: String
  },
  methods: {
    doUploadPom(file) {
      const fileUrl = URL.createObjectURL(file.raw)
      console.log('doUploadPom', file, fileUrl)
      this.$router.push({
        name: 'DependencyGraph',
        params: {
          pomUrl: fileUrl
        }
      })
    },
  },
}
</script>

<style scoped>
#searcher-pom-uploader {
  width: 30%;
  margin: 1em auto;
}
</style>
