export const remoteDevicesState = {
  'ytj1-001': {
    onlineStatus: '在线',
    busyReason: '',
    maintenanceOwner: '',
    lastSnapshot: '2026-06-01 10:28:42',
    cameras: [
      { id: 'cam-top', name: '顶部相机', status: '在线', resolution: '1920 x 1080', lastOnlineAt: '2026-06-01 10:30:12', lastConfiguredAt: '2026-06-01 10:26:38' },
      { id: 'cam-face', name: '人脸抓拍相机', status: '在线', resolution: '1280 x 720', lastOnlineAt: '2026-06-01 10:29:58', lastConfiguredAt: '2026-05-31 16:12:20' },
    ],
  },
  'ytj2-001': {
    onlineStatus: '在线',
    busyReason: '',
    maintenanceOwner: '',
    lastSnapshot: '2026-06-01 14:12:33',
    cameras: [
      { id: 'cam-top', name: '顶部相机', status: '在线', resolution: '1920 x 1080', lastOnlineAt: '2026-06-01 14:12:33', lastConfiguredAt: '2026-06-01 13:58:09' },
      { id: 'cam-side', name: '侧向相机', status: '在线', resolution: '1280 x 720', lastOnlineAt: '2026-06-01 14:12:05', lastConfiguredAt: '2026-05-31 16:42:18' },
    ],
  },
  'ytj2-002': {
    onlineStatus: '在线',
    busyReason: '运动中',
    maintenanceOwner: '',
    lastSnapshot: '2026-06-01 09:44:21',
    cameras: [
      { id: 'cam-top', name: '顶部相机', status: '在线', resolution: '1920 x 1080', lastOnlineAt: '2026-06-01 09:46:03', lastConfiguredAt: '2026-05-30 17:20:11' },
    ],
  },
  'ytj2-003': {
    onlineStatus: '在线',
    busyReason: '',
    maintenanceOwner: '实施工程师-王磊',
    lastSnapshot: '2026-06-01 09:10:20',
    cameras: [
      { id: 'cam-track', name: '终点相机', status: '在线', resolution: '1920 x 1080', lastOnlineAt: '2026-06-01 09:12:06', lastConfiguredAt: '2026-06-01 08:52:06' },
    ],
  },
  'ytj2-006': {
    onlineStatus: '在线',
    busyReason: '',
    maintenanceOwner: '',
    lastSnapshot: '2026-06-01 14:06:37',
    cameras: [
      { id: 'cam-top', name: '顶部相机', status: '在线', resolution: '1920 x 1080', lastOnlineAt: '2026-06-01 14:06:37', lastConfiguredAt: '2026-06-01 13:42:16' },
      { id: 'cam-side', name: '侧向相机', status: '在线', resolution: '1920 x 1080', lastOnlineAt: '2026-06-01 14:06:12', lastConfiguredAt: '2026-05-29 11:24:53' },
    ],
  },
  default: {
    onlineStatus: '在线',
    busyReason: '',
    maintenanceOwner: '',
    lastSnapshot: '2026-06-01 10:12:36',
    cameras: [
      { id: 'cam-top', name: '顶部相机', status: '在线', resolution: '1920 x 1080', lastOnlineAt: '2026-06-01 10:13:22', lastConfiguredAt: '2026-06-01 09:55:18' },
      { id: 'cam-side', name: '侧向相机', status: '在线', resolution: '1920 x 1080', lastOnlineAt: '2026-06-01 10:13:05', lastConfiguredAt: '2026-05-30 15:08:42' },
    ],
  },
}

