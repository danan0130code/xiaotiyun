import { useState, useMemo } from 'react'
import { Table, Tag, Input, Select, Button, Space, DatePicker, Popconfirm, message } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import {
  generateStudentGoalList, STUDENT_GOAL_TYPES, SPORT_MODES, GOAL_STATUS,
  applyFilters, SCHOOLS,
} from '../../../mock/goalList'
import CreateGoalWizard from './CreateGoalWizard'

// 小环形图组件
function RingChart({ rate }) {
  if (rate === null || rate === undefined) return <span style={{ color: '#8c8c8c' }}>--</span>
  const r = 14
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - rate / 100)
  return (
    <svg width={40} height={40} viewBox="0 0 40 40">
      <circle cx={20} cy={20} r={r} fill="none" stroke="#f0f0f0" strokeWidth={4} />
      <circle cx={20} cy={20} r={r} fill="none" stroke={rate >= 60 ? '#1677ff' : '#ff4d4f'} strokeWidth={4}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 20 20)" />
      <text x={20} y={24} textAnchor="middle" fontSize={10} fill="#333">{rate}%</text>
    </svg>
  )
}

export default function StudentGoalManagement() {
  const navigate = useNavigate()
  const [allData] = useState(() => generateStudentGoalList(30))
  const [filters, setFilters] = useState({
    school: undefined,
    goalType: [],
    sportMode: [],
    status: ['pending', 'active'],
    keyword: '',
    dateRange: null,
  })
  const [wizardOpen, setWizardOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const filtered = useMemo(() => applyFilters(allData, filters), [allData, filters])

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const resetFilters = () => setFilters({ school: undefined, goalType: [], sportMode: [], status: ['pending', 'active'], keyword: '', dateRange: null })

  const columns = [
    {
      title: '目标名称', dataIndex: 'name', key: 'name', width: 120,
      render: (text, record) => (
        <a onClick={() => navigate(`/goal/management/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '目标类型', dataIndex: 'goalTargetLabel', key: 'goalTargetType', width: 90,
      render: (label, record) => <Tag color={record.goalTargetColor}>{label}</Tag>,
      sorter: (a, b) => a.goalTargetType.localeCompare(b.goalTargetType),
    },
    {
      title: '周期类型', dataIndex: 'cycleTypeLabel', key: 'cycleType', width: 85,
      render: (label, record) => <Tag color={record.cycleTypeColor}>{label}</Tag>,
      sorter: (a, b) => a.cycleType.localeCompare(b.cycleType),
    },
    {
      title: '计入运动项目', dataIndex: 'sportModeLabel', key: 'sportMode', width: 100,
      render: (label, record) => <Tag color={record.sportModeColor}>{label}</Tag>,
    },
    { title: '生效周期', dataIndex: 'periodText', key: 'periodText', width: 160 },
    {
      title: '完成情况', key: 'completion', width: 100,
      render: (_, record) => (
        record.completionRate !== null
          ? <Space size={4}><RingChart rate={record.completionRate} /><span>{record.completionRate}%</span></Space>
          : <span style={{ color: '#8c8c8c' }}>--</span>
      ),
    },
    { title: '适用范围', dataIndex: 'scopeText', key: 'scopeText', width: 120, ellipsis: true },
    {
      title: '状态', dataIndex: 'statusLabel', key: 'status', width: 80,
      render: (label, record) => <Tag color={record.statusColor}>{label}</Tag>,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 130, sorter: (a, b) => a.createdAt.localeCompare(b.createdAt) },
    {
      title: '操作', key: 'action', width: 200, fixed: 'right',
      render: (_, record) => {
        const canEdit = ['pending', 'active'].includes(record.status)
        const canStop = record.status === 'active'
        const canDelete = record.status === 'pending'
        return (
          <Space>
            <a onClick={() => navigate(`/goal/management/${record.id}`)}>详情</a>
            <a onClick={() => navigate(`/goal/statistics?goalId=${record.id}`)}>数据统计</a>
            {canEdit && <a onClick={() => { setEditingGoal(record); setWizardOpen(true) }}>编辑</a>}
            {canStop && (
              <Popconfirm title="停止后该目标不再生成新的达成结果，历史数据保留。确认停止？" onConfirm={() => message.success('已停止目标')}>
                <a style={{ color: '#faad14' }}>停止</a>
              </Popconfirm>
            )}
            {canDelete && (
              <Popconfirm title="确认删除该目标规则？删除后不可恢复。" onConfirm={() => message.success('已删除')}>
                <a style={{ color: '#ff4d4f' }}>删除</a>
              </Popconfirm>
            )}
          </Space>
        )
      },
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 筛选区 */}
      <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, flex: '0 0 auto' }}>
        <Space size={12} wrap>
          <Select placeholder="学校" allowClear style={{ width: 140 }} value={filters.school} onChange={v => handleFilterChange('school', v)}
            options={SCHOOLS.map(s => ({ label: s, value: s }))} />
          <Select placeholder="目标类型" mode="multiple" style={{ width: 160 }} maxTagCount={2}
            value={filters.goalType} onChange={v => handleFilterChange('goalType', v)}
            options={Object.values(STUDENT_GOAL_TYPES).map(t => ({ label: t.label, value: t.value }))} />
          <Select placeholder="计入运动项目" mode="multiple" style={{ width: 170 }} maxTagCount={2}
            value={filters.sportMode} onChange={v => handleFilterChange('sportMode', v)}
            options={Object.values(SPORT_MODES).map(s => ({ label: s.label, value: s.value }))} />
          <Select placeholder="状态" mode="multiple" style={{ width: 160 }} maxTagCount={2}
            value={filters.status} onChange={v => handleFilterChange('status', v)}
            options={Object.values(GOAL_STATUS).map(s => ({ label: s.label, value: s.value }))} />
          <Input placeholder="搜索目标名称" prefix={<SearchOutlined />} style={{ width: 180 }}
            value={filters.keyword} onChange={e => handleFilterChange('keyword', e.target.value)} allowClear />
          <DatePicker.RangePicker style={{ width: 240 }}
            value={filters.dateRange} onChange={v => handleFilterChange('dateRange', v)} />
          <Button onClick={resetFilters}>重置</Button>
        </Space>
      </div>

      {/* 操作栏 */}
      <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, marginBottom: 16, flex: '0 0 auto' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingGoal(null); setWizardOpen(true) }}>新建目标</Button>
      </div>

      {/* 表格 */}
      <div style={{ background: '#fff', padding: 16, borderRadius: 8, flex: 1, overflow: 'auto', minHeight: 0 }}>
        <Table columns={columns} dataSource={filtered} rowKey="id"
          scroll={{ x: 1300 }} size="middle"
          pagination={{ defaultPageSize: 20, showSizeChanger: true, showTotal: total => `共 ${total} 条` }} />
      </div>

      <CreateGoalWizard mode="student" open={wizardOpen} onClose={() => setWizardOpen(false)}
        editingGoal={editingGoal} onSave={() => message.success('目标保存成功')} />
    </div>
  )
}
