// 中文版本的排序
function sortByZh(a: string, b: string, isSortUp: boolean) {
  return isSortUp ? a.localeCompare(b) : b.localeCompare(a);
}
export function sortByZhKey(key: string) {
  return (
    a: Record<string, string>,
    b: Record<string, string>,
    isSortUp: boolean
  ) => sortByZh(a[key], b[key], isSortUp);
}
