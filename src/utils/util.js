// 中文版本的排序
function sortByZh(a, b, isSortUp) {
  return isSortUp ? a.localeCompare(b) : b.localeCompare(a);
}
export function sortByZhKey(key) {
  return (a, b, isSortUp) => sortByZh(a[key], b[key], isSortUp);
}
