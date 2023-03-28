<template>
  <el-descriptions :title="title" :column="columnCountInline" border>
    <el-descriptions-item
      v-for="item in columnInfo"
      :key="item"
      :label="item.columnName"
      ><el-link
        v-if="item.isURL"
        type="primary"
        :href="contentData[item.keyword]"
        >{{ contentData[item.keyword] }}</el-link
      >
      <el-link
        v-else-if="item.isRouter"
        type="primary"
        v-on:click="
          $router.push(item.targetURL + contentData[item.paramKeyword])
        "
        >{{ contentData[item.keyword] }}</el-link
      >
      <p v-else-if="item.isDate">
        {{ dateFormat(contentData[item.keyword]) }}
      </p>
      <p v-else>{{ contentData[item.keyword] }}</p>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import { dateFormatter } from "@/scripts/DateFormatter.js";
export default {
  name: "MyDescription",
  props: {
    contentData: Array,
    columnInfo: Array,
    columnCountInline: Number,
    title: String,
  },
  data() {
    return {};
  },
  methods: {
    dateFormat(date) {
      return dateFormatter(date);
    },
  },
};
</script>

<style scoped>
</style>