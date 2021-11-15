import md5 from "md5";

export function generateUniqueID() {
  return md5(Date.now().toString() + Math.random())
}