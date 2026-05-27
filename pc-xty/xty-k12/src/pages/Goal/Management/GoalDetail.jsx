import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tabs, Tag, Breadcrumb, Table, Select, Input, DatePicker, Space, Button, Statistic, Row, Col, Empty, Timeline, message, Drawer } from 'antd'
import { SearchOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { findGoalById } from '../../../mock/goalList'
import { generateChangeHistory, generateSportRecords, generateAchievementOverview } from '../../../mock/goalDetail'
import { GRADES } from '../../../mock/goalList'

export default function GoalDetailPage() {
  const { goalId } = useParams()
  const navigate = useNavigate()
  const goal = useMemo(() => findGoalById(goalId), [goalId])
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)

  if (!goal) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Empty description="目标不存在" />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 面包屑 */}
      <div style={{ marginBottom: 12 }}>
        <Breadcrumb items={[
          { title: <a onClick={() => navigate('/goal/management')}>运动目标管理</a> },
          { title: goal.name },
        ]} />
      </div>

      {/* 标题 + 核心信息 + 更多信息按钮 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 500 }}>{goal.name}</span>
          <Tag color={goal.statusColor}>{goal.statusLabel}</Tag>
        </div>
        {/* 核心字段：目标名称、目标类型、适用范围、周期类型、计入方式、生效周期 */}
        <Row gutter={24} style={{ fontSize: 13, color: '#595959' }}>
          <Col flex="0 0 auto">
            <span style={{ color: '#8c8c8c' }}>目标类型：</span>
            <Tag color={goal.goalTargetColor}>{goal.goalTargetLabel}</Tag>
          </Col>
          <Col flex="0 0 auto">
            <span style={{ color: '#8c8c8c' }}>适用范围：</span>
            <span>{goal.scopeText}</span>
          </Col>
          <Col flex="0 0 auto">
            <span style={{ color: '#8c8c8c' }}>周期类型：</span>
            <Tag color={goal.cycleTypeColor}>{goal.cycleTypeLabel}</Tag>
          </Col>
          <Col flex="0 0 auto">
            <span style={{ color: '#8c8c8c' }}>计入方式：</span>
            <Tag color={goal.sportModeColor}>{goal.sportModeLabel}</Tag>
          </Col>
          <Col flex="0 0 auto">
            <span style={{ color: '#8c8c8c' }}>生效周期：</span>
            <span>{goal.periodText}</span>
          </Col>
          {goal.cycleType === 'daily' && (
            <Col flex="0 0 auto">
              <span style={{ color: '#8c8c8c' }}>执行星期：</span>
              <span>{goal.executeWeekdaysText || goal.executeWeekdays?.join('、') || '周一至周日'}</span>
            </Col>
          )}
          <Col flex="0 0 auto">
            <Button type="link" icon={<InfoCircleOutlined />} onClick={() => setDetailDrawerOpen(true)}>
              更多信息
            </Button>
          </Col>
        </Row>
      </div>

      {/* Tabs 区域：标签栏固定，内容区滚动 */}
      <div style={{ background: '#fff', borderRadius: 8, flex: 1, overflow: 'hidden' }}>
        <Tabs defaultActiveKey="records" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          tabBarStyle={{ marginBottom: 0, paddingBottom: 0 }}
          items={[
            { key: 'records', label: '计入运动记录', children: <SportRecordsTab goalId={goalId} /> },
            { key: 'history', label: '规则变更记录', children: <ChangeHistoryTab goalId={goalId} /> },
            { key: 'overview', label: '达成概览', children: <AchievementTab goalId={goalId} /> },
          ]}
        />
      </div>

      {/* 更多信息抽屉 */}
      <Drawer title="目标完整信息" open={detailDrawerOpen} onClose={() => setDetailDrawerOpen(false)}
        width={640} placement="right" destroyOnClose>
        <FullInfoDrawer goal={goal} />
      </Drawer>
    </div>
  )
}

