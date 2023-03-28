export const schema = {
  projectInfo: {
    projectId: Number,
    projectName: String,
    platform: String,
    language: String,
    description: String,
    homepageUrl: String,
    createT: Date,
    updateT: Date,
    latestReleaseT: Date,
    latestReleaseN: String,
    repositoryId: Number,
    repositoryUrl: String,
    licenses: Array,
  },
  repositoryInfo: {
    repositoryId: Number,
    hostType: String,
    repositoryName: String,
    repositoryOwner: String,
    language: String,
    description: String,
    homepageUrl: String,
    createT: Date,
    updateT: Date,
    latestPushT: Date,
    canFork: Boolean,
    forkCount: Number,
    watcherCount: Number,
    starCount: Number,
    contributorCount: Number,
    openIssueCount: Number,
    defaultBranch: String,
    licenses: Array, // Array of Strings
  },
  mavenProjectInfo: {
    projectId: Number,
    name: String,
    groupId: String,
    artifactId: String,
    versions: Array,
    description: String,
    url: String,
  },
  dependencyInfo: {
    libId: Number,
    groupId: String,
    artifactId: String,
  },
  dependencyGraphInfo: {
    projectId: Number,
    name: String,
    outEdges: Array, // Array of dependencyGraphEdge
  },
  dependencyGraphEdge: {
    projectId: Number,
    weight: Number,
  },
};

export const sortableKeys = {
  projectInfo: [
    'projectName',
    'createT',
    'updateT',
    'latestReleaseN',
  ],
  repositoryInfo: [
    'repositoryName',
    'createT',
    'updateT',
    'forkCount',
    'starCount',
    'contributorCount',
    'openIssueCount',
  ],
  mavenProjectInfo: [
    'GroupId',
    'ArtifactId',
  ],
  dependencyInfo: [
    'GroupId',
    'ArtifactId',
    'RuleNum',
  ]
}

export const searchParams = {
  projectInfo: {
    name: String,
    platform: String,
    language: String,
    homepageUrl: String,
    latestReleaseN: String,
    dependency: String,
  },
  repositoryInfo: {
    hostType: String,
    repositoryName: String,
    repositoryOwner: String,
    language: String,
    homepageUrl: String,
    canFork: Boolean,
  },
  mavenProjectInfo: {
    groupId: String,
    artifactId: String,
  },
  dependencyInfo: {
    groupId: String,
    artifactId: String,
    pomUrl: String,
  },
}
