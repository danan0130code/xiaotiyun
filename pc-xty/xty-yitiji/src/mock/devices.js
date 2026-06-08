export const deviceTypes = [
  '一体机(1代)',
  '一体机(2代)',
  'AI体锻小站(1代)',
  'AI体锻小站(2代)',
  '智慧体育盒子',
  '体质测量设备',
  '体检一体机',
  '坐位体前屈',
  'LED大屏',
]

export const schoolOptions = [
  '红山农场学校',
  '校体云测试学校',
  '校体云测试学校3',
  '萧山区南阳小学',
  '萧山区金山小学',
  '萧山区新塘小学',
  '萧山区长沙小学',
  '扬州育才实验学校',
  '海康威视',
  '宁波市江北区洪塘中心小学',
  '郑州校信通',
]

const secondGenDevices = [
  {
    id: 'ytj2-001',
    name: '红山学校仰卧起坐',
    type: '一体机(2代)',
    schoolName: '红山农场学校',
    status: '在线',
    memoryUsage: '29.34%',
    cameraStatus: '顶部相机开启',
    enabledProjects: ['仰卧起坐（抱头）', '俯卧撑'],
    model: 'DS-K1T690M',
    serialNo: 'DS-K1T690M20230508V010504CHL28212800',
    deviceId: '156A02259BB7733EE3BEF8E20690379A35',
    activatedAt: '2023-06-30 12:12:59',
    lastHeartbeat: '2026-06-01 14:12:33',
  },
  {
    id: 'ytj2-002',
    name: '红山学校引体向上',
    type: '一体机(2代)',
    schoolName: '红山农场学校',
    status: '在线',
    memoryUsage: '29.87%',
    cameraStatus: '顶部相机开启',
    enabledProjects: ['引体向上'],
    model: 'DS-K1T691M-T',
    serialNo: 'DS-K1T691M-T20230425V010504CHK70745951',
    deviceId: '1511DF0FE919B8D9469F34E20690379A35',
    activatedAt: '2023-08-15 14:10:09',
    lastHeartbeat: '2026-06-01 14:10:07',
  },
  {
    id: 'ytj2-005',
    name: '红山学校跳绳机',
    type: '一体机(2代)',
    schoolName: '红山农场学校',
    status: '离线',
    memoryUsage: '52.19%',
    cameraStatus: '顶部相机开启',
    enabledProjects: ['跳绳'],
    model: 'DS-K1T691M',
    serialNo: 'DS-K1T691M20231226V010504CHK55730227',
    deviceId: '15ED284657C8F948D11E4AE20690379A35',
    activatedAt: '2024-04-24 11:49:53',
    lastHeartbeat: '2025-07-03 14:49:22',
  },
]

const typeSummaries = {
  '一体机(1代)': [
    {
      id: 'ytj1-001',
      name: '南阳小学坐位体前屈',
      type: '一体机(1代)',
      schoolName: '萧山区南阳小学',
      status: '在线',
      memoryUsage: '41.18%',
      cameraStatus: '顶部相机开启',
      enabledProjects: ['坐位体前屈'],
      model: 'DS-K1T680M',
      serialNo: 'DS-K1T680M20240222001',
      deviceId: '1400AABBCDD001',
      activatedAt: '2024-02-22 10:12:09',
      lastHeartbeat: '2026-05-27 09:42:10',
    },
  ],
  '一体机(2代)': secondGenDevices,
  'AI体锻小站(1代)': [],
  'AI体锻小站(2代)': [],
  智慧体育盒子: [
    {
      id: 'box-001',
      name: '扬州育才智慧体育盒子',
      type: '智慧体育盒子',
      schoolName: '扬州育才实验学校',
      status: '外接设备连接异常',
      memoryUsage: '63.02%',
      cameraStatus: '外接相机异常',
      enabledProjects: ['阳光跑', '50米跑'],
      model: 'RK3588-BOX',
      serialNo: 'BOX20240511001',
      deviceId: 'BOXA0192837465',
      activatedAt: '2024-05-11 15:21:08',
      lastHeartbeat: '2026-05-26 18:05:20',
    },
  ],
  体质测量设备: [],
  体检一体机: [],
  坐位体前屈: [],
  LED大屏: [],
}

export const devicesByType = typeSummaries

export const statusOptions = ['全部', '在线', '离线', '外接设备连接异常']

export const maintenanceLogs = [
  { time: '2026-05-27 09:30:12', action: '获取日志', operator: '超管', result: '已生成下载任务' },
  { time: '2026-05-26 18:12:45', action: '学生信息同步', operator: '系统', result: '同步完成' },
  { time: '2026-05-24 10:08:31', action: '固件检查', operator: '超管', result: '当前已是最新版本' },
]
