export enum AstrologyEventType {
  Pattern = 'pattern', // 几何格局
  Cycle = 'cycle', // 周期事件
  Ingress = 'ingress', // 行星换座
  Discovery = 'discovery', // 行星发现
  Historical = 'historical', // 历史事件
  Eclipse = 'eclipse', // 食相
  Symbolic = 'symbolic', // 象征性节点
}

export interface AstrologyEvent {
  name: string;
  time: string;
  description: string;
}

export interface AstrologyEventGroup {
  type: AstrologyEventType;
  data: AstrologyEvent[];
}

export const astrologyEvents: AstrologyEventGroup[] = [
  {
    type: AstrologyEventType.Discovery,
    data: [
      {
        name: '海王星发现',
        time: '1846-09-23T00:00:00Z',
        description: '现代意识与潜意识占星的重要起点',
      },
      {
        name: '冥王星发现',
        time: '1930-02-18T00:00:00Z',
        description: '现代冥王主题进入集体视野',
      },
    ],
  },

  {
    type: AstrologyEventType.Pattern,
    data: [
      {
        name: '七行星聚集',
        time: '1962-02-05T14:00:00Z',
        description: '经典水瓶群星结构',
      },
      {
        name: '双大十字',
        time: '2010-08-07T00:00:00Z',
        description: '高张力多轴结构',
      },
      {
        name: '水象大三角',
        time: '2013-07-17T18:00:00Z',
        description: '木星、土星、海王形成经典水象大三角',
      },
      {
        name: '多重格局叠加',
        time: '2013-07-29T04:30:00Z',
        description: '2风筝、3大三角、2T三角同时存在',
      },
      {
        name: '红色大十字',
        time: '2014-04-23T18:00:00Z',
        description: '经典本位宫大十字',
      },
      {
        name: '固定宫T三角',
        time: '2021-06-14T10:00:00Z',
        description: '土星、天王、火星形成固定宫T三角',
      },
    ],
  },

  {
    type: AstrologyEventType.Cycle,
    data: [
      {
        name: '土天海三重结构',
        time: '1989-11-09T18:53:00Z',
        description: '柏林墙时期的重要结构节点',
      },
      {
        name: '土冥合',
        time: '2020-01-12T16:59:00Z',
        description: '全球结构重组的重要周期节点',
      },
      {
        name: '木土大合（水瓶0°）',
        time: '2020-12-21T18:20:00Z',
        description: '风元素时代的重要周期节点',
      },
    ],
  },

  {
    type: AstrologyEventType.Ingress,
    data: [
      {
        name: '冥王星进入摩羯',
        time: '2008-01-26T19:32:00Z',
        description: '平台资本与结构化权力时代开启',
      },
      {
        name: '海王星进入双鱼',
        time: '2012-02-03T13:04:00Z',
        description: '虚拟化、沉浸化与集体意识周期强化',
      },
      {
        name: '天王星进入金牛',
        time: '2018-05-15T15:16:00Z',
        description: '数字资产、能源与现实结构重组',
      },
      {
        name: '冥王星首次进入水瓶',
        time: '2023-03-23T09:13:00Z',
        description: 'AI、网络与群体结构时代强化',
      },
      {
        name: '海王星进入白羊',
        time: '2025-03-30T11:00:00Z',
        description: '新时代意识周期的重要开端',
      },
    ],
  },

  {
    type: AstrologyEventType.Historical,
    data: [
      {
        name: '911事件',
        time: '2001-09-11T12:46:00Z',
        description: '全球结构与安全叙事的重要转折点',
      },
      {
        name: 'ChatGPT发布',
        time: '2022-11-30T18:00:00Z',
        description: 'AI语言模型时代的重要象征节点',
      },
    ],
  },

  {
    type: AstrologyEventType.Eclipse,
    data: [
      {
        name: '北美白羊日食',
        time: '2024-04-08T18:18:00Z',
        description: '白羊轴线的重要日食事件',
      },
    ],
  },

  {
    type: AstrologyEventType.Symbolic,
    data: [
      {
        name: '2012冬至节点',
        time: '2012-12-21T11:11:00Z',
        description: '集体意识转向的象征性时间节点',
      },
    ],
  },
];
