const {i18n, localePath} = require ('./next-i18next.config')

module.exports = {
  i18n,
  env: {
    TEST_CONTROL_DASHBOARD_API_URL: process.env.TEST_CONTROL_DASHBOARD_API_URL,
    TEST_CONTROL_DASHBOARD_PORT: process.env.TEST_CONTROL_DASHBOARD_PORT,
    DEBUG: true
  }
}
