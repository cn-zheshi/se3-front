import { createRouter, createWebHashHistory } from "vue-router";
import Repositories from '../views/repositories.vue'
import Projects from '../views/projects.vue'
import Project from '../views/project.vue'
import Repository from '../views/repository.vue'
import SearchView from '@/views/SearchView.vue'
import DependencyGraphView from '@/views/DependencyGraphView.vue'
import MavenProjects from "../views/MavenProjects.vue"
import MavenProject from "../views/MavenProject.vue"
import RuleInfo from "../views/RuleInfo.vue"
import JumpToOut from "../views/JumpToOut.vue"


const routes = [
  {
    path: '/',
    name: 'Search',
    component: SearchView,
  },
  {
    path: '/repositories',
    name: 'Repositories',
    component: Repositories,
    props: true,
  },
  //在这里添加路径
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    props: true,
  },
  {
    path: '/project/:id',
    name: 'Project',
    component: Project
  },
  {
    path: '/repository/:id',
    name: 'Repository',
    component: Repository,
    props: true,
  },
  {
    path: '/dependency-graph',
    name: 'DependencyGraph',
    component: DependencyGraphView,
    props: true,
  },
  {
    path: '/maven-projects',
    name: 'MavenProjects',
    component: MavenProjects,
    props: true,
  },
  {
    path: '/maven-project/:id',
    name: 'MavenProject',
    component: MavenProject,
  },
  {
    path: '/rule-info/:id',
    name: 'RuleInfo',
    component: RuleInfo,
  },
  {
    path: '/jump-to-out',
    name: 'JumpToOut',
    component: JumpToOut,
  }
]

export const router = new createRouter({
  history: createWebHashHistory(),
  routes: routes
})
