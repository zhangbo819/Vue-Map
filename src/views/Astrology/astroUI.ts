// Element
enum EL {
  Fire = "Fire",
  Earth = "Earth",
  Air = "Air",
  Water = "Water",
}

const eColors = {
  [EL.Fire]: "#FF5A5F", // 火：橙红（行动/能量）
  [EL.Earth]: "#C2B280", // 土：橄榄绿（稳定/现实）
  [EL.Air]: "#7BAFD4", // 风：清蓝（思维/交流）
  [EL.Water]: "#4A6CF7", // 水：靛紫（情绪/直觉）
};

export const planentsMap: Record<
  string,
  { name: string; n?: string; color: string }
> = {
  Sun: { name: "太阳", n: "日", color: eColors[EL.Fire] }, // 红色（太阳）
  Moon: { name: "月亮", color: eColors[EL.Water] }, // 月光蓝（情绪/柔和）
  Mercury: { name: "水星", color: eColors[EL.Air] }, // 青绿色（思维/流动）
  Venus: { name: "金星", color: eColors[EL.Air] }, // 粉玫瑰（爱/美感）
  Mars: { name: "火星", color: eColors[EL.Fire] }, // 火红（行动力）
  Jupiter: { name: "木星", color: eColors[EL.Fire] }, // 紫色（扩张/幸运）
  Saturn: { name: "土星", color: eColors[EL.Earth] }, // 深灰蓝（结构/限制）
  Uranus: { name: "天王星", color: eColors[EL.Earth] }, // 电光青（变革）
  Neptune: { name: "海王星", color: eColors[EL.Water] }, // 深海蓝（幻想/灵性）
  Pluto: { name: "冥王星", color: eColors[EL.Water] }, // 深紫（转化/深层力量）
};

export const map12: Record<
  string,
  { name: string; n: string; icon: string; color: string }
> = {
  Aries: { name: "白羊座", n: "羊", icon: "♈", color: eColors[EL.Fire] },
  Taurus: { name: "金牛座", n: "牛", icon: "♉", color: eColors[EL.Earth] },
  Gemini: { name: "双子座", n: "双", icon: "♊", color: eColors[EL.Air] },
  Cancer: { name: "巨蟹座", n: "蟹", icon: "♋", color: eColors[EL.Water] },
  Leo: { name: "狮子座", n: "狮", icon: "♌", color: eColors[EL.Fire] },
  Virgo: { name: "处女座", n: "处", icon: "♍", color: eColors[EL.Earth] },
  Libra: { name: "天秤座", n: "秤", icon: "♎", color: eColors[EL.Air] },
  Scorpio: { name: "天蝎座", n: "蝎", icon: "♏", color: eColors[EL.Water] },
  Sagittarius: { name: "射手座", n: "射", icon: "♐", color: eColors[EL.Fire] },
  Capricorn: { name: "摩羯座", n: "摩", icon: "♑", color: eColors[EL.Earth] },
  Aquarius: { name: "水瓶座", n: "瓶", icon: "♒", color: eColors[EL.Air] },
  Pisces: { name: "双鱼座", n: "鱼", icon: "♓", color: eColors[EL.Water] },
};

export const title12 = [
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
