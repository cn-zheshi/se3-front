<template>
  <page-header>
    <search-category-selector @select="type = $event"/>
  </page-header>
  <img id='searcher-icon' src='/icon.svg' />
  <searcher :category="searchCategory" @search="doSearch"/>
</template>

<script>
import Searcher from '@/components/Searcher.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchCategorySelector from '@/components/header-components/SearchCategorySelector.vue'

const searchPaths = {
    // projectInfo: 'Projects',
    // repositoryInfo: 'Repositories',
    // mavenProjectInfo:'MavenProjects',
  dependencyGraphInfo: 'DependencyGraph',
}

const searchCategories = {
    // projectInfo: 'projectInfo',
    // repositoryInfo: 'repositoryInfo',
    // mavenProjectInfo:'mavenProjectInfo',
  dependencyGraphInfo: 'dependencyInfo',
}

export default {
  name:"Search",
  components: { Searcher, PageHeader, SearchCategorySelector },
  data() {
    return {
      type: "dependencyGraphInfo",
    }
  },
  computed: {
    searchCategory() {
      return searchCategories[this.type]
    }
  },
  methods: {
    doSearch(paramValues) {
      this.$router.push({
        name: searchPaths[this.type],
        params: paramValues,
      })
    },
  },
}
</script>

<style scoped>
::v-deep #searcher-main-input {
  width: 60%;
  height: 3em;
  margin: 1em auto;
}

#searcher::v-deep {
  margin-top: 10vh;
}

#searcher-icon {
  max-height: 30vh;
  max-width: 30vw;
  margin-top: 10vh;
}
</style>
