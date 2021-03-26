module.exports = {
  preset: 'ts-jest',
  globals: {},
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': 'vue-jest'
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node']
}