<template>
  <el-menu
    id='header-menu'
    :collapse-transition="false"
    default-active="dependencyGraphInfo"
    mode="horizontal"
    @select="$emit('select', $event)"
  >
    <!-- <el-menu-item index="projectInfo">项目</el-menu-item> -->
    <!-- <el-menu-item index="repositoryInfo">仓库</el-menu-item> -->
    <!-- <el-menu-item index="mavenProjectInfo">Maven 项目</el-menu-item> -->
    <el-menu-item index="dependencyGraphInfo">依赖迁移图</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  emits: [ 'select' ],
}
</script>

<style scoped>
#header-menu {
  width: calc(100% - var(--header-logo-width));
  float: left;
  width: 80%;
  border-bottom: none;
}
</style>
