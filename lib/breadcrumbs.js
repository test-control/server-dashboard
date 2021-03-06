export const routes = {
  mainPage: () => ({
    href: '/',
    title: 'Homepage'
  }),
  testCases: {
    show: (id, title) => ({
      href: '/test-cases/' + id,
      title: title
    })
  },
  projects: {
    list: () => ({
      href: '/projects',
      title: 'Projects'
    }),
    create: () => ({
      href: '/projects/create',
      title: 'Create new project'
    }),
    tree: (projectId) => ({
      href: '/projects/' + projectId + '/tree',
      title: 'Tree'
    }),
    treeLeaf: (projectId, treeLeafId, title) => ({
      href: '/projects/' + projectId + '/tree?leaf=' + treeLeafId,
      title: title
    }),
    dashboard: (projectId, projectTitle) => ({
      href:  '/projects/' + projectId + '/tree', //this is only temporary path.
      title: projectTitle
    })
  }
}