export const sportProjectRules = {
  引体向上: {
    modes: ['单人', '双人'],
    drawingTools: ['检测区域', '参考框', '人脸识别区域', 'A/B 区域'],
    standardParams: ['下颚过杆', '直臂检测'],
    violationParams: ['脚接触立杆', '脚接触地面', '手离杆', '疑似作弊行为', '瞳距过滤'],
  },
  俯卧撑: {
    modes: ['单人', '双人'],
    drawingTools: ['检测区域', '参考线', 'A/B 区域', 'A/B 参考线'],
    standardParams: ['最低点', '双手臂支撑', '身体直线'],
    violationParams: ['趴地', '趴地时间', '瞳距过滤'],
  },
  '仰卧起坐（抱头）': {
    modes: ['单人', '双人'],
    drawingTools: ['检测区域', '参考线', 'A/B 区域', 'A/B 参考线'],
    standardParams: ['背触垫子', '坐起'],
    violationParams: ['双膝未弯曲', '未抱头', '未抱头等级', '臀部离垫', '躺地', '躺地时间', '瞳距过滤'],
  },
  跳绳: {
    modes: ['单人', '双人', '多人'],
    drawingTools: ['检测区域', '多人区域 1', '多人区域 2', '多人区域 3', '多人区域 4', '多人区域 5'],
    standardParams: ['定时配置开关', '定时周期'],
    violationParams: ['瞳距过滤'],
  },
  立定跳远: {
    modes: ['单人'],
    drawingTools: ['起跳区域', '运动区域', '落地区域', '起跳方向线'],
    standardParams: ['起跳方向', '落点识别'],
    violationParams: ['疑似作弊行为', '瞳距过滤'],
  },
  短跑: {
    modes: ['起点', '终点'],
    drawingTools: ['跑道区域', '跑道线', '起点线', '终点线'],
    standardParams: ['相机模式', '相机安装模式', '跑道数量', '轨迹叠加'],
    violationParams: ['轨迹延时时间', '串道持续时间', '瞳距过滤'],
  },
  长跑: {
    modes: ['终点'],
    drawingTools: ['跑道区域', '跑道线', '终点线'],
    standardParams: ['相机模式', '跑道数量', '轨迹叠加'],
    violationParams: ['轨迹延时时间', '瞳距过滤'],
  },
  实心球: {
    modes: ['单人'],
    drawingTools: ['运动区域', '参考线'],
    standardParams: ['运动区域总长', '分值线间隔', '参考线生成方向'],
    violationParams: ['瞳距过滤'],
  },
  手势识别: {
    modes: ['全画面识别'],
    drawingTools: ['全画面识别'],
    standardParams: ['左手侧平举', '右手侧平举', '双手侧平举', '双手胸前交叉', '举手'],
    violationParams: ['瞳距过滤'],
  },
  互动游戏: {
    modes: ['区域识别'],
    drawingTools: ['检测区域'],
    standardParams: ['互动区域'],
    violationParams: ['瞳距过滤'],
  },
}

export const sportProjectOptions = Object.keys(sportProjectRules)

export const faceCaptureConfig = {
  minPupilDistance: 32,
  maxPupilDistance: 180,
  overlays: [
    { label: '码流叠加智能信息', enabled: true },
    { label: '报警抓图叠加目标信息', enabled: true },
    { label: '背景图片设置', type: 'group' },
    { label: '背景图片上传', enabled: false },
    { label: '人脸图片', enabled: true },
    { label: '图像质量', type: 'select', value: '一般', options: ['最好', '较好', '一般'] },
    { label: '图片分辨率', type: 'select', value: '2560*1440', options: ['720P(1280*720)', '1080P(1920*1080)', '2560*1440'] },
    { label: '目标图片设置', type: 'group' },
    { label: '图片类型', type: 'radio', value: '自定义', options: ['自定义', '大头照', '半身照', '全身照'] },
    { label: '宽度', type: 'number', prefix: '人脸宽度 x', value: 1.8, min: 0.1, max: 10, step: 0.1 },
    { label: '人脸部分高度', type: 'number', prefix: '人脸高度 x', value: 1.8, min: 0.1, max: 10, step: 0.1 },
    { label: '身体部分高度', type: 'number', prefix: '人脸高度 x', value: 0.5, min: 0.1, max: 10, step: 0.1 },
    { label: '固定像素', enabled: false },
    { label: '图片高度', type: 'number', value: 100, min: 1, max: 9999, suffix: '像素' },
    { label: '图片字符叠加', type: 'transfer', available: ['设备编号', '通道信息'], selected: ['抓拍时间', '卫星定位信息'] },
  ],
  advanced: [
    { label: '人脸抓拍算法库版本', value: 'V2.5.1 build230630' },
    { label: '抓拍参数', type: 'group' },
    { label: '人脸抓拍模式', type: 'radio', value: '快速抓拍', options: ['最佳抓拍', '快速抓拍'] },
    { label: '快速抓拍阈值', type: 'slider', value: 70, min: 0, max: 100 },
    { label: '最长抓拍时间', type: 'number', value: 5, min: 1, max: 60, suffix: '秒' },
    { label: '抓拍次数', type: 'captureCount', value: '有限次', count: 3, options: ['无限次', '有限次'] },
    { label: '人脸曝光', enabled: false },
    { label: '参考亮度', type: 'slider', value: 50, min: 0, max: 100 },
    { label: '最短持续时间', type: 'number', value: 10, min: 1, max: 60, suffix: '分钟' },
    { label: '人脸姿态过滤', enabled: false },
    { label: '左右角度-左', type: 'slider', value: 70, min: 0, max: 90, suffix: '°' },
    { label: '左右角度-右', type: 'slider', value: 70, min: 0, max: 90, suffix: '°' },
    { label: '俯仰角度-上', type: 'slider', value: 50, min: 0, max: 90, suffix: '°' },
    { label: '俯仰角度-下', type: 'slider', value: 50, min: 0, max: 90, suffix: '°' },
    { label: '上传属性值', enabled: false },
    { label: '活体检测', enabled: false },
  ],
}

