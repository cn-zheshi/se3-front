<template>
  <page-header>
    <searcher category="repositoryInfo" @search="doSearch" />
  </page-header>
  <!-- <el-form
    id="search-form"
    label-position="right"
    label-width="80px"
    :inline="true"
  >
    <el-form-item label="名称:">
      <el-input
        type="text"
        value=""
        placeholder="name"
        id="repo_name"
        v-model="repo_name"
      />
    </el-form-item>

    <el-form-item label="平台:">
      <el-input
        type="text"
        value=""
        placeholder="platform"
        id="hostType"
        v-model="platform"
      />
    </el-form-item>
    <el-form-item label="所有者:">
      <el-input
        type="text"
        value=""
        placeholder="owner"
        id="owner"
        v-model="owner"
      />
    </el-form-item>
    <el-form-item label="所用语言:">
      <el-autocomplete
        v-model="language_text"
        :fetch-suggestions="getLanguages"
        placeholder="language"
        id="language_text"
      />
    </el-form-item>
    <el-form-item label="仓库地址:">
      <el-input type="text" value="" placeholder="url" id="url" v-model="url" />
    </el-form-item>
    <el-form-item label="能否fork:">
      <el-radio name="can_be_fork" label="0" v-model="canFork"
        ><label>不选择</label></el-radio
      >
      <el-radio name="can_be_fork" label="1" v-model="canFork"
        ><label>能</label></el-radio
      >
      <el-radio name="can_be_fork" label="2" v-model="canFork"
        ><label>不能</label></el-radio
      >
    </el-form-item>
    <div>
      <el-button id="searchbutton" v-on:click="searchRepo(1)" round
        >搜索</el-button
      >
    </div>
  </el-form> -->
  <!-- <div>
    <el-table
      :data="repository_data"
      border
      :default-sort="{ prop: 'repositoryName', order: 'ascending' }"
      v-on:sort-change="changeSort"
    >
      <el-table-column prop="repositoryName" label="名称" sortable="custom">
        <template #default="scope">
          <el-link
            type="primary"
            v-on:click="$router.push('/repository/' + scope.row.repositoryId)"
          >
            {{ scope.row.repositoryName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="hostType" label="平台" />
      <el-table-column prop="repositoryOwner" label="所有者" />
      <el-table-column prop="language" label="所用语言" />
      <el-table-column prop="homepageUrl" label="地址">
        <template #default="scope">
          <el-link type="primary" :href="scope.row.homepageUrl">{{
            scope.row.homepageUrl
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="createT" label="创建时间" sortable="custom">
        <template #default="scope">
          <p>{{ dateFormat(scope.row.createT) }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="updateT" label="更新时间" sortable="custom">
        <template #default="scope">
          <p>{{ dateFormat(scope.row.updateT) }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="canFork" label="能否fork" />
      <el-table-column prop="forkCount" label="fork数量" sortable="custom" />
      <el-table-column
        prop="watcherCount"
        label="watcher数量"
        sortable="custom"
      />
      <el-table-column prop="starCount" label="star数量" sortable="custom" />
      <el-table-column
        prop="contributorCount"
        label="贡献者数量"
        sortable="custom"
      />
      <el-table-column
        prop="openIssueCount"
        label="issue数量"
        sortable="custom"
      />
    </el-table>
  </div> -->
  <my-table
    :changeSort="changeSort"
    :columnInfo="columnInfo"
    :contentData="repository_data"
  ></my-table>
  <page :goPage="goPage" :pageAll="pageAll"></page>
</template>

<script>
import { search_repo } from "../api/search_repo";
import getLanguageList from "@/scripts/LanguageSelector.js";
import { dateFormatter } from "@/scripts/DateFormatter.js";
import Page from "@/components/Page.vue";
import MyTable from "../components/Table.vue";
import Searcher from "../components/Searcher.vue";
import { searchParams } from "@/scripts/DataSchema.js";
import { columnInfos } from "@/scripts/Constant.js";
import PageHeader from "@/components/PageHeader.vue";

const sortKeys = {
  repositoryName: "Name",
  createT: "CreateT",
  updateT: "UpdateT",
  latestPushT: "LatestPushT",
  forkCount: "ForkCount",
  watcherCount: "WatcherCount",
  starCount: "StarCount",
  contributorCount: "ContributorCount",
  openIssueCount: "OpenIssueCount",
};

export default {
  name: "Repositories",
  components: { Page, MyTable, PageHeader, Searcher },
  props: searchParams.repositoryInfo,
  data() {
    return {
      repository_data: [],
      pageAll: 1,
      sortKey: "Name",
      sortReverse: false,
      columnInfo: columnInfos.repositoriesColumnInfo,
    };
  },
  watch: {
    "$route.params": function (value) {
      console.log("route changed");
      this.searchRepo(value, 1);
    },
  },
  methods: {
    changeSort(ev) {
      if (ev.prop === null) {
        this.sortKey = "Name";
        this.sortReverse = false;
      } else {
        this.sortKey = sortKeys[ev.prop];
        this.sortReverse = ev.order === "descending";
      }
      this.searchRepo(this.$props, 1);
    },
    searchRepo(params, page) {
      search_repo({
        page,
        sort: this.sortKey,
        isReverse: this.sortReverse,
        ...params,
      })
        .then((res) => {
          console.log(res.data.msg);
          this.repository_data = res.data.data.repositories;
          this.pageAll = res.data.data.pageAll;
          if (this.pageAll < 1) {
            this.pageAll = 1;
          }
        })
        .catch(function (error) {
          console.log("连接失败");
          console.log(error); //如果连接失败，则抛出错误的信息
        });
    },
    goPage(index) {
      if (Number(index) > 0 && Number(index) <= this.pageAll) {
        this.searchRepo(this.$props, Number(index));
      }
    },
    getLanguages(input, cb) {
      getLanguageList(input, cb);
    },
    dateFormat(date) {
      return dateFormatter(date);
    },
    doSearch(paramValues) {
      this.$router.push({
        name: "Repositories",
        params: paramValues,
      });
    },
  },
  mounted() {
    this.searchRepo(this.$props, 1);
  },
  created() {},
};
</script>

<style lang='scss' scoped>
@import "@/styles/searcher-in-header.scss";
.table {
  text-align: center;
  margin: auto;
}

#search-form {
  margin: 2% auto;
}
</style>