// ===== 更多信息抽屉：展示完整信息 =====
function FullInfoDrawer({ goal }) {
  const infoItems = [
    { label: '基础信息', children: null, type: 'group' },
    { label: '目标名称', children: goal.name },
    { label: '目标类型', children: <Tag color={goal.goalTargetColor}>{goal.goalTargetLabel}</Tag> },
    { label: '周期类型', children: <Tag color={goal.cycleTypeColor}>{goal.cycleTypeLabel}</Tag> },
    { label: '创建人', children: `${goal.creator}（${goal.creatorRole}）` },
    { label: '创建时间', children: goal.createdAt },

    { label: '周期信息', children: null, type: 'group' },
    { label: '生效周期', children: goal.periodText || '未设置' },
    ...(goal.cycleType === 'daily' ? [{ label: '执行星期', children: goal.executeWeekdaysText || goal.executeWeekdays?.join('、') || '周一至周日' }] : []),
    { label: '目标值摘要', children: goal.goalValueSummary || '未设置' },

    { label: '计入运动项目', children: null, type: 'group' },
    { label: '计入方式', children: <Tag color={goal.sportModeColor}>{goal.sportModeLabel}</Tag> },
    { label: '目标值详情', children: goalValueDetailDisplay(goal) },

    ...(goal.sportMode === 'sunrun' ? [
      { label: '阳光跑专配', children: null, type: 'group' },
      ...sunrunConfigItems(goal),
    ] : []),

    { label: '适用范围', children: null, type: 'group' },
    { label: '适用层级/范围', children: scopeLevelDisplay(goal) },
    { label: '性别设定', children: genderDisplay(goal) },
    { label: '覆盖快照人数', children: `${goal.coverageSnapshotCount || goal.completionTotal || 0}人（创建后固定）`, span: 2 },
    { label: '覆盖快照说明', children: '学生转班、删除学生、班级调整不改变已有目标覆盖名单', span: 2 },

    { label: '计入规则', children: null, type: 'group' },
    { label: '计入运动项目', children: countingSportsDisplay(goal) },
    { label: '业务类型', children: goal.countingRules?.businessTypes?.join('、') || '全部项目' },
    { label: '成绩状态', children: goal.countingRules?.scoreStatuses?.join('、') || '正常' },
    { label: '项目标签', children: projectTagsDisplay(goal) },

    { label: '状态信息', children: null, type: 'group' },
    { label: '当前状态', children: <Tag color={goal.statusColor}>{goal.statusLabel}</Tag> },
    { label: '状态变更时间', children: goal.statusTime || goal.createdAt },
    { label: '最近编辑', children: goal.lastEditor || '--' },
    { label: '最近编辑时间', children: goal.lastEditTime || '--' },
  ]

  return (
    <Descriptions bordered size="small" column={2}>
      {infoItems.map((item, idx) => {
        if (item.type === 'group') {
          return (
            <Descriptions.Item key={idx} label={<span style={{ fontWeight: 500, color: '#1677ff' }}>{item.label}</span>} span={2}>
              {item.children || null}
            </Descriptions.Item>
          )
        }
        return (
          <Descriptions.Item key={idx} label={item.label}>
            {item.children || '未设置'}
          </Descriptions.Item>
        )
      })}
    </Descriptions>
  )
}

// ===== 辅助展示函数 =====

function goalValueDetailDisplay(goal) {
  if (goal.sportMode === 'all') return `运动时长：${goal.duration || 60} ${goal.durationUnit === 'hour' ? '小时' : '分钟'}`
  if (goal.sportMode === 'single') return `${goal.sportProject || '项目'} ${goal.targetValue || 0} ${goal.targetUnit || '个'}`
  if (goal.sportMode === 'multi') {
    return (goal.subConditions || []).map(s => `${s.sportProject} ${s.targetValue}${s.unit}`).join('；') || '未设置子条件'
  }
  if (goal.sportMode === 'sunrun') {
    const cfg = goal.sunrunConfig || {}
    return (
      <div>
        <div>周最低次数：{cfg.weeklyMinEnabled ? `${cfg.weeklyMinTimes}次（开启）` : '关闭'}</div>
        <div>月最低次数：{cfg.monthlyMinEnabled ? `${cfg.monthlyMinTimes}次（开启）` : '关闭'}</div>
        <div>每日最多计入限制：{cfg.dailyLimitEnabled ? `${cfg.dailyLimitKm}公里（开启）` : '关闭'}</div>
        <div>单次最低里程：{cfg.singleRunMinEnabled ? `${cfg.singleRunMinKm}公里（开启）` : '关闭'}</div>
        <div>里程目标：{cfg.semesterGoal ? `${cfg.semesterGoal}公里` : '未设置'}</div>
        <div style={{ color: '#8c8c8c', fontSize: 12 }}>配速要求：{cfg.paceConfig ? `${cfg.paceConfig.minPace} - ${cfg.paceConfig.maxPace}` : '未配置'}</div>
      </div>
    )
  }
  return '未设置'
}

