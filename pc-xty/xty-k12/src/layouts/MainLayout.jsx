import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Layout } from 'antd'
import TopHeader from '../components/TopHeader'
import SideMenu from '../components/SideMenu'
import { getTopKeyByPath } from '../router'

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  const location = useLocation()
  const [activeTopKey, setActiveTopKey] = useState('dashboard')

  // URL 变化时同步顶部菜单状态
  useEffect(() => {
    const topKey = getTopKeyByPath(location.pathname)
    if (topKey) setActiveTopKey(topKey)
  }, [location.pathname])

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Header style={{ height: 56, padding: 0, flex: '0 0 56px' }}>
        <TopHeader activeKey={activeTopKey} onChange={setActiveTopKey} />
      </Header>
      <Layout style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <Sider 
          width={200} 
          style={{ background: '#fff', flex: '0 0 200px' }}
        >
          <SideMenu topKey={activeTopKey} />
        </Sider>
        <Content
          style={{
            flex: 1,
            padding: 24,
            background: '#f5f5f5',
            overflow: 'hidden',
            minHeight: 0,
            display: 'flex',
          }}
        >
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
