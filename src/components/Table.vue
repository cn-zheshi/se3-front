<template>
  <el-table
    :data="contentData"
    v-on:sort-change="changeSort"
    border
    :max-height="maxHeight"
    :row-style="rowStyle"
    :cell-style="cellStyle"
  >
    <el-table-column
      v-for="item in unexpandInfo"
      :key="item"
      :sortable="item.sortable"
      :label="item.columnName"
      :prop="item.keyword"
    >
      <template #default="scope">
        <el-link
          v-if="item.isRouter"
          type="primary"
          v-on:click="
            $router.push(item.targetURL + scope.row[item.paramKeyword])
          "
        >
          {{ scope.row[item.keyword] }}
        </el-link>

        <el-link
          v-else-if="item.isURL"
          type="primary"
          :href="scope.row[item.keyword]"
        >
          {{ scope.row[item.keyword] }}
        </el-link>
        <p v-else-if="item.isDate">
          {{ dateFormat(scope.row[item.keyword]) }}
        </p>
        <p v-else>{{ scope.row[item.keyword] }}</p>
      </template>
    </el-table-column>
    <el-table-column v-if="expandIndex != -1" type="expand">
      <template #default="scope">
        <my-description
          :columnInfo="expandInfo"
          :contentData="scope.row"
          :columnCountInline="expandColumnCountInline"
        ></my-description>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { dateFormatter } from "@/scripts/DateFormatter.js";
import MyDescription from "./Description.vue";
export default {
  name: "MyTable",
  components: { MyDescription },
  props: {
    contentData: Array,
    columnInfo: Array,
    changeSort: Function,
    maxHeight: Number,
    rowStyle: Function,
    cellStyle: Function,
    expandIndex: {
      type: Number,
      default: -1,
    },
    expandColumnCountInline: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {};
  },
  methods: {
    dateFormat(date) {
      return dateFormatter(date);
    },
  },
  computed: {
    unexpandInfo() {
      if (this.expandIndex == -1) {
        return this.columnInfo;
      } else {
        var unexpandColumnInfo = [];
        for (let index = 0; index < this.expandIndex; index++) {
          unexpandColumnInfo.push(this.columnInfo[index]);
        }
        return unexpandColumnInfo;
      }
    },
    expandInfo() {
      var expandColumnInfo = [];

      if (this.expandIndex != -1) {
        for (
          let index = this.expandIndex;
          index < this.columnInfo.length;
          index++
        ) {
          const element = this.columnInfo[index];
          expandColumnInfo.push(element);
        }
      }
      return expandColumnInfo;
    },
  },
};
</script>