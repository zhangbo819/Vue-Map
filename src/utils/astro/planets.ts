// Astronomy Engine 轻量计算 各行星实时位置无上升无宫位 可用于客户端
import { Body, Ecliptic, GeoVector } from "astronomy-engine";
import { BODIES, BodyInUse } from "./constant";

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export interface PlanetItem {
  name: BodyInUse;
  sign: string;
  degree: number;
  longitude: number;
  retrograde: boolean;
}

function getPlanetInfo(name: BodyInUse, date: Date) {
  const vec = GeoVector(name, date, true);
  const ecl = Ecliptic(vec);

  const lon = (ecl.elon + 360) % 360;

  return {
    name,
    sign: SIGNS[Math.floor(lon / 30)],
    degree: +(lon % 30).toFixed(2),
    longitude: lon,
  };
}

// 拿到10行星的经度 落座 度数
export function getAllPlanets(date = new Date()): PlanetItem[] {
  return BODIES.map((name) => ({
    ...getPlanetInfo(name, date),
    retrograde: isRetrograde(name, date),
  }));
}

// 判断是否逆行
export function isRetrograde(name: BodyInUse, date: Date) {
  // 日月不会逆行
  if (name === Body.Sun || name === Body.Moon) return false;

  const dt = 60 * 60 * 1000; // 一小时

  const lon1 = getPlanetInfo(name, date).longitude;
  const lon2 = getPlanetInfo(name, new Date(date.getTime() + dt)).longitude;

  let diff = lon2 - lon1; // 每小时移动多少度

  // 处理跨360°
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return diff < 0;
}

enum Aspect {
  Conjunction = "Conjunction",
  Sextile = "Sextile",
  Square = "Square",
  Trine = "Trine",
  Opposition = "Opposition",
}

// 相位
export interface AspectItem {
  between: [PlanetItem["name"], PlanetItem["name"]];
  type: Aspect;
  angle: string;
  orb: number;
  strength: "strong" | "normal";
}
class AspectPosition {
  ASPECTS = [
    { name: Aspect["Conjunction"], title: "合相", angle: 0, orb: 8 },
    { name: Aspect["Sextile"], title: "六合", angle: 60, orb: 4 },
    { name: Aspect["Square"], title: "刑", angle: 90, orb: 6 },
    { name: Aspect["Trine"], title: "三合", angle: 120, orb: 6 },
    { name: Aspect["Opposition"], title: "冲", angle: 180, orb: 8 },
  ];
  map = {
    [Aspect.Conjunction]: { name: "合相", color: "#ff8549" }, // 靛蓝（中性、融合）
    [Aspect.Sextile]: { name: "六合", color: "#40c977" }, // 绿色（和谐、机会）
    [Aspect.Square]: { name: "刑", color: "#f00" }, // 红色（冲突、张力）
    [Aspect.Trine]: { name: "三合", color: "#00a240" }, // 蓝色（顺畅、流动）
    [Aspect.Opposition]: { name: "冲", color: "#8046d9" }, // 橙色（对立但有连接）
  };
  // 针对行星使用单独的容许度
  private getDynamicOrb(
    n1: PlanetItem["name"],
    n2: PlanetItem["name"],
    baseOrb: number
  ) {
    if (n1 === Body.Sun || n2 === Body.Sun) return baseOrb + 2;
    if (n1 === Body.Moon || n2 === Body.Moon) return baseOrb + 2;
    return baseOrb;
  }
  private getAngleDiff(a: number, b: number) {
    const diff = Math.abs(a - b);
    return diff > 180 ? 360 - diff : diff;
  }
  private getAspect(
    n1: PlanetItem["name"],
    n2: PlanetItem["name"],
    diff: number
  ) {
    for (const asp of this.ASPECTS) {
      const orb = this.getDynamicOrb(n1, n2, asp.orb);
      if (Math.abs(diff - asp.angle) <= orb) {
        return {
          type: asp.name,
          exact: diff,
          orb: +Math.abs(diff - asp.angle).toFixed(2),
        };
      }
    }
    return null;
  }

  // 获取相位数据
  public getData(planets: PlanetItem[]) {
    const aspects: AspectItem[] = [];

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const p1 = planets[i];
        const p2 = planets[j];

        const diff = this.getAngleDiff(p1.longitude, p2.longitude);
        const aspect = this.getAspect(p1.name, p2.name, diff);

        if (aspect) {
          aspects.push({
            between: [p1.name, p2.name],
            type: aspect.type,
            angle: diff.toFixed(2),
            orb: aspect.orb,
            strength: aspect.orb < 1 ? "strong" : "normal",
          });
        }
      }
    }

    // 按紧密度排序
    // aspects.sort((a, b) => a.orb - b.orb);

    return aspects;
  }

  // 根据经度获取 x y，坐标原点为左上角，经度为 0 时坐标为 (0, R - r)
  // R 为星盘半径，r 为行星自己轨道的最大半径
  public getPosition(longitude: number, R: number) {
    const r = 0.8 * R; // translateX(-80%)

    // 转弧度 + 偏移 180°
    const rad = ((longitude + 180) * Math.PI) / 180;

    return {
      x: R + r * Math.cos(rad),
      y: R - r * Math.sin(rad),
    };
  }
}

export const aspectPosition = new AspectPosition();
