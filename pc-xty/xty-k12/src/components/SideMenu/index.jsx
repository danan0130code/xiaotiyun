import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { menuConfig } from '../../router'

export default function SideMenu({ topKey }) {
  const navigate = useNavigate()
  const location = useLocation()

  const currentMenu = menuConfig.find(item => item.key === topKey)
  const children = currentMenu?.children || []

  const items = children.map(child => ({
    key: child.key,
    label: child.label,
  }))

  const handleClick = ({ key }) => {
    navigate(key)
  }

  // 驾驶舱没有子菜单
  if (items.length === 0) return null

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        fontSize: 14,
        fontWeight: 500,
        color: '#333',
        borderBottom: '1px solid #f0f0f0',
        flex: '0 0 48px',
      }}>
        {currentMenu?.label}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={handleClick}
        />
      </div>
    </div>
  )
}
