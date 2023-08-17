const map: Record<string, ChinaData[]> = {};
export async function getYearData(year: string | number) {
  if (!map[year]) {
    map[year] = await fetchJSON(`../../utils/500/new${year}Data.json`);
  }
  return map[year];
}

const worldMap: Record<string | number, WorldItem[]> = {};
export async function getWorldYearData(year: string | number) {
  if (!worldMap[year]) {
    worldMap[year] = await fetchJSON(`../../utils/world/${year}Data.json`);
  }
  return worldMap[year];
}

export async function fetchJSON(path: string) {
  const response = await import(path);
  const jsonData = await response.default;

  // 在这里可以对 jsonData 进行处理
  return jsonData;
}
