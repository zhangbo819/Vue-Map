// Astronomy Engine 轻量计算 各行星实时位置无上升无宫位 可用于客户端
import { Body, Ecliptic, GeoVector, PairLongitude } from 'astronomy-engine';
import { BODIES, BodyInUse } from './constant';

export enum Star {
  'Aries' = 'Aries',
  'Taurus' = 'Taurus',
  'Gemini' = 'Gemini',
  'Cancer' = 'Cancer',
  'Leo' = 'Leo',
  'Virgo' = 'Virgo',
  'Libra' = 'Libra',
  'Scorpio' = 'Scorpio',
  'Sagittarius' = 'Sagittarius',
  'Capricorn' = 'Capricorn',
  'Aquarius' = 'Aquarius',
  'Pisces' = 'Pisces',
}

const SIGNS = [
  Star.Aries,
  Star.Taurus,
  Star.Gemini,
  Star.Cancer,
  Star.Leo,
  Star.Virgo,
  Star.Libra,
  Star.Scorpio,
  Star.Sagittarius,
  Star.Capricorn,
  Star.Aquarius,
  Star.Pisces,
];

export interface PlanetItem {
  name: BodyInUse;
  sign: Star;
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
  Conjunction = 'Conjunction',
  Sextile = 'Sextile',
  Square = 'Square',
  Trine = 'Trine',
  Opposition = 'Opposition', // 冲
  Quincunx = 'Quincunx', // 梅花相位
}

