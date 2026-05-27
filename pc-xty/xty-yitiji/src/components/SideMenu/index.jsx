import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { menuConfig } from '../../router'

export default function SideMenu({ topKey }) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentMenu = menuConfig.find(item => item.key === topKey)
  const items = currentMenu?.children?.map(child => ({ key: child.key, label: child.label })) || []
  const selectedKey = items.find(item => location.pathname === item.key || location.pathname.startsWith(`${item.key}/`))?.key

  return (
    <div className="side-menu-wrap">
      <Menu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : [location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
      />
    </div>
  )
}
