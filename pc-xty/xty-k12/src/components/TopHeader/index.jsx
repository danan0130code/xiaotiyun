import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { menuConfig, getTopKeyByPath } from '../../router'

export default function TopHeader({ activeKey, onChange }) {
  const navigate = useNavigate()
  const location = useLocation()

  // 从 URL 推导当前活跃的顶部菜单
  const derivedKey = getTopKeyByPath(location.pathname)
  const currentKey = activeKey || derivedKey || 'dashboard'

  const items = menuConfig.map(item => ({
    key: item.key,
    label: item.label,
  }))

  const handleClick = ({ key }) => {
    const menu = menuConfig.find(item => item.key === key)
    if (!menu) return

    // 驾驶舱直接跳转
    if (menu.path) {
      navigate(menu.path)
      if (onChange) onChange(key)
      return
    }

    // 有子菜单：通知父组件切换左侧菜单，并跳转到第一个子页面
    if (onChange) onChange(key)
    if (menu.children && menu.children.length > 0) {
      navigate(menu.children[0].key)
    }
  }

  return (
    <div className="xty-top-header" style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: 56 }}>
      <div style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1677ff',
        marginRight: 32,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      }} onClick={() => { navigate('/dashboard'); if (onChange) onChange('dashboard') }}>
        校体云-中小学平台
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[currentKey]}
        items={items}
        onClick={handleClick}
        style={{ flex: 1, minWidth: 0, borderBottom: 'none' }}
      />
    </div>
  )
}