// 相位
export interface AspectItem {
  between: [PlanetItem['name'], PlanetItem['name']];
  type: Aspect;
  angle: string;
  orb: number;
  strength: 'strong' | 'normal';
}
class AspectPosition {
  ASPECTS = [
    { name: Aspect['Conjunction'], title: '合相', angle: 0, orb: 6 },
    { name: Aspect['Sextile'], title: '六合', angle: 60, orb: 3 },
    { name: Aspect['Square'], title: '刑', angle: 90, orb: 5 },
    { name: Aspect['Trine'], title: '三合', angle: 120, orb: 7 },
    { name: Aspect['Opposition'], title: '冲', angle: 180, orb: 5 },
  ];
  map = {
    [Aspect.Conjunction]: { name: '合相', color: '#ff8549' }, // 靛蓝（中性、融合）
    [Aspect.Sextile]: { name: '六合', color: '#40c977' }, // 绿色（和谐、机会）
    [Aspect.Square]: { name: '刑', color: '#f00' }, // 红色（冲突、张力）
    [Aspect.Trine]: { name: '三合', color: '#00a240' }, // 蓝色（顺畅、流动）
    [Aspect.Opposition]: { name: '冲', color: '#8046d9' }, // 橙色（对立但有连接）
    [Aspect.Quincunx]: { name: '梅花相位', color: '#000' }, // TODO 颜色待补充
  };
  // 针对行星使用单独的容许度
  private getDynamicOrb(n1: PlanetItem['name'], n2: PlanetItem['name'], baseOrb: number) {
    if (n1 === Body.Sun || n2 === Body.Sun) return baseOrb + 2;
    if (n1 === Body.Moon || n2 === Body.Moon) return baseOrb + 2;
    return baseOrb;
  }
  private getAngleDiff(a: number, b: number) {
    const diff = Math.abs(a - b);
    return diff > 180 ? 360 - diff : diff;
  }
  private getAspect(n1: PlanetItem['name'], n2: PlanetItem['name'], diff: number) {
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
            strength: aspect.orb < 1 ? 'strong' : 'normal',
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

  // 判断是否命中相位
  private isAspectHit(diff: number, target: number, orb: number) {
    return Math.abs(diff - target) <= orb;
  }

  // 算每 deg/hour
  private getRelativeSpeed(date: Date, b1: PlanetItem['name'], b2: PlanetItem['name']): number {
    const dt = 60 * 60 * 1000;

    const d1 = PairLongitude(b1, b2, date);
    const d2 = PairLongitude(b1, b2, new Date(date.getTime() + dt));

    return this.getAngleDiff(d1, d2); // deg/hour
  }

  // 根据行星获取动态的步长，快行星走的快，慢行星走的慢，优化计算速度
  private getDynamicStepMs(
    date: Date,
    b1: PlanetItem['name'],
    b2: PlanetItem['name'],
    target: number,
    orb: number
  ) {
    const speed = this.getRelativeSpeed(date, b1, b2); // deg/hour

    // 防止极小值（外行星）
    const safeSpeed = Math.max(speed, 0.001);

    // 目标：一次移动 ≈ orb 的一小部分（比如 1/5）
    const hours = orb / safeSpeed / 5;

    // 转成 ms
    let step = hours * 3600 * 1000;

    // 加边界限制（很重要）
    const MIN = 5 * 60 * 1000; // 5分钟
    const MAX = 24 * 3600 * 1000; // 24小时

    // 此时的 step 就可以用了
    step = Math.max(MIN, Math.min(MAX, step));

    const diff = PairLongitude(b1, b2, date);
    const distance = Math.abs(diff - target);

    // 越接近相位 → step 越小
    const factor = Math.max(distance / orb, 0.1);
    const newStep = step * factor;

    return Math.max(step, newStep);
  }

  // 找边界（开始 / 结束）
  private findBoundary(
    date: Date,
    b1: PlanetItem['name'],
    b2: PlanetItem['name'],
    get: (d: Date) => number,
    target: number,
    orb: number,
    direction: 1 | -1
  ) {
    let t = new Date(date);

    // 动态计算步数
    const stepMs = this.getDynamicStepMs(t, b1, b2, target, orb);

    // 先扫出边界区间
    while (this.isAspectHit(get(t), target, orb)) {
      t = new Date(t.getTime() + direction * stepMs);
    }

    // 二分精确边界
    let t1 = new Date(t.getTime() - direction * stepMs);
    let t2 = t;

    for (let i = 0; i < 20; i++) {
      const mid = new Date((t1.getTime() + t2.getTime()) / 2);
      const hit = this.isAspectHit(get(mid), target, orb);

      if (hit) {
        t1 = mid;
      } else {
        t2 = mid;
      }
    }

    return new Date((t1.getTime() + t2.getTime()) / 2);
  }

  // 找精确相位（exact）
  private findExact(date: Date, get: (d: Date) => number, target: number) {
    let t1 = new Date(date.getTime() - 2 * 24 * 3600 * 1000);
    let t2 = new Date(date.getTime() + 2 * 24 * 3600 * 1000);

    for (let i = 0; i < 25; i++) {
      const mid = new Date((t1.getTime() + t2.getTime()) / 2);

      const d1 = get(t1) - target;
      const dmid = get(mid) - target;

      if (d1 * dmid <= 0) {
        t2 = mid;
      } else {
        t1 = mid;
      }
    }

    return new Date((t1.getTime() + t2.getTime()) / 2);
  }

  // Applying / Separating 入相/出相
  private isApplying(d1: number, d2: number, target: number) {
    return Math.abs(d2 - target) < Math.abs(d1 - target);
  }

  // 找某一个相位的 开始/结束时间
  public findAspectWindow(
    date: Date,
    b1: PlanetItem['name'],
    b2: PlanetItem['name'],
    aspect: Aspect
  ) {
    const _now = new Date(); // debug 计算用时
    const get = (d: Date) => PairLongitude(b1, b2, d);

    // TODO 优化 use map
    const item = this.ASPECTS.find((i) => i.name === aspect);

    const target = item!.angle;
    const orb = this.getDynamicOrb(b1, b2, item!.orb);

    const start = this.findBoundary(date, b1, b2, get, target, orb, -1);
    const end = this.findBoundary(date, b1, b2, get, target, orb, +1);
    const exact = this.findExact(date, get, target);

    const _t = Date.now() - _now.getTime(); // debug 用

    return { start, exact, end, _t };
  }
}

export const aspectPosition = new AspectPosition();

// const result = aspectPosition.findAspectWindow(
//   new Date(),
//   Body.Jupiter,
//   Body.Mars,
//   Aspect.Square // 刑相
// );

// console.log(result.start.toLocaleDateString());
// console.log(result.end.toLocaleDateString());
// console.log(result.exact.toLocaleDateString());

// 格局 依托于相位 暂时放这
export enum PatternType {
  'GrandTrine' = 'GrandTrine',
  'Kite' = 'Kite',
  'TSquare' = 'TSquare',
  'GrandCross' = 'GrandCross',
  'Yod' = 'Yod',
}
type Pattern =
  | {
      type: PatternType.GrandTrine;
      planets: PlanetItem['name'][];
    }
  | {
      type: PatternType.Kite;
      apex: PlanetItem['name'];
      grandTrine: PlanetItem['name'][];
      opposition: [PlanetItem['name'], PlanetItem['name']];
      planets: PlanetItem['name'][];
    }
  | {
      type: PatternType.TSquare;
      planets: PlanetItem['name'][];
      apex: PlanetItem['name'];
      base: [PlanetItem['name'], PlanetItem['name']];
    }
  | {
      type: PatternType.GrandCross;
      planets: PlanetItem['name'][];
    }
  | {
      type: PatternType.Yod;
      apex: PlanetItem['name'];
      base: [PlanetItem['name'], PlanetItem['name']];
      planets: PlanetItem['name'][];
    };

type ConjunctionGroup = {
  planets: PlanetItem['name'][];
};

export class AspectPatternEngine {
  private aspects: AspectItem[];
  // private conjunctions: ConjunctionGroup[];

