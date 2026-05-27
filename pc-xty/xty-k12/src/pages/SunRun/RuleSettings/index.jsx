import { useState, useMemo } from 'react'
import {
  Table, Tag, Select, Button, Space, Drawer, Form, InputNumber,
  Switch, message, Card, Row, Col, Descriptions,
} from 'antd'
import { ReloadOutlined, EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  GRADES, SCHOOLS, GENDERS,
  generatePaceRules, DEFAULT_STUDENT_PACE, DEFAULT_TEACHER_PACE, formatPace,
} from '../../../mock/sunrunRules'

export default function RuleSettingsPage() {
  // ---- Card A: 任务创建/结束权限 ----
  const [school, setSchool] = useState('萧山六中')
  const [controlEnabled, setControlEnabled] = useState(false)

  const handleSaveControl = () => {
    message.success('任务创建/结束权限已保存')
  }

  // ---- Card B: 学生配速设置 ----
  const [globalPace, setGlobalPace] = useState({ ...DEFAULT_STUDENT_PACE })
  const [paceRules, setPaceRules] = useState(() => generatePaceRules())
  const [paceFilters, setPaceFilters] = useState({ grade: undefined, gender: undefined, source: undefined })
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [editingPace, setEditingPace] = useState(null)
  const [paceForm] = Form.useForm()

  // Drawers
  const [globalPaceDrawerOpen, setGlobalPaceDrawerOpen] = useState(false)
  const [globalPaceForm] = Form.useForm()
  const [batchDrawerOpen, setBatchDrawerOpen] = useState(false)
  const [batchForm] = Form.useForm()

  const filteredPaceRules = useMemo(() => {
    return paceRules.filter(r => {
      if (paceFilters.grade && r.grade !== paceFilters.grade) return false
      if (paceFilters.gender && r.gender !== paceFilters.gender) return false
      if (paceFilters.source === 'inherit' && r.isCustom) return false
      if (paceFilters.source === 'custom' && !r.isCustom) return false
      return true
    })
  }, [paceRules, paceFilters])

  // 选中行的数据
  const selectedRows = useMemo(() => {
    return paceRules.filter(r => selectedRowKeys.includes(r.id))
  }, [paceRules, selectedRowKeys])

  // ---- Global pace handlers ----
  const openGlobalPaceEdit = () => {
    globalPaceForm.setFieldsValue({ minPace: globalPace.minPace, maxPace: globalPace.maxPace })
    setGlobalPaceDrawerOpen(true)
  }

  const handleSaveGlobalPace = () => {
    globalPaceForm.validateFields().then(values => {
      if (values.maxPace < values.minPace) {
        message.warning('最高配速不能低于最低配速')
        return
      }
      const newGlobal = {
        minPace: values.minPace,
        maxPace: values.maxPace,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
      setGlobalPace(newGlobal)
      // 更新所有继承全局的行
      setPaceRules(prev => prev.map(r =>
        r.isCustom ? r : { ...r, minPace: newGlobal.minPace, maxPace: newGlobal.maxPace, updateTime: newGlobal.updateTime }
      ))
      setGlobalPaceDrawerOpen(false)
      message.success('全局默认配速已更新，所有继承全局的规则已同步')
    }).catch(() => {})
  }

  // ---- Single row edit ----
  const openPaceEdit = (record) => {
    setEditingPace(record)
    paceForm.setFieldsValue({ minPace: record.minPace, maxPace: record.maxPace })
  }

  const handleSavePace = () => {
    paceForm.validateFields().then(values => {
      if (values.maxPace < values.minPace) {
        message.warning('最高配速不能低于最低配速')
        return
      }
      setPaceRules(prev => prev.map(r =>
        r.id === editingPace.id
          ? { ...r, minPace: values.minPace, maxPace: values.maxPace, isCustom: true, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
          : r
      ))
      setEditingPace(null)
      message.success(`${editingPace.grade} ${editingPace.genderLabel} 配速规则已更新`)
    }).catch(() => {})
  }

  const handleResetToGlobal = (record) => {
    setPaceRules(prev => prev.map(r =>
      r.id === record.id
        ? { ...r, minPace: globalPace.minPace, maxPace: globalPace.maxPace, isCustom: false, updateTime: globalPace.updateTime }
        : r
    ))
    setEditingPace(null)
    message.success(`${record.grade} ${record.genderLabel} 已恢复为全局默认`)
  }

  // ---- Batch edit ----
  const openBatchEdit = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要编辑的规则')
      return
    }
    batchForm.resetFields()
    setBatchDrawerOpen(true)
  }

  const handleSaveBatch = () => {
    batchForm.validateFields().then(values => {
      const hasMin = values.minPace !== undefined && values.minPace !== null
      const hasMax = values.maxPace !== undefined && values.maxPace !== null
      if (!hasMin && !hasMax) {
        message.warning('请至少设置最低配速或最高配速')
        return
      }
      if (hasMin && hasMax && values.maxPace < values.minPace) {
        message.warning('最高配速不能低于最低配速')
        return
      }
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
      setPaceRules(prev => prev.map(r => {
        if (!selectedRowKeys.includes(r.id)) return r
        return {
          ...r,
          minPace: hasMin ? values.minPace : r.minPace,
          maxPace: hasMax ? values.maxPace : r.maxPace,
          isCustom: true,
          updateTime: now,
        }
      }))
      setSelectedRowKeys([])
      setBatchDrawerOpen(false)
      message.success(`已批量更新 ${selectedRowKeys.length} 条配速规则`)
    }).catch(() => {})
  }

  // ---- Card C: 老师配速设置 ----
  const [teacherPace, setTeacherPace] = useState({ ...DEFAULT_TEACHER_PACE })
  const [teacherPaceDrawerOpen, setTeacherPaceDrawerOpen] = useState(false)
  const [teacherPaceForm] = Form.useForm()

  const openTeacherPaceEdit = () => {
    teacherPaceForm.setFieldsValue({ minPace: teacherPace.minPace, maxPace: teacherPace.maxPace })
    setTeacherPaceDrawerOpen(true)
  }

  const handleSaveTeacherPace = () => {
    teacherPaceForm.validateFields().then(values => {
      if (values.maxPace < values.minPace) {
        message.warning('最高配速不能低于最低配速')
        return
      }
      setTeacherPace({
        minPace: values.minPace,
        maxPace: values.maxPace,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
      setTeacherPaceDrawerOpen(false)
      message.success('老师配速规则已更新')
    }).catch(() => {})
  }

  // ---- Columns ----
  const paceColumns = [
    { title: '年级', dataIndex: 'grade', key: 'grade', width: 90 },
    {
      title: '性别', dataIndex: 'genderLabel', key: 'gender', width: 70,
      render: (text, record) => (
        <Tag color={record.gender === 'male' ? 'blue' : 'pink'}>{text}</Tag>
      ),
    },
    {
      title: '最低配速', dataIndex: 'minPace', key: 'minPace', width: 140,
      render: val => `${val}'00"/公里`,
    },
    {
      title: '最高配速', dataIndex: 'maxPace', key: 'maxPace', width: 140,
      render: val => `${val}'00"/公里`,
    },
    {
      title: '规则来源', dataIndex: 'isCustom', key: 'source', width: 100,
      render: val => val
        ? <Tag color="blue">自定义</Tag>
        : <Tag color="default">继承全局</Tag>,
    },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 170 },
    {
      title: '操作', key: 'action', width: 80, fixed: 'right',
      render: (_, record) => (
        <a onClick={() => openPaceEdit(record)}><EditOutlined /> 编辑</a>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, flex: '0 0 auto' }}>
        阳光跑规则设置
      </div>

      {/* Card A: 任务创建/结束权限 */}
      <Card title="任务创建/结束权限" size="small" style={{ marginBottom: 16, flex: '0 0 auto' }}>
        <Row align="middle" gutter={[24, 16]}>
          <Col>
            <Select
              style={{ width: 220 }}
              value={school}
              onChange={setSchool}
              options={SCHOOLS.map(s => ({ label: s, value: s }))}
            />
          </Col>
          <Col>
            <Space>
              <span style={{ color: '#595959' }}>是否开启控制权限</span>
              <Switch
                checked={controlEnabled}
                onChange={setControlEnabled}
                checkedChildren="开启"
                unCheckedChildren="关闭"
              />
            </Space>
          </Col>
          <Col>
            <span style={{ color: '#8c8c8c', fontSize: 13 }}>
              开启后，可设置教师开启/关闭阳光跑任务的权限
            </span>
          </Col>
          <Col>
            <Button type="primary" onClick={handleSaveControl}>保存</Button>
          </Col>
        </Row>
      </Card>

      {/* Card B: 学生配速设置 */}
      <Card
        title="学生配速设置"
        size="small"
        style={{ marginBottom: 16, flex: '0 0 auto' }}
        extra={<a onClick={openGlobalPaceEdit}><EditOutlined /> 编辑全局默认</a>}
      >
        {/* 全局默认配速展示 */}
        <div style={{
          background: '#fafafa', borderRadius: 8, padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 48,
        }}>
          <div>
            <span style={{ color: '#8c8c8c', fontSize: 13 }}>全局默认配速：</span>
            <span style={{ fontWeight: 500, marginLeft: 8 }}>
              最低 {globalPace.minPace}'00" - 最高 {globalPace.maxPace}'00" /公里
            </span>
          </div>
          <div style={{ color: '#8c8c8c', fontSize: 12 }}>
            （应用于所有未自定义的年级和性别）
          </div>
        </div>

        {/* 筛选 + 批量操作 */}
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Space size={12} wrap>
            <Select
              placeholder="年级" allowClear style={{ width: 140 }}
              value={paceFilters.grade}
              onChange={v => setPaceFilters(prev => ({ ...prev, grade: v }))}
              options={GRADES.map(g => ({ label: g, value: g }))}
            />
            <Select
              placeholder="性别" allowClear style={{ width: 120 }}
              value={paceFilters.gender}
              onChange={v => setPaceFilters(prev => ({ ...prev, gender: v }))}
              options={GENDERS.map(g => ({ label: g.label, value: g.value }))}
            />
            <Select
              placeholder="规则来源" allowClear style={{ width: 140 }}
              value={paceFilters.source}
              onChange={v => setPaceFilters(prev => ({ ...prev, source: v }))}
              options={[
                { label: '继承全局', value: 'inherit' },
                { label: '自定义', value: 'custom' },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={() => setPaceFilters({ grade: undefined, gender: undefined, source: undefined })}>
              刷新
            </Button>
          </Space>
          <Space>
            {selectedRowKeys.length > 0 && (
              <span style={{ color: '#8c8c8c', fontSize: 13 }}>已选 {selectedRowKeys.length} 项</span>
            )}
            <Button onClick={openBatchEdit} disabled={selectedRowKeys.length === 0}>
              批量编辑
            </Button>
          </Space>
        </div>

        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={paceColumns}
          dataSource={filteredPaceRules}
          rowKey="id"
          size="middle"
          scroll={{ x: 790 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: total => `共 ${total} 条` }}
        />
      </Card>

      {/* Card C: 老师配速设置 */}
      <Card
        title="老师配速设置"
        size="small"
        style={{ flex: '0 0 auto' }}
        extra={<a onClick={openTeacherPaceEdit}><EditOutlined /> 编辑</a>}
      >
        <div style={{ display: 'flex', gap: 64 }}>
          <div>
            <div style={{ color: '#8c8c8c', fontSize: 13 }}>最低配速</div>
            <div style={{ fontWeight: 500, fontSize: 15 }}>{teacherPace.minPace}'00"/公里</div>
          </div>
          <div>
            <div style={{ color: '#8c8c8c', fontSize: 13 }}>最高配速</div>
            <div style={{ fontWeight: 500, fontSize: 15 }}>{teacherPace.maxPace}'00"/公里</div>
          </div>
          <div>
            <div style={{ color: '#8c8c8c', fontSize: 13 }}>更新时间</div>
            <div style={{ fontWeight: 500, fontSize: 15 }}>{teacherPace.updateTime}</div>
          </div>
        </div>
      </Card>

      {/* Drawer A: 编辑全局默认学生配速 */}
      <Drawer
        title="编辑全局默认配速"
        open={globalPaceDrawerOpen}
        onClose={() => setGlobalPaceDrawerOpen(false)}
        width={480}
        destroyOnClose
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setGlobalPaceDrawerOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleSaveGlobalPace}>保存</Button>
          </Space>
        }
      >
        <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 16 }}>
          修改全局默认配速后，所有「继承全局」的规则将自动同步更新
        </div>
        <Form form={globalPaceForm} layout="vertical">
          <Form.Item name="minPace" label="最低配速(分钟/公里)" rules={[{ required: true, message: '请输入最低配速' }]}>
            <InputNumber min={1} max={20} step={0.5} style={{ width: '100%' }} placeholder="3.5" />
          </Form.Item>
          <Form.Item name="maxPace" label="最高配速(分钟/公里)" rules={[{ required: true, message: '请输入最高配速' }]}>
            <InputNumber min={1} max={20} step={0.5} style={{ width: '100%' }} placeholder="8.0" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Drawer B: 批量编辑学生配速 */}
      <Drawer
        title={`批量编辑配速（已选 ${selectedRowKeys.length} 项）`}
        open={batchDrawerOpen}
        onClose={() => setBatchDrawerOpen(false)}
        width={480}
        destroyOnClose
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setBatchDrawerOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleSaveBatch}>应用</Button>
          </Space>
        }
      >
        <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 16 }}>
          设置的值将应用到所有选中的规则。不填写的字段保持原值不变。
        </div>
        <div style={{ marginBottom: 16, background: '#fafafa', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>将应用于以下规则：</div>
          {selectedRows.map(r => (
            <Tag key={r.id} style={{ marginBottom: 4 }}>
              {r.grade} {r.genderLabel}
            </Tag>
          ))}
        </div>
        <Form form={batchForm} layout="vertical">
          <Form.Item name="minPace" label="最低配速(分钟/公里)" extra="留空则不修改">
            <InputNumber min={1} max={20} step={0.5} style={{ width: '100%' }} placeholder="不修改" />
          </Form.Item>
          <Form.Item name="maxPace" label="最高配速(分钟/公里)" extra="留空则不修改">
            <InputNumber min={1} max={20} step={0.5} style={{ width: '100%' }} placeholder="不修改" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Drawer C: 编辑单行学生配速 */}
      <Drawer
        title={editingPace ? `编辑配速规则 - ${editingPace.grade} ${editingPace.genderLabel}` : ''}
        open={!!editingPace}
        onClose={() => setEditingPace(null)}
        width={480}
        destroyOnClose
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {editingPace?.isCustom ? (
              <Button onClick={() => handleResetToGlobal(editingPace)}>恢复全局默认</Button>
            ) : (
              <div />
            )}
            <Space>
              <Button onClick={() => setEditingPace(null)}>取消</Button>
              <Button type="primary" onClick={handleSavePace}>保存</Button>
            </Space>
          </div>
        }
      >
        {editingPace && (
          <>
            <Descriptions column={2} size="small" bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="年级">{editingPace.grade}</Descriptions.Item>
              <Descriptions.Item label="性别">
                <Tag color={editingPace.gender === 'male' ? 'blue' : 'pink'}>
                  {editingPace.genderLabel}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="当前来源">
                {editingPace.isCustom ? <Tag color="blue">自定义</Tag> : <Tag color="default">继承全局</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="全局默认">
                {globalPace.minPace}'00" - {globalPace.maxPace}'00"/公里
              </Descriptions.Item>
            </Descriptions>
            <Form form={paceForm} layout="vertical">
              <Form.Item name="minPace" label="最低配速(分钟/公里)" rules={[{ required: true, message: '请输入最低配速' }]}>
                <InputNumber min={1} max={20} step={0.5} style={{ width: '100%' }} placeholder="3.5" />
              </Form.Item>
              <Form.Item name="maxPace" label="最高配速(分钟/公里)" rules={[{ required: true, message: '请输入最高配速' }]}>
                <InputNumber min={1} max={20} step={0.5} style={{ width: '100%' }} placeholder="8.0" />
              </Form.Item>
            </Form>
          </>
        )}
      </Drawer>

      {/* Drawer D: 编辑老师配速 */}
      <Drawer
        title="编辑老师配速规则"
        open={teacherPaceDrawerOpen}
        onClose={() => setTeacherPaceDrawerOpen(false)}
        width={480}
        destroyOnClose
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setTeacherPaceDrawerOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleSaveTeacherPace}>保存</Button>
          </Space>
        }
      >
        <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 16 }}>
          教师阳光跑配速范围，适用于所有年级的教师
        </div>
        <Form form={teacherPaceForm} layout="vertical">
          <Form.Item name="minPace" label="最低配速(分钟/公里)" rules={[{ required: true, message: '请输入最低配速' }]}>
            <InputNumber min={1} max={20} step={0.5} style={{ width: '100%' }} placeholder="4.0" />
          </Form.Item>
          <Form.Item name="maxPace" label="最高配速(分钟/公里)" rules={[{ required: true, message: '请输入最高配速' }]}>
            <InputNumber min={1} max={20} step={0.5} style={{ width: '100%' }} placeholder="7.0" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}
