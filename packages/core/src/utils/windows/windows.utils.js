import md5 from 'md5'

export function generateWindowUniqueId() {
  return md5(Date.now() + Math.random())
}