<template>
  <div>
    <ul class="page">
      <li>
        <span v-if="page > 1"><b @click="page--, goPage(page)">上一页</b></span>
        <span v-if="page == 1">上一页</span>
        <span v-if="Number(pageAll) <= 10">
          <span
            v-for="index in pageAll"
            :key="index"
            :class="{ active: page == index }"
            @click="(page = index), goPage(index)"
            >{{ index }}</span
          ></span
        >
        <span v-if="Number(pageAll) > 10">
          <span @click="(page = 1), goPage(1)">1</span>
          <span v-if="page > 3">...</span>
          <span v-if="page > 2" @click="page--, goPage(page)">{{
            page - 1
          }}</span>
          <span v-if="page > 1 && page < pageAll" @click="goPage(page)">{{
            page
          }}</span>
          <span v-if="page < pageAll - 1" @click="page++, goPage(page)">{{
            page + 1
          }}</span>
          <span v-if="page < pageAll - 2">...</span>
          <span @click="(page = pageAll), goPage(pageAll)">{{ pageAll }}</span>
        </span>
        <span v-if="page != pageAll"
          ><b @click="page++, goPage(page)">下一页</b></span
        >
        <span v-if="page == pageAll">下一页</span>
      </li>
      <li>共{{ pageAll }}页 当前{{ page }}页</li>
      <li>到</li>
      <li><el-input type="text" value="1" v-model="jumpPage" /></li>
      <li>页</li>
      <el-button v-on:click="(page = Number(jumpPage)), goPage(jumpPage)"
        >确定</el-button
      >
    </ul>
  </div>
</template>

<script>
export default {
  name: "Page",
  props: {
    pageAll: Number,
    goPage: new Function(),
  },
  data() {
    return {
      jumpPage: "",
      page: 1,
    };
  },
  methods: {
    changePage(index) {
      this.page = index;
    },
  },
};
</script>


<style scoped>
.page li {
  display: inline-block;
  margin: 0 5px;
}
.page li span {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #dfdfdf;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
