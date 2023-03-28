<template>
  <el-container direction="vertical">
    <page-header>
      <searcher :init-param-values="$props" category="dependencyInfo" @search="doSearch"/>
    </page-header>
    <el-container>
      <el-aside>
        <el-menu
          id="dependency-list"
          v-infinite-scroll="loadMoreDependencies"
          @select="loadGraph"
        >
          <el-menu-item
            v-for="dependency in dependencies"
            :key="dependency.libId"
            :index="dependency.libId.toString()"
          >
            <span class="dependency-name">{{dependency.groupId + ':' + dependency.artifactId}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main id="dependency-graph" ref="dependencyGraph">
        <el-popover
          id="dependency-info"
          ref="dependencyInfo"
          :visible="dependencyInfoVisible"
          placement="top"
          width="200px"
          :popper-options="popoverOptions"
        >
          <el-descriptions title="项目信息" :column="1">
            <template v-for="(value, key) in dependencyInfo">
              <el-descriptions-item
                v-if="dependencyInfoLabels[key]"
                :key="key"
                :label="dependencyInfoLabels[key]"
              >
                {{value}}
              </el-descriptions-item>
            </template>
          </el-descriptions>
          <template #reference>
            <div id="dependency-info-anchor" ref="dependencyInfoAnchor"/>
          </template>
        </el-popover>
        <el-popover
          id="migration-info"
          ref="migrationInfo"
          :visible="migrationInfoVisible"
          placement="top"
          width="200px"
          :popper-options="popoverOptions"
        >
          <el-descriptions title="迁移规则信息" :column="1">
            <template v-for="(value, key) in migrationInfo">
              <el-descriptions-item
                v-if="migrationInfoLabels[key]"
                :key="key"
                :label="migrationInfoLabels[key]"
              >
                {{value}}
              </el-descriptions-item>
            </template>
          </el-descriptions>
          <template #reference>
            <div id="migration-info-anchor" ref="migrationInfoAnchor"/>
          </template>
        </el-popover>
        <el-card
          id="recommendation-list"
          v-if="selectedDependency !== null"
        >
          <template #header>
            <div>推荐迁移列表</div>
          </template>
          <el-menu @select="focusNode">
            <el-menu-item
              v-for="(node, libId) in otherNodes"
              :key="libId"
              :index="libId.toString()"
            >
              <span class="dependency-name">{{node.groupId + ':' + node.artifactId}}</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import Searcher from '@/components/Searcher.vue'
import { searchParams } from '@/scripts/DataSchema.js'
import search from '@/api/Search.js'
import { getGraph } from '@/api/DependencyGraph.js'
import G6 from '@antv/g6'
import uploadPom from '@/api/UploadPom.js'

const graphOptions = {
  modes: { default: [ 'drag-canvas', 'zoom-canvas' ] },
  layout: {
    type: 'force',
    preventOverlap: true,
    nodeSpacing: 100,
  },
  defaultNode: {
    type: 'circle',
    size: 50,
  },
  defaultEdge: {
    type: 'quadratic',
    style: {
      cursor: 'pointer'
    },
  },
  animate: true,
}

const dependencyInfoLabels = {
  groupId: 'GroupId',
  artifactId: 'ArtifactId',
  transitiveConfidence: '推荐度',
  mvnCtrUrl: 'Maven Central 地址',
  repoUrl: '项目地址',
  description: '描述',
}

const migrationInfoLabels = {
  confidence: '置信度',
  num: '迁移次数',
  rs: 'Rule Support',
  ms: 'Message Support',
  ds: 'Distance Support',
  as: 'API Support',
}

const popoverOptions = {
  modifiers: [
    {
      name: 'flip',
      options: {
        padding: 5,
        fallbackPlacements: ['bottom-start', 'top-start', 'right', 'left'],
      }
    }
  ]
}

export default {
  components: { PageHeader, Searcher },
  props: searchParams.dependencyInfo,
  data() {
    return {
      dependencies: [],
      dependencyInfoVisible: false,
      dependencyInfo: {},
      migrationInfoVisible: false,
      migrationInfo: {},
      selectedDependency: null,
      edges: {},
      nodes: {},
    }
  },
  methods: {
    doSearch(params) {
      this.$router.push({
        name: 'DependencyGraph',
        params,
      })
    },
    loadMoreDependencies() {
      console.log(this.$props)

      if (this.$props.pomUrl) {
        if (this.dependencies.length !== 0) {
          return
        }

        fetch(this.$props.pomUrl)
          .then(resp => resp.blob())
          .then(uploadPom)
          .then(resp => this.dependencies.push(...resp.data))
      } else {
        search(
          'dependencyInfo',
          this.$props,
          [this.dependencies.length, this.dependencies.length + 20],
          'RuleNum',
          true
        ).then(resp => this.dependencies.push(...resp.data.libs))
      }
    },
    loadGraph(id) {
      getGraph(id).then(resp => {
        console.log(resp)
        id = Number.parseInt(id)
        const nodes = resp.data

        this.selectedDependency = id
        this.nodes = Object.fromEntries(nodes.map(n => [
          n.fromLibInfo.libId,
          n.fromLibInfo
        ]))

        this.edges = Object.fromEntries(nodes.map(n => [
          n.fromLibInfo.libId,
          Object.fromEntries(n.edges.map(e => [
            e.toId,
            e
          ]))
        ]))

        this.graph.changeData({
          nodes: nodes.map(n => Object.assign({
            id: n.fromLibInfo.libId.toString(),
            label: `${n.fromLibInfo.artifactId}`,
          })),
          edges: nodes.flatMap(n => n.edges.map(e => Object.assign({
            source: n.fromLibInfo.libId.toString(),
            target: e.toId.toString(),
            style: {
              lineWidth: Math.min(Math.max(10 * e.confidence, 0.5), 10),
              endArrow: {
                path: G6.Arrow.vee(Math.min(Math.max(10 * e.confidence, 7), 10), Math.min(Math.max(10 * e.confidence, 10), 10), 0),
                d: 0,
                fill: '#e0e0e0'
              },
            }
          })))
        })
      })
    },
    moveAnchor(ev, anchor, x, y) {
      const xdiff = ev.clientX - ev.canvasX
      const ydiff = ev.clientY - ev.canvasY

      anchor.style.top = `${y + ydiff}px`
      anchor.style.left = `${x + xdiff}px`
    },
    showDependencyInfo() {
      const _this = this
      return ev => {
        const anchor = _this.$refs.dependencyInfoAnchor
        const pos = ev.item._cfg.keyShape.cfg.cacheCanvasBBox

        this.moveAnchor(ev, anchor, pos.x + pos.width / 2, pos.y)
        _this.dependencyInfoVisible = true
        _this.dependencyInfo = _this.nodes[parseInt(ev.item._cfg.model.id)]
      }
    },
    hideDependencyInfo() {
      const _this = this
      return () => {
        _this.dependencyInfoVisible = false
      }
    },
    showMigrationInfo() {
      const _this = this
      return ev => {
        const anchor = _this.$refs.migrationInfoAnchor
        const model = ev.item._cfg.model

        this.moveAnchor(ev, anchor, ev.canvasX, ev.canvasY)
        _this.migrationInfoVisible = true
        _this.migrationInfo = _this.edges[parseInt(model.source)][parseInt(model.target)]
      }
    },
    hideMigrationInfo() {
      const _this = this
      return () => {
        _this.migrationInfoVisible = false
      }
    },
    gotoMigrationRulePage() {
      const _this = this
      return ev => {
        const model = ev.item._cfg.model
        const edge = _this.edges[parseInt(model.source)][parseInt(model.target)]
        _this.$router.push({
          name: 'RuleInfo',
          params: { id: edge.ruleId }
        })
      }
    },
    focusNode(id) {
      this.graph.focusItem(id)
    }
  },
  computed: {
    dependencyInfoLabels() {
      return dependencyInfoLabels
    },
    migrationInfoLabels() {
      return migrationInfoLabels
    },
    otherNodes() {
      return Object.fromEntries(
        Object.entries(this.nodes).filter(n => n[0] !== this.selectedDependency.toString())
      )
    },
    popoverOptions() {
      return popoverOptions
    },
  },
  watch: {
    '$props': {
      deep: true,
      handler() {
        console.log('route changed', this.$props)
        this.dependencies = []
        this.loadMoreDependencies()
      },
    },
  },
  mounted() {
    const container = this.$refs.dependencyGraph.$el

    this.graph = new G6.Graph({
      container: container,
      height: container.clientHeight,
      width: container.clientWidth,
      ...graphOptions,
    })

    this.graph.on('node:mouseover', this.showDependencyInfo())
    this.graph.on('node:mouseout', this.hideDependencyInfo())
    this.graph.on('edge:mouseover', this.showMigrationInfo())
    this.graph.on('edge:mouseout', this.hideMigrationInfo())
    this.graph.on('edge:click', this.gotoMigrationRulePage())

    new ResizeObserver(entries => {
      const size = entries[0].contentRect
      this.graph.changeSize(size.width, size.height - 6)
      this.graph.fitCenter()
    }).observe(container)

    this.graph.read({
      nodes: [],
      edges: [],
    })
  }
}
</script>

<style lang='scss' scoped>
@import '@/styles/searcher-in-header.scss';

#dependency-list {
  overflow: auto;
  height: calc(100vh - 60px);
  width: var(--el-aside-width);
}

.dependency-id, .dependency-description {
  margin-inline-start: 4px;
  color: var(--el-color-info);
  font-size: 80%;
}

#dependency-graph {
  height: calc(100vh - 60px);
  width: calc(100vw - 300px);
}

#dependency-info-anchor, #migration-info-anchor {
  position: absolute;
}

#dependency-info, #migration-info {
  width: 300px;
}

#recommendation-list {
  position: absolute;
  top: 100px;
  right: 10px;
  max-width: 300px;
  max-height: min(calc(100vh - 120px), 500px);
}

#recommendation-list::v-deep > .el-card__body {
  overflow: scroll;
  height: calc(min(calc(100vh - 120px), 500px) - 62px);
}

#recommendation-list .el-menu {
  border: 0;
}

#recommendation-list .el-menu .el-menu-item, #dependency-list .el-menu-item {
  overflow: hidden
}

::v-deep #searcher {
  margin-right: 10px;
  margin-top: 10px;
  width: 50vw;
  height: 40px;
}
</style>
