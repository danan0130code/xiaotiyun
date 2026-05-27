import { BellOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Space } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { getTopKeyByPath, menuConfig } from '../../router'

export default function TopHeader({ activeKey, onChange }) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentKey = activeKey || getTopKeyByPath(location.pathname)

  const handleClick = ({ key }) => {
    const target = menuConfig.find(item => item.key === key)
    if (!target) return
    onChange?.(key)
    if (target.path) {
      navigate(target.path)
      return
    }
    if (target.children?.length) {
      navigate(target.children[0].key)
    }
  }

  return (
    <div className="top-header">
      <div className="top-brand" onClick={() => navigate('/operations/device')}>
        <div className="top-brand-mark">AI</div>
        <div className="top-brand-title">AI体育设备运维管理平台</div>
      </div>
      <div className="top-menu">
        {menuConfig.map(item => (
          <button
            key={item.key}
            className={`top-menu-item${item.key === currentKey ? ' is-active' : ''}`}
            type="button"
            onClick={() => handleClick({ key: item.key })}
          >
            {item.label}
          </button>
        ))}
      </div>
      <Space size={8} className="top-actions">
        <Button type="text" icon={<BellOutlined />} />
        <Button type="text" icon={<SettingOutlined />} />
        <Avatar size={28} icon={<UserOutlined />} />
        <span className="top-user-name">超管</span>
      </Space>
    </div>
  )
}