export const imageDisplayConfig = {
  packages: ['普通', '背光', '顺光', '低照度', '自定义1', '自定义2'],
  groups: [
    {
      name: '图像调节',
      fields: [
        { type: 'slider', label: '亮度', value: 50 },
        { type: 'slider', label: '对比度', value: 50 },
        { type: 'slider', label: '饱和度', value: 50 },
        { type: 'slider', label: '锐度', value: 50 },
      ],
    },
    {
      name: '曝光',
      fields: [
        { type: 'select', label: '光圈类型', value: '自动', options: ['自动', '固定', '通用P-iris'] },
        { type: 'slider', label: '自动光圈灵敏度', value: 50 },
        {
          type: 'select',
          label: '曝光时间',
          value: '1/100',
          options: ['1', '1/3', '1/6', '1/12', '1/25', '1/50', '1/75', '1/100', '1/125', '1/150', '1/175', '1/200', '1/225', '1/250', '1/300', '1/400', '1/500', '1/750', '1/1000', '1/2000', '1/4000', '1/10000', '1/100000'],
        },
        { type: 'tip', text: '请将曝光时间设置小于1/25（N制下小于1/30），以免影响智能应用效果。' },
        { type: 'slider', label: '增益', value: 60 },
      ],
    },
    {
      name: '聚焦',
      fields: [
        { type: 'select', label: '聚焦模式', value: '手动', options: ['自动', '半自动', '手动'] },
      ],
    },
    {
      name: '日夜转换',
      fields: [
        { type: 'select', label: '日夜转换', value: '白天', options: ['白天', '夜晚', '自动', '定时切换', '报警输入触发'] },
      ],
    },
    {
      name: '补光灯',
      fields: [
        { type: 'switch', label: '防补光过曝', value: false },
        { type: 'select', label: '补光灯模式', value: '白光模式', options: ['关闭', '白光模式', '混合补光', '红外补光'] },
        { type: 'select', label: '亮度调节模式', value: '自动', options: ['自动', '手动'] },
        { type: 'tag', label: '白光灯' },
        { type: 'slider', label: '远光灯亮度', value: 50 },
        { type: 'slider', label: '近光灯亮度', value: 50 },
      ],
    },
    {
      name: '背光',
      fields: [
        { type: 'select', label: '背光补偿区域', value: '关闭', options: ['关闭', '上', '下', '左', '右', '中心', '自定义', '自动'] },
        { type: 'select', label: '宽动态', value: '关闭', options: ['关闭', '开启', '自动'] },
        { type: 'select', label: '强光抑制', value: '关闭', options: ['开启', '关闭'] },
      ],
    },
    {
      name: '白平衡',
      fields: [
        { type: 'select', label: '白平衡', value: '自动白平衡（宽）', options: ['手动白平衡', '自动白平衡（宽）', '自动白平衡（窄）', '锁定白平衡', '日光灯', '白炽灯', '暖光灯', '自然光'] },
      ],
    },
    {
      name: '降噪',
      fields: [
        { type: 'radio', label: '降噪模式', value: '普通模式', options: ['关闭', '普通模式', '专家模式'] },
        { type: 'slider', label: '降噪等级', value: 50 },
      ],
    },
    {
      name: '透雾',
      fields: [
        { type: 'radio', label: '透雾模式', value: '关闭', options: ['关闭', '自动', '开启'] },
      ],
    },
    {
      name: '防抖',
      fields: [
        { type: 'switch', label: '电子防抖', value: false },
      ],
    },
    {
      name: '视频调整',
      fields: [
        { type: 'radio', label: '镜像', value: '关闭', options: ['关闭', '中心', '左右', '上下'] },
        { type: 'select', label: '场景模式', value: '室外', options: ['室外', '室内'] },
        { type: 'select', label: '视频制式', value: 'PAL(50HZ)', options: ['PAL(50HZ)', 'NTSC(60HZ)'] },
        { type: 'switch', label: '镜头畸变校正', value: true },
      ],
    },
    {
      name: '其他',
      fields: [
        { type: 'select', label: '本地输出', value: '开启', options: ['开启', '关闭'] },
      ],
    },
  ],
}

export const mockCommandLogs = [
  { time: '10:30:12', command: '连接/心跳', status: '成功', result: 'WebSocket 在线' },
  { time: '10:30:18', command: '设备状态查询', status: '成功', result: '在线且空闲' },
  { time: '10:30:20', command: '开始远程维护', status: '成功', result: '进入远程维护模式' },
]

export const mockConfigRecords = [
  { time: '2026-06-01 10:26:38', mode: '体育锻炼模式', target: '顶部相机 / 引体向上', operator: '超管' },
  { time: '2026-05-31 16:12:20', mode: '人脸抓拍模式', target: '人脸抓拍相机', operator: '实施工程师' },
]