  constructor(aspects: AspectItem[]) {
    this.aspects = aspects;
    // this.conjunctions = this.buildConjunctionGroups();
    // console.log('conjunctions', this.conjunctions);
  }

  /**
   * 构建合相群
   *
   * 例如：
   * A-B 合
   * B-C 合
   *
   * => [A,B,C]
   */
  private buildConjunctionGroups(): ConjunctionGroup[] {
    // adjacency graph
    const graph = new Map<PlanetItem['name'], Set<PlanetItem['name']>>();

    // 建图
    for (const asp of this.aspects) {
      if (asp.type !== Aspect.Conjunction) continue;

      const [a, b] = asp.between;

      if (!graph.has(a)) {
        graph.set(a, new Set());
      }

      if (!graph.has(b)) {
        graph.set(b, new Set());
      }

      graph.get(a)!.add(b);
      graph.get(b)!.add(a);
    }

    const visited = new Set<PlanetItem['name']>();

    const result: ConjunctionGroup[] = [];

    // DFS 找连通块
    const dfs = (node: PlanetItem['name'], group: Set<PlanetItem['name']>) => {
      visited.add(node);

      group.add(node);

      const neighbors = graph.get(node);

      if (!neighbors) return;

      for (const next of neighbors) {
        if (visited.has(next)) continue;

        dfs(next, group);
      }
    };

    for (const node of graph.keys()) {
      if (visited.has(node)) continue;

      const group = new Set<PlanetItem['name']>();

      dfs(node, group);

      result.push({
        planets: [...group],
      });
    }

    return result;
  }

  // 根据相位关系获取所有格局
  public detectAll(): Pattern[] {
    return [
      ...this.detectGrandTrine(),
      ...this.detectKite(),
      ...this.detectTSquare(),
      ...this.detectGrandCross(),
      // ...this.detectYod(),   // TODO 相位中未实现150度的检测目前不可用
    ];
  }

  // 获取所有顶级格局
  public detectTop(): Pattern[] {
    let res: Pattern[] = [];

    const GrandTrine = this.detectGrandTrine();
    const Kite = this.detectKiteBy(GrandTrine);
    res = res.concat(Kite.length ? Kite : GrandTrine);

    const TSquare = this.detectTSquare();
    const GrandCross = this.detectGrandCrossBy(TSquare);
    console.log('GrandCross', GrandCross);
    res = res.concat(GrandCross.length ? GrandCross : TSquare);

    return res;
  }

  // 去重
  private deduplicate<T extends Pattern>(list: T[]): T[] {
    const seen = new Set<string>();

    return list.filter((item) => {
      const planets = [...item.planets].sort().join('-');

      let key = `${item.type}:${planets}`;

      if (item.type === PatternType.TSquare) {
        key += `:${item.apex}`;
      }

      if (item.type === PatternType.Yod) {
        key += `:${item.apex}`;
      }

      if (item.type === PatternType.Kite) {
        key += `:${item.apex}`;
      }

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    });
  }

  // 大三角（Grand Trine）
  // 条件：3个120°（trine）构成闭环三角
  private detectGrandTrine(): Pattern[] {
    const trines = this.aspects.filter((a) => a.type === Aspect.Trine);

    const results: Pattern[] = [];

    const map = new Map<PlanetItem['name'], Set<PlanetItem['name']>>();

    for (const t of trines) {
      const [a, b] = t.between;

      if (!map.has(a)) map.set(a, new Set());
      if (!map.has(b)) map.set(b, new Set());

      map.get(a)!.add(b);
      map.get(b)!.add(a);
    }

    for (const [a, setA] of map) {
      for (const b of setA) {
        const setB = map.get(b);
        if (!setB) continue;

        for (const c of setB) {
          if (c === a) continue;

          if (map.get(c)?.has(a)) {
            const planets = [a, b, c].sort();

            results.push({
              type: PatternType.GrandTrine,
              planets,
            });
          }
        }
      }
    }

    return this.deduplicate(results);
  }

