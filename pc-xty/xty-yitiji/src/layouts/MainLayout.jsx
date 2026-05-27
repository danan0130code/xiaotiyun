import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import TopHeader from '../components/TopHeader'
import { getTopKeyByPath } from '../router'

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  const location = useLocation()
  const activeTopKey = getTopKeyByPath(location.pathname)
  const hasSideMenu = activeTopKey === 'operations'

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <TopHeader activeKey={activeTopKey} />
      </Header>
      <Layout className="app-body">
        {hasSideMenu && (
          <Sider width={208} className="app-sider">
            <SideMenu topKey={activeTopKey} />
          </Sider>
        )}
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
