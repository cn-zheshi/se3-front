<template>
  <page-header>
    <searcher category="mavenProjectInfo" @search="doSearch" />
  </page-header>
  <my-table
    :columnInfo="columnInfo"
    :contentData="mavenProjects"
    :changeSort="changeSort"
  ></my-table>
  <page :pageAll="pageAll" :goPage="goPage"></page>
</template>

<script>
import Searcher from "../components/Searcher.vue";
import { searchParams } from "@/scripts/DataSchema.js";
import { columnInfos } from "@/scripts/Constant.js";
import PageHeader from "@/components/PageHeader.vue";
import Page from "../components/Page.vue";
import MyTable from "../components/Table.vue";
import search from "../api/Search.js";

const sortKeys = {
  groupId: "GroupId",
  artifactId: "ArtifactId",
};

export default {
  name: "MavenProjects",
  components: { Searcher, PageHeader, Page, MyTable },
  props: searchParams.mavenProjectInfo,
  data() {
    return {
      mavenProjects: [],
      columnInfo: columnInfos.mavenProjectsColumnInfo,
      pageAll: 1,
      sortKey: "GroupId",
      sortReverse: false,
      pageSize: 15,
    };
  },
  watch: {
    "$route.params": function (value) {
      if (this.$route.path == "/maven-projects") {
        this.searchMavenProject(value, 1);
      }
    },
  },
  methods: {
    changeSort(ev) {
      if (ev.prop === null) {
        this.sortKey = "GroupId";
        this.sortReverse = false;
      } else {
        this.sortKey = sortKeys[ev.prop];
        this.sortReverse = ev.order === "descending";
      }
      this.searchMavenProject(this.$props, 1);
    },
    goPage(index) {
      if (Number(index) > 0 && Number(index) <= this.pageAll) {
        this.searchMavenProject(this.$props, Number(index));
      }
    },
    searchMavenProject(params, page) {
      search(
        "mavenProjectInfo",
        params,
        [this.pageSize * (page - 1), this.pageSize * page],
        this.sortKey,
        this.sortReverse
      ).then((resp) => {
        //console.log(resp);
        this.mavenProjects = resp.data.projects;
        this.setPageAll(resp.data.count, this.pageSize);
      });
    },
    setPageAll(count, pageSize) {
      this.pageAll = Math.ceil(count / pageSize);
      if (this.pageAll < 1) {
        this.pageAll = 1;
      }
    },
    doSearch(paramValues) {
      this.$router.push({
        name: "MavenProjects",
        params: paramValues,
      });
    },
  },
  mounted() {
    console.log(this.$props);
    this.searchMavenProject(this.$props, 1);
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/searcher-in-header.scss";
</style>