  // Kite（风筝）🪁
  // Grand Trine（3个 trine）
  // 1 opposition（形成“拉力轴”）
  // apex = 对冲端点之一
  private detectKite(): Pattern[] {
    const oppositions = this.aspects.filter((a) => a.type === Aspect.Opposition);
    const sextiles = this.aspects.filter((a) => a.type === Aspect.Sextile);

    const grandTrines = this.detectGrandTrine();

    const results: Pattern[] = [];

    for (const gt of grandTrines) {
      const [a, b, c] = gt.planets;

      for (const opp of oppositions) {
        const [x, y] = opp.between;

        let apex: PlanetItem['name'] | null = null;
        let tail: PlanetItem['name'] | null = null;

        if (x === a || x === b || x === c) {
          apex = x;
          tail = y;
        }

        if (y === a || y === b || y === c) {
          apex = y;
          tail = x;
        }

        if (!apex || !tail) continue;

        const others = [a, b, c].filter((p) => p !== apex);

        const hasSextile1 = sextiles.some(
          (s) => s.between.includes(tail) && s.between.includes(others[0])
        );

        const hasSextile2 = sextiles.some(
          (s) => s.between.includes(tail) && s.between.includes(others[1])
        );

        if (!hasSextile1 || !hasSextile2) continue;

        results.push({
          type: PatternType.Kite,
          apex,
          grandTrine: [a, b, c],
          opposition: [apex, tail],
          planets: [a, b, c, tail],
        });
      }
    }

    return this.deduplicate(results);
  }
  // 检测根据大三角检测风筝。大十字一定伴随着t三角
  private detectKiteBy(patterns: Pattern[]) {
    const result: {
      type: PatternType.Kite;
      apex: PlanetItem['name'];
      planets: PlanetItem['name'][];
      grandTrine: PlanetItem['name'][];
      opposition: [PlanetItem['name'], PlanetItem['name']];
    }[] = [];

    // aspect 查询工具
    const hasAspect = (a: PlanetItem['name'], b: PlanetItem['name'], type: Aspect) => {
      return this.aspects.some(
        (asp) =>
          asp.type === type &&
          ((asp.between[0] === a && asp.between[1] === b) ||
            (asp.between[0] === b && asp.between[1] === a))
      );
    };

    const grandTrines = patterns.filter((i) => i.type === PatternType.GrandTrine);

    // 所有出现过的行星
    const allPlanets = [...new Set(this.aspects.flatMap((a) => a.between))] as PlanetItem['name'][];

    for (const gt of grandTrines) {
      const trinePlanets = gt.planets;

      // 大三角中的每一个点都可能成为风筝轴点
      for (const apex of trinePlanets) {
        const others = trinePlanets.filter((p) => p !== apex) as [
          PlanetItem['name'],
          PlanetItem['name']
        ];

        for (const x of allPlanets) {
          // 外部点
          if (trinePlanets.includes(x)) continue;

          // 必须：
          // x opposition apex
          // x sextile 另外两个点

          if (
            hasAspect(x, apex, Aspect.Opposition) &&
            hasAspect(x, others[0], Aspect.Sextile) &&
            hasAspect(x, others[1], Aspect.Sextile)
          ) {
            result.push({
              type: PatternType.Kite,
              apex,
              planets: [...trinePlanets, x],
              grandTrine: [...trinePlanets],
              opposition: [apex, x],
            });
          }
        }
      }
    }

    return this.deduplicate(result);
  }

  // T 三角（T-Square）
  // 条件：两个对冲（180°）一个刑相（90°）连接其中一方
  private detectTSquare(): Pattern[] {
    const oppositions = this.aspects.filter((a) => a.type === Aspect.Opposition);
    const squares = this.aspects.filter((a) => a.type === Aspect.Square);

    const results: Pattern[] = [];

    for (const opp of oppositions) {
      const [a, b] = opp.between;

      const candidates = new Set<PlanetItem['name']>();

      for (const sq of squares) {
        const [x, y] = sq.between;

        if (x === a) candidates.add(y);
        if (y === a) candidates.add(x);
        if (x === b) candidates.add(y);
        if (y === b) candidates.add(x);
      }

      for (const c of candidates) {
        const hasAC = squares.some(
          (s) => s.type === Aspect.Square && s.between.includes(a) && s.between.includes(c)
        );

        const hasBC = squares.some(
          (s) => s.type === Aspect.Square && s.between.includes(b) && s.between.includes(c)
        );

        if (!hasAC || !hasBC) continue;

        results.push({
          type: PatternType.TSquare,
          planets: [a, b, c],
          apex: c,
          base: [a, b],
        });
      }
    }

    return this.deduplicate(results);
  }

