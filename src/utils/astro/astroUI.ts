import { BodyInUse } from "./constant";

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
  BodyInUse,
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

export const planetTexts: Record<
  BodyInUse,
  {
    short: string;
    long: string;
  }
> = {
  Sun: {
    short: "核心自我、意志、人生方向",
    long: "太阳代表你的核心人格与自我意识，是你主动想成为的样子。它象征生命力、创造力以及人生的主线方向，你如何表达自我、做决定以及追求成就，都与太阳密切相关。",
  },
  Moon: {
    short: "情绪、本能、安全感来源",
    long: "月亮代表你的情绪反应与潜意识，是你最自然、不加防备的一面。它关联安全感、依赖模式以及内在需求，反映你在压力下的真实反应，以及你如何被照顾与如何照顾他人。",
  },
  Mercury: {
    short: "思维、沟通、学习方式",
    long: "水星掌管思考、表达与信息处理方式。它决定你如何学习、分析问题以及与他人沟通交流，也体现你的语言风格、逻辑能力和对细节的关注程度。",
  },
  Venus: {
    short: "关系、审美、价值与吸引力",
    long: "金星象征爱与连接，反映你如何建立关系、表达情感以及欣赏美。它也代表你的价值观和吸引力，揭示你喜欢什么样的人、如何相处以及在关系中追求的体验。",
  },
  Mars: {
    short: "行动力、欲望、冲突与驱动力",
    long: "火星代表行动与欲望，是推动你前进的原始动力。它体现你的竞争方式、愤怒表达以及面对挑战时的反应，也关系到你的执行力与冲突处理方式。",
  },
  Jupiter: {
    short: "扩张、机遇、信念与成长",
    long: "木星象征扩展与成长，代表机遇、信念以及对意义的追寻。它显示你在哪些领域容易获得发展与好运，以及你如何理解世界、建立价值体系。",
  },
  Saturn: {
    short: "限制、责任、结构与课题",
    long: "土星代表现实的限制与责任，是人生中的考验与结构来源。它揭示你需要面对的挑战、建立的边界以及通过努力获得的长期成果，也是成熟与稳定的关键。",
  },
  Uranus: {
    short: "变化、独立、突破与觉醒",
    long: "天王星象征突变与创新，代表你追求自由与独立的方式。它带来打破常规的冲动、意外变化以及觉醒的契机，推动你走出旧有模式。",
  },
  Neptune: {
    short: "理想、直觉、模糊与想象",
    long: "海王星代表理想与感知的边界，关联直觉、想象力与精神层面。它既能带来灵感与共情，也可能导致迷茫、逃避或过度理想化。",
  },
  Pluto: {
    short: "转化、控制、深层力量与重生",
    long: "冥王星象征深层的转化与重生力量，关联控制、极端经验以及心理深处的变化。它推动你经历彻底的改变，从而获得更强的内在力量。",
  },
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
