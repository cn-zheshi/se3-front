<template>
  <el-form
    id="searcher"
    @keyup.enter="$emit('search', paramValues)">
    <el-input
      class="searcher-groupid"
      type="text"
      placeholder="groupId"
      v-model="paramValues.groupId"
    />
    <el-input
      class="searcher-artifactid"
      type="text"
      placeholder="artifactId"
      v-model="paramValues.artifactId"
    />
    <el-button
      class="searcher-button"
      :icon="searchIcon"
      @click="$emit('search', paramValues)"
    />
    <el-upload
      id="searcher-pom-uploader"
      class="searcher-button"
      ref="uploadRef"
      accept=".xml"
      :auto-upload="false"
      :on-change="doUploadPom">
      <el-button :icon="uploadIcon">Upload POM</el-button>
    </el-upload>
  </el-form>
</template>

<script>
import { searchParams } from "@/scripts/DataSchema.js";
import SearcherBooleanField from "@/components/searcher-fields/SearcherBooleanField.vue";
import SearcherTextField from "@/components/searcher-fields/SearcherTextField.vue";
import SearcherPomField from "@/components/searcher-fields/SearcherPomField.vue";
import { Search, More, Upload } from "@element-plus/icons-vue";

const paramNameMapping = {
  projectInfo: {
    name: "名称",
    platform: "平台",
    language: "所用语言",
    homepageUrl: "项目地址",
    latestReleaseN: "版本",
    dependency: "依赖库",
  },
  repositoryInfo: {
    hostType: "平台",
    repositoryName: "名称",
    repositoryOwner: "所有者",
    language: "所用语言",
    homepageUrl: "仓库地址",
    canFork: "能否 fork",
  },
  mavenProjectInfo: {
    groupId: "组织名",
    artifactId: "名称",
  },
  dependencyInfo: {
    groupId: 'groupId',
    artifactId: 'artifactId',
  },
};

const defaultParams = {
  projectInfo: "name",
  repositoryInfo: "repositoryName",
  mavenProjectInfo: "artifactId",
  dependencyInfo: 'artifactId',
};

const defaultFormItem = {
  String: SearcherTextField,
  Boolean: SearcherBooleanField,
};

const overrideFormItem = {
  pomUrl: SearcherPomField,
};

export default {
  name: "Searcher",
  emits: ["search"],
  props: {
    category: String,
    initParamValues: Object,
  },
  data() {
    console.log('initParamValues', this.initParamValues)
    return {
      paramValues: {
        groupId: this.initParamValues?.groupId,
        artifactId: this.initParamValues?.artifactId,
      },
    };
  },
  watch: {
    category() {
      this.paramValues = {}
    },
  },
  methods: {
    doUploadPom(file) {
      const fileUrl = URL.createObjectURL(file.raw)
      console.log('doUploadPom', file, fileUrl)
      this.$refs.uploadRef.clearFiles()
      this.$router.push({
        name: 'DependencyGraph',
        params: {
          pomUrl: fileUrl
        }
      })
    },
  },
  computed: {
    searchIcon() {
      return Search
    },
    uploadIcon() {
      return Upload
    },
    moreIcon() {
      return More
    },
    params() {
      return searchParams[this.category];
    },
    paramNames() {
      return paramNameMapping[this.category];
    },
    defaultParam() {
      return defaultParams[this.category];
    },
    formItems() {
      return Object.fromEntries(
        Object.entries(this.params)
          .filter((e) => e[0] !== this.defaultParam)
          .map((e) => {
            const name = e[0];
            const item = overrideFormItem[e[0]] || defaultFormItem[e[1].name];
            // item.$on('change', value => this.paramValues[name] = value)
            return [name, item];
          })
      );
    },
  },
};
</script>

<style scoped>
#searcher {
  margin: auto auto;
  height: 50px;
  width: 60vw;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border: 1px solid var(--el-border-color-base);
  border-radius: var(--el-border-radius-base);
}

#searcher .el-button {
  margin: auto 5px;
}

#searcher > .searcher-button {
  height: 65%;
}

#searcher > .el-input {
  height: 100%;
}

#searcher > .el-input::v-deep input {
  font-size: 1.5em;
  height: 100%;
  box-shadow: none;
}

.searcher-artifactid {
  border-left: 1px solid var(--el-border-color-base);
}

#searcher-pom-uploader::v-deep .el-upload, #searcher-pom-uploader::v-deep .el-upload .el-button {
  height: 100%;
}
</style>
