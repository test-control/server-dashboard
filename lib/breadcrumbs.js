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
    })
  }
}
