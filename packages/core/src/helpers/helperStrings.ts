import md5 from "md5";

export function generateUniqueID() {
  return md5(Date.now().toString() + Math.random())
}

export function kebabCase(str: string) {
  return str.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function (match) {
    return '-' + match.toLowerCase();
  });
};