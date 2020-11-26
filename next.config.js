const { nextI18NextRewrites } = require('next-i18next/rewrites')

const localeSubpaths = {}

module.exports = {
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
  env: {
    TEST_CONTROL_DASHBOARD_API_URL: process.env.TEST_CONTROL_DASHBOARD_API_URL,
    TEST_CONTROL_DASHBOARD_PORT: process.env.TEST_CONTROL_DASHBOARD_PORT
  }
}
