const packageClient = require('../../packages/client/package.json')
const packageCore = require('../../packages/core/package.json')

it('owd-client and owd-core versions should be the same', () => {
  expect(packageClient.version).toBe(packageCore.version)
})