  // 大十字（Grand Cross）
  // 条件：4个点 2组对冲 + 4个刑
  private detectGrandCross(): Pattern[] {
    const oppositions = this.aspects.filter((a) => a.type === Aspect.Opposition);

    const squares = this.aspects.filter((a) => a.type === Aspect.Square);

    const results: Pattern[] = [];

    for (let i = 0; i < oppositions.length; i++) {
      for (let j = i + 1; j < oppositions.length; j++) {
        const o1 = oppositions[i];
        const o2 = oppositions[j];

        const planets = [...o1.between, ...o2.between];

        const unique = [...new Set(planets)];

        if (unique.length !== 4) continue;

        const [a, b] = o1.between;
        const [c, d] = o2.between;

        const requiredSquares: [PlanetItem['name'], PlanetItem['name']][] = [
          [a, c],
          [a, d],
          [b, c],
          [b, d],
        ];

        const valid = requiredSquares.every(([p1, p2]) =>
          squares.some((s) => s.between.includes(p1) && s.between.includes(p2))
        );

        if (!valid) continue;

        results.push({
          type: PatternType.GrandCross,
          planets: unique,
        });
      }
    }

    return this.deduplicate(results);
  }
  // 检测根据 T 三角检测大十字。大十字一定伴随着t三角
  private detectGrandCrossBy(patterns: Pattern[]) {
    const result: {
      type: PatternType.GrandCross;
      planets: PlanetItem['name'][];
      tSquares: PlanetItem['name'][][];
    }[] = [];

    const hasAspect = (a: PlanetItem['name'], b: PlanetItem['name'], type: Aspect) =>
      this.aspects.some(
        (asp) =>
          asp.type === type &&
          ((asp.between[0] === a && asp.between[1] === b) ||
            (asp.between[0] === b && asp.between[1] === a))
      );

    const tSquares = patterns.filter((i) => i.type === PatternType.TSquare);

    for (let i = 0; i < tSquares.length; i++) {
      for (let j = i + 1; j < tSquares.length; j++) {
        const t1 = tSquares[i];
        const t2 = tSquares[j];

        // 必须：
        // 1. apex opposition
        // 2. 共用同一个 base opposition

        const sameBase = t1.base.includes(t2.base[0]) && t1.base.includes(t2.base[1]);

        if (!sameBase) continue;

        const apexOpposition = hasAspect(t1.apex, t2.apex, Aspect.Opposition);

        if (!apexOpposition) continue;

        // Grand Cross 四颗星
        const planets = [t1.apex, t2.apex, ...t1.base] as PlanetItem['name'][];

        // 再严格校验：
        // 必须存在：
        // 2 opposition
        // 4 square

        let oppositionCount = 0;
        let squareCount = 0;

        for (let a = 0; a < planets.length; a++) {
          for (let b = a + 1; b < planets.length; b++) {
            const p1 = planets[a];
            const p2 = planets[b];

            if (hasAspect(p1, p2, Aspect.Opposition)) {
              oppositionCount++;
            }

            if (hasAspect(p1, p2, Aspect.Square)) {
              squareCount++;
            }
          }
        }

        if (oppositionCount !== 2 || squareCount !== 4) {
          continue;
        }

        result.push({
          type: PatternType.GrandCross,
          planets,
          tSquares: [t1.planets, t2.planets],
        });
      }
    }

    return this.deduplicate(result);
  }

  // TODO 新增
  // Mystic Rectangle 神秘矩形
  // Conjunction Cluster（合相群）
  // Stellium（星群）

  // Yod（上帝之指）
  // 1 sextile（60°）
  // 2 quincunx（150°）
  // apex = 两个150°共同指向点
  private detectYod(): Pattern[] {
    const sextile = this.aspects.filter((a) => a.type === Aspect.Sextile);
    const quincunx = this.aspects.filter((a) => a.type === (Aspect as any).Quincunx);
    // 如果你没定义 Quincunx，需要补 enum

    const results: Pattern[] = [];

    for (const s of sextile) {
      const [a, b] = s.between;

      const candidates = new Set<PlanetItem['name']>();

      for (const q of quincunx) {
        const [x, y] = q.between;

        if (x === a) candidates.add(y);
        if (y === a) candidates.add(x);
        if (x === b) candidates.add(y);
        if (y === b) candidates.add(x);
      }

      for (const apex of candidates) {
        const hasA = quincunx.some((q) => q.between.includes(a) && q.between.includes(apex));

        const hasB = quincunx.some((q) => q.between.includes(b) && q.between.includes(apex));

        if (!hasA || !hasB) continue;

        results.push({
          type: PatternType.Yod,
          apex,
          base: [a, b],
          planets: [a, b, apex],
        });
      }
    }

    return this.deduplicate(results);
  }
}
