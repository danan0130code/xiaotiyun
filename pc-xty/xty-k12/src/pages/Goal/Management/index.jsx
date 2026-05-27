import { useNavigate, useLocation } from 'react-router-dom'
import { Tabs } from 'antd'
import StudentGoalManagement from './StudentGoalManagement'
import TeacherGoalManagement from './TeacherGoalManagement'

export default function GoalManagementPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const activeTab = searchParams.get('tab') || 'student'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, flex: '0 0 auto' }}>
        运动目标管理
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={key => navigate(`/goal/management?tab=${key}`, { replace: true })}
          items={[
            { key: 'student', label: '学生目标管理', children: <StudentGoalManagement /> },
            { key: 'teacher', label: '教师目标管理', children: <TeacherGoalManagement /> },
          ]}
          style={{ height: '100%' }}
          tabBarStyle={{ marginBottom: 0 }}
          destroyOnHidden
        />
      </div>
    </div>
  )
}
