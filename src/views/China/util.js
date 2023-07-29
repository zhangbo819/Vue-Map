const map = {};
export function getYearData(year) {
  if (!map[year]) {
    map[year] = require(`../../utils/500/new${year}Data.json`);
  }
  return map[year];
}
