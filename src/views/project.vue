<template>
  <page-header></page-header>
  <el-container>
    <el-header height="150px">
      <my-description
        :title="project.projectName"
        :columnCountInline="4"
        :columnInfo="columnInfo"
        :contentData="{ repoName, ...project }"
      ></my-description>
      <!-- <el-descriptions :title="project.projectName" :column="3" border>
        <el-descriptions-item label="平台">{{
          project.platform
        }}</el-descriptions-item>
        <el-descriptions-item label="语言">{{
          project.language
        }}</el-descriptions-item>
        <el-descriptions-item label="地址">
          <el-link type="primary" :href="project.homepageUrl">{{
            project.homepageUrl
          }}</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          dateFormat(project.createT)
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          dateFormat(project.updateT)
        }}</el-descriptions-item>
        <el-descriptions-item label="最新发布版本时间">{{
          dateFormat(project.latestReleaseT)
        }}</el-descriptions-item>
        <el-descriptions-item label="最新版本号">{{
          project.latestReleaseN
        }}</el-descriptions-item>
        <el-descriptions-item label="所属仓库">
          <el-link
            type="primary"
            @click="$router.push('/repository/' + project.repositoryId)"
            >{{ repoName }}</el-link
          >
        </el-descriptions-item>
        <el-descriptions-item label="仓库地址">
          <el-link type="primary" :href="project.repositoryUrl">{{
            project.repositoryUrl
          }}</el-link>
        </el-descriptions-item>
      </el-descriptions> -->
    </el-header>
    <el-container>
      <el-aside width="200px">
        <div>{{ project.description }}</div>
        <div>
          <el-table :data="project.licenses" border empty-text="无许可证信息">
            <el-table-column label="许可证">
              <template #default="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-aside>
      <el-main>
        <el-form label-position="left" label-width="80px" :inline="true">
          <p>筛选依赖</p>
          <el-form-item label="名称:">
            <el-input
              type="text"
              value=""
              placeholder="name"
              id="dependency_name"
              v-model="dependency_name"
            />
          </el-form-item>
          <el-form-item label="平台:">
            <el-input
              type="text"
              value=""
              placeholder="platform"
              id="dependency_platform"
              v-model="dependency_platform"
            />
          </el-form-item>
          <el-form-item label="依赖类型:">
            <el-select
              name=""
              id="dependency_type"
              placeholder="请选择依赖类型"
              v-model="dependency_type"
              clearable
            >
              <el-option
                v-for="type in dependency_type_list"
                v-bind:key="type"
                v-bind:value="type"
              >
                {{ type }}
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-button id="searchbutton" v-on:click="getDependency(1)" round
              >搜索</el-button
            >
          </div>
        </el-form>
        <div>
          <el-radio name="sort_method" label="1" v-model="sort_method"
            ><label>正序</label></el-radio
          >
          <el-radio name="sort_method" label="2" v-model="sort_method"
            ><label>倒序</label></el-radio
          >
        </div>
        <div>
          <el-table
            :data="dependencies"
            border
            empty-text="无依赖"
            style="max-width: 50%; margin: auto"
          >
            <el-table-column prop="dependencyProjectName" label="依赖名称">
              <template #default="scope">
                <el-link
                  type="primary"
                  @click="
                    $router.push('/project/' + scope.row.dependencyProjectId)
                  "
                  >{{ scope.row.dependencyProjectName }}</el-link
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="dependencyProjectPlatform"
              label="依赖的所属平台"
            />
            <el-table-column
              prop="dependencyReqirements"
              label="依赖的版本要求"
            />
            <el-table-column prop="dependencyType" label="依赖类型" />
          </el-table>
        </div>
        <page :goPage="goPage" :pageAll="pageAll"></page>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  get_project_by_id,
  get_project_dependency,
} from "../api/search_project";
import { get_repo_by_id } from "../api/search_repo";
import { dateFormatter } from "@/scripts/DateFormatter.js";
import Page from "../components/Page.vue";
import MyDescription from "../components/Description.vue";
import { columnInfos } from "../scripts/Constant.js";
import PageHeader from "@/components/PageHeader.vue";

export default {
  name: "Project", //注册在路由（router.js）里的就是这个
  props: {},
  components: { Page, MyDescription, PageHeader },
  data() {
    return {
      project: {
        projectId: 0,
        projectName: "",
        platform: "",
        language: "",
        description: "",
        homepageUrl: "",
        createT: "",
        updateT: "",
        latestReleaseT: "",
        latestReleaseN: "",
        repositoryId: 0,
        repositoryUrl: "",
        licenses: [""],
      },
      dependencies: [
        {
          dependencyId: 0,
          projectId: 0,
          projectName: "",
          platform: "",
          projectVersion: "",
          dependencyProjectId: 0,
          dependencyProjectName: "",
          dependencyProjectPlatform: "",
          dependencyReqirements: "",
          dependencyType: "",
        },
      ],
      dependency_type_list: ["runtime", "test", "development", "build"],
      repoName: "",
      dependency_name: "",
      dependency_platform: "",
      dependency_type: "",
      page: 1,
      pageAll: 1,
      jumpPage: "",
      sort_method: "1",
      id: 0,
      latestReleaseN: "",
      columnInfo: columnInfos.projectColumnInfo,
    };
  },
  watch: {
    sort_method: "changeSortMethod",
    $route: "refresh",
  },
  methods: {
    refresh() {
      this.getProject();
    },
    changeSortMethod() {
      this.getDependency(1);
    },
    getProject() {
      this.id = this.$route.params.id;
      get_project_by_id(Number(this.id))
        .then((res) => {
          this.project = res.data.data;
          this.getDependency(1);
          get_repo_by_id(this.project.repositoryId)
            .then((res) => {
              this.repoName = res.data.data.repositoryName;
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getDependency(page) {
      let id = this.id;
      let projectVersion = this.project.latestReleaseN;
      let dependencyProjectName =
        document.getElementById("dependency_name").value;
      let dependencyProjectPlatform = document.getElementById(
        "dependency_platform"
      ).value;
      let dependencyType = document.getElementById("dependency_type").value;
      this.page = page;
      let isReverse = true;
      if (this.sort_method == 1) {
        isReverse = false;
      }
      get_project_dependency(id, {
        projectVersion,
        dependencyProjectName,
        dependencyProjectPlatform,
        dependencyType,
        page,
        isReverse,
      })
        .then((res) => {
          this.dependencies = res.data.data.projDeps;
          this.pageAll = res.data.data.pageAll;
          if (this.pageAll < 1) {
            this.pageAll = 1;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    goPage(index) {
      if (Number(index) > 0 && Number(index) <= this.pageAll) {
        this.page = Number(index);
        this.getDependency(this.page);
      }
    },
    dateFormat(date) {
      return dateFormatter(date);
    },
  },
  mounted() {
    //let id = document.URL.split("?")[1].split("=")[1];
    this.refresh();
  },
  created() {},
};
</script>

<style scoped>
.el-header {
  margin-bottom: 2%;
}

.el-aside {
  margin-left: 3%;
  margin-top: 3%;
}
</style>
