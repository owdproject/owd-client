const packageClient = require('owd-client/package.json')
const packageCore = require('@owd-client/core/package.json')

test('owd-client and owd-core versions should be the same', () => {
  expect(packageClient.version).toBe(packageCore.version)
})
