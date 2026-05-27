export const menuConfig = [
  {
    key: 'operations',
    label: '运维管理',
    children: [
      { key: '/operations/device', label: '设备列表' },
      { key: '/operations/master-device', label: '主控设备管理' },
      { key: '/operations/firmware', label: '固件包管理' },
      { key: '/operations/settings', label: '通用设置' },
    ],
  },
  {
    key: 'users',
    label: '用户管理',
    path: '/users',
  },
  {
    key: 'menus',
    label: '菜单管理',
    path: '/menus',
  },
]

export function getTopKeyByPath(pathname) {
  for (const item of menuConfig) {
    if (item.path === pathname) return item.key
    if (item.children) {
      for (const child of item.children) {
        if (child.key === pathname || pathname.startsWith(child.key + '/')) return item.key
      }
    }
  }
  return 'operations'
}
