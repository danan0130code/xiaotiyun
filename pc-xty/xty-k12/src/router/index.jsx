// 菜单配置：顶部一级 + 左侧二级
export const menuConfig = [
  {
    key: 'basic',
    label: '基础管理',
    children: [
      { key: '/basic/school', label: '学校管理' },
      { key: '/basic/student', label: '学生管理' },
      { key: '/basic/teacher', label: '教师管理' },
      { key: '/basic/class', label: '班级管理' },
      { key: '/basic/semester', label: '学期管理' },
      { key: '/basic/scoring', label: '评分标准管理' },
      { key: '/basic/device', label: '设备管理' },
      { key: '/basic/ops', label: '运维管理' },
      { key: '/basic/permission', label: '权限管理' },
    ],
  },
  {
    key: 'teaching',
    label: '教学管理',
    children: [
      { key: '/teaching/class-training', label: '随堂训练' },
      { key: '/teaching/cross-training', label: '串班训练' },
      { key: '/teaching/smart-classroom', label: '智慧课堂' },
      { key: '/teaching/resource', label: '教学资源' },
      { key: '/teaching/homework', label: '课后作业' },
      { key: '/teaching/rope-skipping', label: '跳绳管理' },
    ],
  },
  {
    key: 'physical',
    label: '体质测试',
    children: [
      { key: '/physical/district', label: '区级体测' },
      { key: '/physical/school', label: '校级体测' },
      { key: '/physical/settings', label: '体测设置' },
    ],
  },
  {
    key: 'sunrun',
    label: '阳光跑管理',
    children: [
      { key: '/sunrun/tasks', label: '阳光跑任务' },
      { key: '/sunrun/scores', label: '阳光跑成绩' },
      { key: '/sunrun/rules', label: '阳光跑规则设置' },
    ],
  },
  {
    key: 'goal',
    label: '运动目标',
    children: [
      { key: '/goal/management', label: '运动目标管理' },
      { key: '/goal/statistics', label: '运动目标统计' },
    ],
  },
  {
    key: 'sports',
    label: '学生运动数据',
    children: [
      { key: '/sports/records', label: '学生运动记录' },
      { key: '/sports/score-reports', label: '成绩举报管理' },
      { key: '/sports/activities', label: '学校活动' },
      { key: '/sports/exercise', label: '自由锻炼' },
      { key: '/sports/coins', label: '金币系统' },
    ],
  },
  {
    key: 'dashboard',
    label: '驾驶舱',
    path: '/dashboard',
  },
]

// 根据路径查找所属的顶部菜单 key
export function getTopKeyByPath(pathname) {
  for (const item of menuConfig) {
    if (item.path === pathname) return item.key
    if (item.children) {
      for (const child of item.children) {
        if (child.key === pathname || pathname.startsWith(child.key + '/')) return item.key
      }
    }
  }
  return 'dashboard'
}
