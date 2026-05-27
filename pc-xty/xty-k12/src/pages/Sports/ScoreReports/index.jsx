import { useMemo, useState } from 'react'
import { Button, DatePicker, Descriptions, Drawer, Input, Modal, Select, Space, Table, Tabs, Tag, message } from 'antd'
import { CheckCircleOutlined, EyeOutlined, PictureOutlined, PlayCircleOutlined, ReloadOutlined, SearchOutlined, StopOutlined } from '@ant-design/icons'
import { initialScoreReports, reportClasses, reportGrades, reportSportItems } from '../../../mock/scoreReports'

const { RangePicker } = DatePicker

const statusMeta = {
  pending: { label: '待处理', color: 'warning' },
  confirmed: { label: '确定作弊', color: 'error' },
}

function matchKeyword(record, keyword) {
  if (!keyword) return true
  const text = `${record.studentName}${record.studentNo}`.toLowerCase()
  return text.includes(keyword.trim().toLowerCase())
}

function withinDate(record, range) {
  if (!range || range.length !== 2 || !range[0] || !range[1]) return true
  const value = new Date(record.startTime.replace(/-/g, '/')).getTime()
  return value >= range[0].startOf('day').valueOf() && value <= range[1].endOf('day').valueOf()
}

export default function ScoreReportsPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [reports, setReports] = useState(initialScoreReports)
  const [filters, setFilters] = useState({
    keyword: '',
    grade: undefined,
    className: undefined,
    sportItem: undefined,
    dateRange: null,
  })
  const [drawerRecord, setDrawerRecord] = useState(null)
  const [mediaRecord, setMediaRecord] = useState(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const pendingCount = reports.filter(item => item.status === 'pending').length
  const confirmedCount = reports.filter(item => item.status === 'confirmed').length

  const filteredReports = useMemo(() => {
    return reports
      .filter(item => item.status === activeTab)
      .filter(item => matchKeyword(item, filters.keyword))
      .filter(item => !filters.grade || item.grade === filters.grade)
      .filter(item => !filters.className || item.className === filters.className)
      .filter(item => !filters.sportItem || item.sportItem === filters.sportItem)
      .filter(item => withinDate(item, filters.dateRange))
  }, [reports, activeTab, filters])

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const resetFilters = () => setFilters({ keyword: '', grade: undefined, className: undefined, sportItem: undefined, dateRange: null })

  const confirmCheat = record => {
    Modal.confirm({
      title: '确定作弊',
      content: `确定后，${record.studentName} 的该条${record.sportItem}成绩将标记为异常，并继续从学生排行榜隐藏。`,
      okText: '确定作弊',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        setReports(prev => prev.map(item => (
          item.id === record.id
            ? { ...item, status: 'confirmed', scoreStatus: '异常', handledBy: '当前老师', handledTime: '2026-05-18 14:30:00' }
            : item
        )))
        message.success('已确定作弊，成绩状态已更新为异常')
      },
    })
  }

  const cancelCheat = record => {
    Modal.confirm({
      title: '取消作弊',
      content: `取消后，${record.studentName} 的该条成绩将恢复在学生排行榜展示，本次举报记录关闭。`,
      okText: '取消作弊',
      cancelText: '返回',
      onOk: () => {
        setReports(prev => prev.filter(item => item.id !== record.id))
        message.success('已取消作弊，成绩已恢复展示')
      },
    })
  }

  const batchConfirmCheat = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择待处理记录')
      return
    }
    Modal.confirm({
      title: '批量确定作弊',
      content: `确定后，已选 ${selectedRowKeys.length} 条成绩将标记为异常，并继续从学生排行榜隐藏。`,
      okText: '确定作弊',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        setReports(prev => prev.map(item => (
          selectedRowKeys.includes(item.id)
            ? { ...item, status: 'confirmed', scoreStatus: '异常', handledBy: '当前老师', handledTime: '2026-05-18 14:30:00' }
            : item
        )))
        setSelectedRowKeys([])
        message.success('已批量确定作弊')
      },
    })
  }

  const batchCancelCheat = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择待处理记录')
      return
    }
    Modal.confirm({
      title: '批量取消作弊',
      content: `取消后，已选 ${selectedRowKeys.length} 条成绩将恢复在学生排行榜展示，本次举报记录关闭。`,
      okText: '取消作弊',
      cancelText: '返回',
      onOk: () => {
        setReports(prev => prev.filter(item => !selectedRowKeys.includes(item.id)))
        setSelectedRowKeys([])
        message.success('已批量取消作弊')
      },
    })
  }

  const baseColumns = [
    { title: '学生姓名', dataIndex: 'studentName', width: 70 },
    { title: '学籍号', dataIndex: 'studentNo', width: 106 },
    { title: '年级', dataIndex: 'grade', width: 62 },
    { title: '班级', dataIndex: 'className', width: 52 },
    {
      title: '运动项目',
      dataIndex: 'sportItem',
      width: 80,
      render: text => <Tag color="blue">{text}</Tag>,
    },
    { title: '运动开始时间', dataIndex: 'startTime', width: 132 },
    { title: '运动成绩', dataIndex: 'score', width: 70 },
    {
      title: '运动视频/图片',
      dataIndex: 'mediaType',
      width: 100,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Tag icon={record.mediaType === 'video' ? <PlayCircleOutlined /> : <PictureOutlined />} color={record.mediaType === 'video' ? 'geekblue' : 'cyan'}>
            {record.mediaType === 'video' ? `视频 ${record.mediaTime}` : `图片 ${record.mediaTime}`}
          </Tag>
          <Button type="link" size="small" style={{ padding: 0 }} onClick={() => setMediaRecord(record)}>
            查看
          </Button>
        </Space>
      ),
    },
    {
      title: '举报学生信息',
      dataIndex: 'reporters',
      width: 158,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <span>{record.reportCount} 人举报 / 共 {record.totalSubmitCount} 次</span>
          <Button type="link" size="small" style={{ padding: 0 }} icon={<EyeOutlined />} onClick={() => setDrawerRecord(record)}>
            查看举报人
          </Button>
        </Space>
      ),
    },
  ]

  const pendingColumns = [
    ...baseColumns,
    {
      title: '操作',
      key: 'action',
      width: 112,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Button type="link" danger onClick={() => confirmCheat(record)}>确定作弊</Button>
          <Button type="link" onClick={() => cancelCheat(record)}>取消作弊</Button>
        </Space>
      ),
    },
  ]

  const confirmedColumns = [
    ...baseColumns,
    {
      title: '处理信息',
      key: 'handleInfo',
      width: 132,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <span>{record.handledBy}</span>
          <span style={{ color: '#8c8c8c', fontSize: 12 }}>{record.handledTime}</span>
        </Space>
      ),
    },
    {
      title: '成绩状态',
      dataIndex: 'scoreStatus',
      width: 80,
      render: value => <Tag color="red">{value || '异常'}</Tag>,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, flex: '0 0 auto' }}>
        成绩举报管理
      </div>

      <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, flex: '0 0 auto' }}>
        <Space size={12} wrap>
          <Input
            placeholder="搜索学生姓名/学籍号"
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 210 }}
            value={filters.keyword}
            onChange={event => setFilter('keyword', event.target.value)}
          />
          <Select
            placeholder="年级"
            allowClear
            style={{ width: 120 }}
            value={filters.grade}
            onChange={value => setFilter('grade', value)}
            options={reportGrades.map(value => ({ label: value, value }))}
          />
          <Select
            placeholder="班级"
            allowClear
            style={{ width: 110 }}
            value={filters.className}
            onChange={value => setFilter('className', value)}
            options={reportClasses.map(value => ({ label: value, value }))}
          />
          <Select
            placeholder="运动项目"
            allowClear
            style={{ width: 140 }}
            value={filters.sportItem}
            onChange={value => setFilter('sportItem', value)}
            options={reportSportItems.map(value => ({ label: value, value }))}
          />
          <RangePicker style={{ width: 260 }} value={filters.dateRange} onChange={value => setFilter('dateRange', value)} />
          <Button icon={<ReloadOutlined />} onClick={resetFilters}>重置</Button>
        </Space>
      </div>

      <div style={{ background: '#fff', borderRadius: 8, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{ margin: 0, padding: '0 16px' }}
          items={[
            {
              key: 'pending',
              label: <span>举报待处理 <Tag color={statusMeta.pending.color}>{pendingCount}</Tag></span>,
              children: (
                <div style={{ padding: 16 }}>
                  <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <Button danger icon={<StopOutlined />} disabled={selectedRowKeys.length === 0} onClick={batchConfirmCheat}>
                        批量确定作弊
                      </Button>
                      <Button icon={<CheckCircleOutlined />} disabled={selectedRowKeys.length === 0} onClick={batchCancelCheat}>
                        批量取消作弊
                      </Button>
                    </Space>
                    <span style={{ color: '#8c8c8c' }}>已选 {selectedRowKeys.length} 条</span>
                  </div>
                  <Table
                    columns={pendingColumns}
                    dataSource={filteredReports}
                    rowKey="id"
                    size="middle"
                    rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                    scroll={{ x: 980 }}
                    pagination={{ defaultPageSize: 10, showSizeChanger: true, showTotal: total => `共 ${total} 条` }}
                  />
                </div>
              ),
            },
            {
              key: 'confirmed',
              label: <span>确定作弊 <Tag color={statusMeta.confirmed.color}>{confirmedCount}</Tag></span>,
              children: (
                <div style={{ padding: 16 }}>
                  <Table
                    columns={confirmedColumns}
                    dataSource={filteredReports}
                    rowKey="id"
                    size="middle"
                    scroll={{ x: 1040 }}
                    pagination={{ defaultPageSize: 10, showSizeChanger: true, showTotal: total => `共 ${total} 条` }}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>

      <ReporterDrawer record={drawerRecord} onClose={() => setDrawerRecord(null)} />
      <MediaModal record={mediaRecord} onClose={() => setMediaRecord(null)} />
    </div>
  )
}

function MediaModal({ record, onClose }) {
  return (
    <Modal
      title="查看运动视频/图片"
      open={!!record}
      onCancel={onClose}
      footer={null}
      width={760}
      destroyOnClose
    >
      {record && (
        <div>
          <Descriptions size="small" column={4} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="学生">{record.studentName}</Descriptions.Item>
            <Descriptions.Item label="项目">{record.sportItem}</Descriptions.Item>
            <Descriptions.Item label="成绩">{record.score}</Descriptions.Item>
            <Descriptions.Item label="时间">{record.startTime}</Descriptions.Item>
          </Descriptions>
          {record.mediaType === 'video' ? (
            <div style={{ background: '#141414', borderRadius: 6, height: 360, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #2f3542 0%, #111827 55%, #0f172a 100%)',
              }} />
              <div style={{
                position: 'absolute',
                left: 24,
                top: 18,
                color: '#fff',
                fontSize: 12,
                lineHeight: 1.8,
                fontFamily: 'monospace',
              }}>
                <div>{record.startTime}</div>
                <div>设备 1</div>
                <div>项目：{record.sportItem}</div>
                <div>成绩：{record.score}</div>
              </div>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 92,
                height: 92,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 42,
              }}>
                <PlayCircleOutlined />
              </div>
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 42,
                background: 'rgba(0,0,0,0.55)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 18px',
              }}>
                <span>{record.studentName}</span>
                <span>{record.mediaTime}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[1, 2, 3].map(index => (
                <div key={index} style={{
                  height: 160,
                  borderRadius: 6,
                  background: index % 2 ? '#e6f4ff' : '#f6ffed',
                  border: '1px solid #d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1677ff',
                  fontSize: 15,
                }}>
                  <Space direction="vertical" align="center">
                    <PictureOutlined style={{ fontSize: 32 }} />
                    <span>运动抓拍 {index}</span>
                  </Space>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

function ReporterDrawer({ record, onClose }) {
  const columns = [
    { title: '班级', dataIndex: 'className', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 100 },
    {
      title: '该学生举报次数',
      dataIndex: 'reportTimes',
      width: 120,
      render: value => <Tag color={value > 1 ? 'orange' : 'default'}>{value} 次</Tag>,
    },
  ]

  return (
    <Drawer
      title="举报学生信息"
      open={!!record}
      onClose={onClose}
      width={520}
      destroyOnClose
    >
      {record && (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Descriptions size="small" column={1} bordered>
            <Descriptions.Item label="被举报学生">{record.studentName}</Descriptions.Item>
            <Descriptions.Item label="运动项目">{record.sportItem}</Descriptions.Item>
            <Descriptions.Item label="运动成绩">{record.score}</Descriptions.Item>
            <Descriptions.Item label="不同举报学生">{record.reportCount} 人</Descriptions.Item>
            <Descriptions.Item label="总举报提交次数">{record.totalSubmitCount} 次</Descriptions.Item>
          </Descriptions>
          <Table
            columns={columns}
            dataSource={record.reporters}
            rowKey="id"
            size="small"
            pagination={false}
          />
        </Space>
      )}
    </Drawer>
  )
}
