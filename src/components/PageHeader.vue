<template>
<el-header>
  <div id='header-logo' @click="$router.push('/')">
    <img id='header-icon' src='/icon.svg' />
    <span>ClockCourier</span>
  </div>
  <slot />
</el-header>
</template>

<script>
export default {
  name: "PageHeader",
};
</script>


<style scoped>
.el-header {
  --header-logo-width: 200px;
  border-bottom: solid 1px var(--el-border-color-base);
  margin: 0;
}

#header-logo {
  height: var(--el-header-height);
  width: var(--header-logo-width);
  float: left;
  cursor: pointer;
}

#header-icon {
  height: 100%;
}

#header-logo * {
  vertical-align: middle;
}
</style>