function sunrunConfigItems(goal) {
  const cfg = goal.sunrunConfig || {}
  return [
    { label: '周最低次数', children: cfg.weeklyMinEnabled ? `${cfg.weeklyMinTimes}次` : '关闭' },
    { label: '月最低次数', children: cfg.monthlyMinEnabled ? `${cfg.monthlyMinTimes}次` : '关闭' },
    { label: '每日最多计入限制', children: cfg.dailyLimitEnabled ? `${cfg.dailyLimitKm}公里` : '关闭' },
    { label: '单次最低里程', children: cfg.singleRunMinEnabled ? `${cfg.singleRunMinKm}公里` : '关闭' },
    { label: '里程目标', children: cfg.semesterGoal ? `${cfg.semesterGoal}公里` : '未设置' },
    { label: '配速要求', children: cfg.paceConfig ? `${cfg.paceConfig.minPace} ~ ${cfg.paceConfig.maxPace}` : '未配置', span: 2 },
  ]
}

function countingSportsDisplay(goal) {
  const sports = goal.countingRules?.sportProjects
  if (sports === 'all') return <Tag>全部运动项目</Tag>
  if (Array.isArray(sports) && sports.length > 0) return sports.map(s => <Tag key={s}>{s}</Tag>)
  return '全部运动项目'
}

function scopeLevelDisplay(goal) {
  if (goal.goalTargetType === 'class') {
    return goal.scopeText || '指定班级'
  }
  if (goal.goalTargetType === 'teacher') {
    return goal.scopeText || '全校教师'
  }
  if (goal.scopeLevel === 'all') return '全校'
  if (goal.scopeLevel === 'grades') return `${goal.scopeGrades?.length || 0}个年级`
  if (goal.scopeLevel === 'classes') return `${(goal.scopeClasses || []).length}个班级`
  return '全校'
}

function genderDisplay(goal) {
  const g = goal.scopeGender || 'all'
  if (g === 'male') return <span>♂ 男</span>
  if (g === 'female') return <span>♀ 女</span>
  return '不限'
}

function projectTagsDisplay(goal) {
  const tags = goal.countingRules?.projectTags
  if (!tags || tags.length === 0) return '无'
  // 标注对应运动项目
  const sportProjects = goal.countingRules?.sportProjects
  const projectNames = sportProjects === 'all' ? '全部项目' : (Array.isArray(sportProjects) ? sportProjects.join('、') : '')
  return `${projectNames}：${tags.join('、')}`
}

