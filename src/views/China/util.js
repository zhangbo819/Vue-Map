const map = {};
export function getYearData(year) {
  if (!map[year]) {
    map[year] = require(`@/utils/500/new${year}Data.json`);
  }
  return map[year];
}

const worldMap = {};
export function getWorldYearData(year) {
  if (!worldMap[year]) {
    worldMap[year] = require(`@/utils/world/${year}Data.json`);
  }
  return worldMap[year];
}