// ===== Tab 1: 计入运动记录 =====
function SportRecordsTab({ goalId }) {
  const [filters, setFilters] = useState({ keyword: '', grade: undefined, className: undefined, dateRange: null, page: 1 })
  const { total, includedCount, partialCount, records } = useMemo(
    () => generateSportRecords(goalId, filters),
    [goalId, filters],
  )

  const columns = [
    { title: '学生姓名', dataIndex: 'studentName', key: 'studentName', width: 90 },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 50 },
    { title: '学籍号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
    { title: '年级', dataIndex: 'grade', key: 'grade', width: 70 },
    { title: '班级', dataIndex: 'className', key: 'className', width: 100 },
    { title: '运动项目', dataIndex: 'sportProject', key: 'sportProject', width: 90 },
    { title: '业务类型', dataIndex: 'businessType', key: 'businessType', width: 90 },
    { title: '成绩', dataIndex: 'score', key: 'score', width: 100 },
    {
      title: '成绩状态', dataIndex: 'scoreStatus', key: 'scoreStatus', width: 80,
      render: (v) => <Tag color={v === '正常' ? 'success' : 'warning'}>{v}</Tag>,
    },
    { title: '运动时长', dataIndex: 'sportDuration', key: 'sportDuration', width: 100 },
    { title: '计入时间', dataIndex: 'includeTime', key: 'includeTime', width: 150 },
    {
      title: '计入状态', dataIndex: 'includeStatus', key: 'includeStatus', width: 90,
      render: (v, r) => (
        <TooltipSpan tip={r.includeTip}>
          <Tag color={v === '全部计入' ? 'success' : 'warning'}>{v}</Tag>
        </TooltipSpan>
      ),
    },
    {
      title: '计入成绩', dataIndex: 'countingScore', key: 'countingScore', width: 90,
      render: (v, r) => {
        if (!v) return <span style={{ color: '#bfbfbf' }}>—</span>
        const isPartial = r.includeStatus === '部分计入'
        return <span style={{ color: isPartial ? '#faad14' : '#1677ff' }}>{v}</span>
      },
    },
    {
      title: '操作', key: 'action', width: 80, fixed: 'right',
      render: () => <Button type="link" size="small" onClick={() => message.success('跳转运动记录详情页')}>详情</Button>,
    },
  ]

  return (
    <div style={{ padding: '16px 24px', height: '100%', overflow: 'auto' }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Card size="small"><Statistic title="总记录数" value={total} /></Card></Col>
        <Col span={8}><Card size="small"><Statistic title="已计入数" value={includedCount} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={8}><Card size="small"><Statistic title="部分计入数" value={partialCount} valueStyle={{ color: '#faad14' }} /></Card></Col>
      </Row>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input placeholder="学生姓名/学籍号" prefix={<SearchOutlined />} style={{ width: 200 }}
          value={filters.keyword} onChange={e => setFilters({ ...filters, keyword: e.target.value, page: 1 })} allowClear />
        <Select placeholder="年级" allowClear style={{ width: 120 }}
          value={filters.grade} onChange={v => setFilters({ ...filters, grade: v, page: 1 })}
          options={GRADES.map(g => ({ label: g, value: g }))} />
        <Select placeholder="班级" allowClear style={{ width: 120 }}
          value={filters.className} onChange={v => setFilters({ ...filters, className: v, page: 1 })}
          options={GRADES.slice(0, 6).map(g => ({ label: `${g}1班`, value: `${g}1班` }))} />
        <DatePicker.RangePicker value={filters.dateRange}
          onChange={v => setFilters({ ...filters, dateRange: v, page: 1 })} />
        <Button icon={<DownloadOutlined />} onClick={() => message.success('导出成功')}>导出</Button>
      </Space>

      <Table columns={columns} dataSource={records} rowKey="id" size="small"
        scroll={{ x: 1400 }} pagination={{ pageSize: 20, showTotal: t => `共 ${t} 条`, onChange: p => setFilters({ ...filters, page: p }) }} />
    </div>
  )
}

// ===== Tab 2: 规则变更记录 =====
function ChangeHistoryTab({ goalId }) {
  const data = useMemo(() => generateChangeHistory(goalId), [goalId])
  const [expandedId, setExpandedId] = useState(null)

  if (data.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Empty description="该目标暂无变更记录" />
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 24px', height: '100%', overflow: 'auto' }}>
      <Timeline items={data.map(item => ({
        key: item.id,
        color: item.changeType === 'stop' ? 'red' : 'blue',
        children: (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Space>
                <Tag color={item.changeType === 'edit' ? 'blue' : 'red'}>{item.changeTypeLabel}</Tag>
                <span style={{ fontWeight: 500 }}>{item.summary}</span>
              </Space>
              <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                {item.time} by {item.person}
              </span>
            </div>
            <a style={{ fontSize: 12 }} onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
              {expandedId === item.id ? '收起对比' : '查看前后对比'}
            </a>
            {expandedId === item.id && (
              <div style={{ display: 'flex', gap: 16, marginTop: 8, padding: 12, background: '#fafafa', borderRadius: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>旧值</div>
                  <div style={{ color: '#8c8c8c', textDecoration: 'line-through', fontSize: 13 }}>{item.beforeContent}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>新值</div>
                  <div style={{ color: '#1677ff', fontWeight: 500, fontSize: 13 }}>{item.afterContent}</div>
                </div>
              </div>
            )}
          </div>
        ),
      }))} />
    </div>
  )
}

function TooltipSpan({ tip, children }) {
  if (!tip) return children
  return <span title={tip} style={{ cursor: 'pointer' }}>{children}</span>
}

// ===== Tab 3: 达成概览 =====
function AchievementTab({ goalId }) {
  const navigate = useNavigate()
  const overview = useMemo(() => generateAchievementOverview(goalId), [goalId])

  return (
    <div style={{ padding: '16px 24px', height: '100%', overflow: 'auto' }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={5}>
          <Card><Statistic title="统计截止时间" value={overview.snapshotTime || '2026-05-18 24:00'} valueStyle={{ fontSize: 18, color: '#1677ff' }} /></Card>
        </Col>
        <Col span={7}>
          <Card style={{ textAlign: 'center', border: '2px solid #1677ff' }}>
            <div style={{ color: '#8c8c8c', marginBottom: 8 }}>达标率</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: overview.rate !== null ? '#1677ff' : '#8c8c8c' }}>
              {overview.rate !== null ? `${overview.rate}%` : '--'}
            </div>
          </Card>
        </Col>
        <Col span={4}><Card><Statistic title="覆盖学生数（快照）" value={overview.totalStudents || '--'} suffix="人" /></Card></Col>
        <Col span={4}><Card><Statistic title="已达标" value={overview.achieved || '--'} suffix="人" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={4}><Card><Statistic title="未达标" value={overview.notAchieved || '--'} suffix="人" valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>
      <Button type="primary" onClick={() => navigate('/goal/statistics?goalId=' + goalId)}>查看完整统计</Button>
    </div>
  )
}
