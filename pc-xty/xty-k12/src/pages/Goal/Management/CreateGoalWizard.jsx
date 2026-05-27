import { useState } from 'react'
import { Modal, Steps, Form, Input, Select, DatePicker, Radio, Switch, Button, Divider, Tag, message, Tooltip, TreeSelect, Space, Checkbox } from 'antd'
import {
  STUDENT_GOAL_TYPES, CYCLE_TYPES, SPORT_MODES,
  SPORTS_PROJECTS, BUSINESS_TYPES, GRADES, CLASSES_POOL,
  WEEKDAY_OPTIONS, DEFAULT_EXECUTE_WEEKDAYS,
} from '../../../mock/goalList'

const PROJECT_TAGS = { '跳绳': ['无绳空跳'], '引体向上': ['疑似作弊', '疑似多人'] }
const TARGET_UNIT_TYPE_OPTIONS = [
  { label: '成绩单位', value: 'score' },
  { label: '运动次数', value: 'count' },
]
const SCORE_UNIT_OPTIONS = [
  { label: '个', value: '个' },
  { label: '次', value: '次' },
  { label: '厘米', value: '厘米' },
  { label: '秒', value: '秒' },
  { label: '分钟', value: '分钟' },
  { label: '公里', value: '公里' },
]

// 构建年级-班级树形数据（合并选择）
const SCOPE_TREE_DATA = (() => {
  const gradeMap = {}
  CLASSES_POOL.forEach(c => {
    if (!gradeMap[c.grade]) gradeMap[c.grade] = []
    gradeMap[c.grade].push({ title: c.label, value: c.value, key: c.value })
  })
  return Object.entries(gradeMap).map(([grade, children]) => ({
    title: grade,
    value: `grade:${grade}`,
    key: `grade:${grade}`,
    children,
  }))
})()

export default function CreateGoalWizard({ mode, open, onClose, editingGoal, onSave }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [goalTargetType, setGoalTargetType] = useState(editingGoal?.goalTargetType || null)
  const [cycleType, setCycleType] = useState(editingGoal?.cycleType || null)
  const [sportMode, setSportMode] = useState(editingGoal?.sportMode || null)
  const [subConditions, setSubConditions] = useState(editingGoal?.subConditions || [])
  const [sunrunCfg, setSunrunCfg] = useState(editingGoal?.sunrunConfig || {})
  const [scopeConfirmed, setScopeConfirmed] = useState(false)
  const [allModeSports, setAllModeSports] = useState(editingGoal?.countingRules?.sportProjects || 'all')
  const [executeWeekdays, setExecuteWeekdays] = useState(editingGoal?.executeWeekdays || DEFAULT_EXECUTE_WEEKDAYS)

  const isTeacherMode = mode === 'teacher'
  const totalSteps = isTeacherMode ? 5 : 6
  const stepTitles = isTeacherMode
    ? ['选择周期维度', '名称与生效周期', '计入运动项目', '设置目标值', '配置计入规则']
    : ['选择目标类型与周期', '名称与生效周期', '计入运动项目', '设置目标值', '适用范围', '配置计入规则']

  const handleCancel = () => {
    if (currentStep > 0) {
      Modal.confirm({ title: '确认离开', content: '内容尚未保存，确认离开？', onOk: onClose })
    } else {
      onClose()
    }
  }

  const goNext = () => {
    if (currentStep === 0 && !isTeacherMode) {
      if (!goalTargetType) { message.warning('请选择目标类型'); return }
      if (!cycleType) { message.warning('请选择周期维度'); return }
      setCurrentStep(1); return
    }
    if (currentStep === 0 && isTeacherMode) {
      if (!cycleType) { message.warning('请选择周期维度'); return }
      setCurrentStep(1); return
    }

    if (currentStep === 1) {
      form.validateFields(['goalName']).then(() => {
        // validate period fields
        const ctype = cycleType
        const fields = []
        if (ctype === 'daily') fields.push('effectiveStart', 'effectiveEnd', 'executeWeekdays')
        else if (ctype === 'custom') fields.push('effectiveStart', 'effectiveEnd')
        else if (ctype === 'monthly') fields.push('effectiveMonthStart', 'effectiveMonthEnd')
        else if (ctype === 'semester') fields.push('semester')
        if (fields.length === 0) { setCurrentStep(2); return }
        form.validateFields(fields).then(() => setCurrentStep(2)).catch(() => {})
      }).catch(() => {})
      return
    }

    if (currentStep === 2) {
      if (!sportMode) { message.warning('请选择计入运动项目'); return }
      setCurrentStep(3); return
    }

    if (currentStep === 3) {
      const ctype = cycleType
      const fields = []
      if (sportMode === 'all') {
        if (!allModeSports || (Array.isArray(allModeSports) && allModeSports.length === 0)) {
          message.warning('请选择计入运动项目'); return
        }
        fields.push('duration', 'durationUnit')
      }
      else if (sportMode === 'single') fields.push('sportProject', 'targetValue')
      else if (sportMode === 'multi') {
        if (subConditions.length === 0) { message.warning('请至少添加1个子条件'); return }
        // 校验子条件
        const projects = subConditions.map(s => s.sportProject)
        if (projects.some(p => !p)) { message.warning('请完善子条件的运动项目'); return }
        if (subConditions.some(s => !s.targetValue)) { message.warning('请完善子条件的目标值'); return }
        if (new Set(projects).size !== projects.length) { message.warning('运动项目不可重复'); return }
      }
      // sunrun: 校验开启的字段
      if (sportMode === 'sunrun') {
        if (!sunrunCfg.semesterGoal || sunrunCfg.semesterGoal < 0.1) {
          message.warning('请输入里程目标，阳光跑目标必须配置里程'); return
        }
        if (sunrunCfg.weeklyMinEnabled && (!sunrunCfg.weeklyMinTimes || sunrunCfg.weeklyMinTimes < 1)) {
          message.warning('请输入周最低次数'); return
        }
        if (sunrunCfg.monthlyMinEnabled && (!sunrunCfg.monthlyMinTimes || sunrunCfg.monthlyMinTimes < 1)) {
          message.warning('请输入月最低次数'); return
        }
        if (sunrunCfg.monthlyMinEnabled && sunrunCfg.weeklyMinEnabled &&
            sunrunCfg.monthlyMinTimes < sunrunCfg.weeklyMinTimes) {
          message.warning('月最低次数不能低于周最低次数'); return
        }
        if (sunrunCfg.dailyLimitEnabled && (!sunrunCfg.dailyLimitKm || sunrunCfg.dailyLimitKm < 0.1)) {
          message.warning('请输入每日最多计入里程（不低于0.1公里）'); return
        }
        if (sunrunCfg.singleRunMinEnabled && (!sunrunCfg.singleRunMinKm || sunrunCfg.singleRunMinKm < 0.1)) {
          message.warning('请输入单次最低里程（不低于0.1公里）'); return
        }
      }
      // validate number fields
      if (fields.length > 0) {
        form.validateFields(fields).then(() => setCurrentStep(4)).catch(() => {})
      } else {
        setCurrentStep(isTeacherMode ? 4 : 4)
      }
      return
    }

    if (currentStep === 4 && !isTeacherMode) {
      // scope step
      if (goalTargetType === 'class') {
        form.validateFields(['scopeClasses', 'scopeGender']).then(() => {
          if (!scopeConfirmed) { message.warning('请确认适用范围'); return }
          setCurrentStep(5)
        }).catch(() => {})
      } else {
        const scopeLevel = form.getFieldValue('scopeLevel')
        if (!scopeLevel) { message.warning('请选择适用层级'); return }
        const fields = ['scopeLevel', 'scopeGender']
        if (scopeLevel === 'custom') fields.push('scopeTreeValue')
        form.validateFields(fields).then(() => {
          if (!scopeConfirmed) { message.warning('请确认适用范围'); return }
          setCurrentStep(5)
        }).catch(() => {})
      }
      return
    }

    if (currentStep === (isTeacherMode ? 4 : 5)) {
      const finishSave = () => {
        message.success('保存成功')
        onSave?.()
        onClose()
      }
      if (editingGoal && cycleType === 'daily') {
        Modal.confirm({
          title: '确认保存',
          content: '修改执行星期将重新计算每日目标的达标天数、整体状态和达标率。确认保存？',
          onOk: finishSave,
        })
      } else {
        finishSave()
      }
    }
  }

  const isFieldReadonly = (field) => {
    if (!editingGoal) return false
    const readOnlyFields = ['goalTargetType', 'cycleType', 'sportMode', 'scopeLevel', 'scopeGrades', 'scopeClasses', 'scopeGender', 'scopeClasses']
    return readOnlyFields.includes(field)
  }

  const readonlyTip = '创建后不可修改'

  const handleSportModeSelect = (mode) => {
    if (editingGoal) return
    Modal.confirm({
      title: '确认选择',
      content: `计入运动项目创建后不可修改，确认选择「${SPORT_MODES[mode]?.label || mode}」？`,
      onOk: () => setSportMode(mode),
    })
  }

  const handleScopeConfirm = () => {
    Modal.confirm({
      title: '确认选择',
      content: '适用范围创建后不可修改，确认选择？',
      onOk: () => setScopeConfirmed(true),
    })
  }

  const handleAddSubCondition = () => {
    setSubConditions([...subConditions, { sportProject: undefined, targetValue: '', targetUnitType: 'score', unit: '个' }])
  }

  const handleRemoveSubCondition = (idx) => {
    const n = [...subConditions]; n.splice(idx, 1); setSubConditions(n)
  }

  const handleSubConditionChange = (idx, field, value) => {
    const n = [...subConditions]
    n[idx] = { ...n[idx], [field]: value }
    setSubConditions(n)
  }

  // 计算周期概览（阳光跑专用）
  function calculateCycleOverview(cycleType, form) {
    if (cycleType === 'daily' || cycleType === 'custom') {
      const start = form.getFieldValue('effectiveStart')
      const end = form.getFieldValue('effectiveEnd')
      if (!start || !end) return null
      const startDate = new Date(start)
      const endDate = new Date(end)
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1

      // 计算跨越的自然月数（按日历月计算）
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1
      // 计算跨越的自然周数（按日历周计算）
      const weeks = Math.ceil(days / 7)

      return {
        cycleType: 'daily',
        days,
        weeks,
        months,
      }
    } else if (cycleType === 'monthly') {
      const start = form.getFieldValue('effectiveMonthStart')
      const end = form.getFieldValue('effectiveMonthEnd')
      if (!start || !end) return null
      const startDate = new Date(start)
      const endDate = new Date(end)
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1
      // 计算实际天数（从开始月 1 日到结束月最后一天）
      const daysInMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()
      const startDateOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      const endDateOfMonth = new Date(endDate.getFullYear(), endDate.getMonth(), daysInMonth)
      const days = Math.ceil((endDateOfMonth - startDateOfMonth) / (1000 * 60 * 60 * 24)) + 1
      const weeks = Math.ceil(days / 7)
      return {
        cycleType: 'monthly',
        days: days,
        weeks,
        months,
      }
    } else if (cycleType === 'semester') {
      const semester = form.getFieldValue('semester')
      if (!semester) return null
      // 根据学期值计算实际日期范围：2025-2026-2 = 2025-2026 学年第二学期 (2026 年 2 月 -7 月)
      const parts = semester.split('-')
      if (parts.length === 3) {
        const yearStart = parseInt(parts[0])
        const term = parseInt(parts[2])
        // 第一学期：9 月 1 日 - 次年 1 月 31 日；第二学期：2 月 1 日 -7 月 31 日
        let startDate, endDate
        if (term === 1) {
          startDate = new Date(yearStart, 8, 1) // 9 月
          endDate = new Date(yearStart + 1, 0, 31) // 次年 1 月
        } else {
          startDate = new Date(yearStart, 1, 1) // 2 月
          endDate = new Date(yearStart, 6, 31) // 7 月
        }
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
        const weeks = Math.ceil(days / 7)
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1
        const termLabel = term === 1 ? '第一学期 (9 月 -次年 1 月)' : '第二学期 (2 月 -7 月)'
        return {
          cycleType: 'semester',
          days,
          weeks,
          months,
          termLabel,
        }
      }
      return {
        cycleType: 'semester',
        days: 150,
        weeks: 22,
        months: 5,
      }
    }
    return null
  }

  // 获取当前周期概览（用于渲染）
  const getCurrentCycleOverview = () => {
    if (sportMode !== 'sunrun' || !(sunrunCfg.weeklyMinEnabled || sunrunCfg.monthlyMinEnabled)) {
      return null
    }
    return calculateCycleOverview(cycleType, form)
  }
  const currentOverview = getCurrentCycleOverview()

  const usedSubProjects = subConditions.map(s => s.sportProject).filter(Boolean)

  // 根据已选运动项目获取项目标签选项
  function getProjectTagOptions(sportMode, form, subConditions) {
    const options = []
    let projects = []
    if (sportMode === 'all') {
      projects = SPORTS_PROJECTS  // 全部项目时显示所有标签
    } else if (sportMode === 'single') {
      const p = form.getFieldValue('sportProject')
      projects = p ? [p] : []
    } else if (sportMode === 'multi') {
      projects = (subConditions || []).map(s => s.sportProject).filter(Boolean)
    }
    projects.forEach(project => {
      const tags = PROJECT_TAGS[project]
      if (tags) {
        tags.forEach(tag => {
          options.push({ label: `${project}：${tag}`, value: `${project}:${tag}` })
        })
      }
    })
    return options
  }

  return (
    <Modal
      title={editingGoal ? '编辑目标' : '新建目标'}
      open={open} onCancel={handleCancel}
      width={isTeacherMode ? 720 : 800}
      footer={null} destroyOnClose
    >
      <div style={{ padding: '24px 0' }}>
        <Steps current={currentStep} style={{ marginBottom: 32 }} size="small"
          items={stepTitles.map(t => ({ title: t }))} />

        {/* Step 0: 选择类型 */}
        {currentStep === 0 && (
          <div>
            {!isTeacherMode && (
              <>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>目标类型</div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  {Object.values(STUDENT_GOAL_TYPES).map(t => {
                    const disabled = isFieldReadonly('goalTargetType')
                    return (
                      <div key={t.value} onClick={() => { if (!disabled) { setGoalTargetType(t.value); form.setFieldValue('goalTargetType', t.value) } }}
                        style={{
                          flex: 1, border: goalTargetType === t.value ? '2px solid #1677ff' : '1px solid #d9d9d9',
                          borderRadius: 8, padding: 16, cursor: disabled ? 'not-allowed' : 'pointer',
                          background: goalTargetType === t.value ? '#e6f4ff' : '#fff', opacity: disabled ? 0.6 : 1,
                        }}>
                        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{t.label}</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                          {t.value === 'whole_school' ? '面向全校，可按年级/班级/性别筛选' : '面向指定班级，仅对该班级生效'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
            {isTeacherMode && (
              <div style={{ marginBottom: 20, padding: 12, background: '#f5f5f5', borderRadius: 6, fontSize: 13, color: '#595959' }}>
                目标类型：<Tag color="red">教师目标</Tag>（固定为教师目标，无需选择）
              </div>
            )}
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>周期维度</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {Object.values(CYCLE_TYPES).map(c => {
                const disabled = isFieldReadonly('cycleType')
                return (
                  <div key={c.value} onClick={() => { if (!disabled) { setCycleType(c.value); form.setFieldValue('cycleType', c.value) } }}
                    style={{
                      border: cycleType === c.value ? '2px solid #1677ff' : '1px solid #d9d9d9',
                      borderRadius: 8, padding: 14, cursor: disabled ? 'not-allowed' : 'pointer',
                      background: cycleType === c.value ? '#e6f4ff' : '#fff', opacity: disabled ? 0.6 : 1,
                    }}>
                    <Tag color={c.color} style={{ marginBottom: 4 }}>{c.label}</Tag>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                      {c.value === 'daily' ? '自然日 00:00-23:59，每日重置' :
                       c.value === 'monthly' ? '自然月 1日-月末，每月重置' :
                       c.value === 'semester' ? '跟随学期，统计周期内总目标' :
                       '指定时间段内，累计总目标'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 1: 名称与生效周期 */}
        {currentStep === 1 && (
          <Form form={form} layout="vertical" initialValues={editingGoal || {}}>
            <Form.Item name="goalName" label="目标名称"
              rules={[{ required: true, message: '请输入目标名称' }, { max: 30, message: '目标名称不超过30个字符' }]}>
              <Input placeholder="请输入目标名称，2-30 字符" maxLength={30} showCount />
            </Form.Item>
            <Divider />
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>生效周期</div>
            {(cycleType === 'daily' || cycleType === 'custom') && (
              <>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item name="effectiveStart" label={cycleType === 'daily' ? '开始日期' : '开始日期'} rules={[{ required: true, message: '请选择开始日期' }]}>
                    <DatePicker placeholder="开始日期" />
                  </Form.Item>
                  <Form.Item name="effectiveEnd" label={cycleType === 'daily' ? '结束日期' : '结束日期'}
                    rules={[{ required: true, message: '请选择结束日期' }, ({ getFieldValue }) => ({
                      validator(_, value) {
                        const start = getFieldValue('effectiveStart')
                        if (start && value && value <= start) return Promise.reject('结束日期必须大于开始日期')
                        return Promise.resolve()
                      },
                    })]}>
                    <DatePicker placeholder="结束日期" />
                  </Form.Item>
                </div>
                {cycleType === 'daily' && (
                  <Form.Item
                    name="executeWeekdays"
                    label="执行星期"
                    initialValue={executeWeekdays}
                    rules={[{
                      validator(_, value) {
                        if (!value || value.length === 0) return Promise.reject(new Error('请至少选择1个执行星期'))
                        return Promise.resolve()
                      },
                    }]}
                    extra="未选中的日期不要求完成，不计入每日达标天数和整体达标判断"
                  >
                    <Checkbox.Group
                      options={WEEKDAY_OPTIONS}
                      value={executeWeekdays}
                      onChange={(days) => {
                        setExecuteWeekdays(days)
                        form.setFieldValue('executeWeekdays', days)
                      }}
                    />
                  </Form.Item>
                )}
              </>
            )}
            {cycleType === 'monthly' && (
              <div style={{ display: 'flex', gap: 16 }}>
                <Form.Item name="effectiveMonthStart" label="开始月份" rules={[{ required: true, message: '请选择开始月份' }]}>
                  <DatePicker picker="month" placeholder="开始月份" />
                </Form.Item>
                <Form.Item name="effectiveMonthEnd" label="结束月份" rules={[{ required: true, message: '请选择结束月份' }]}>
                  <DatePicker picker="month" placeholder="结束月份" />
                </Form.Item>
              </div>
            )}
            {cycleType === 'semester' && (
              <Form.Item name="semester" label="关联学期" rules={[{ required: true, message: '请选择关联学期' }]}>
                <Select placeholder="选择学期" options={[
                  { label: '2025-2026学年第二学期', value: '2025-2026-2' },
                  { label: '2026-2027学年第一学期', value: '2026-2027-1' },
                ]} />
              </Form.Item>
            )}
          </Form>
        )}

        {/* Step 2: 计入运动项目 */}
        {currentStep === 2 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>选择计入运动项目</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {Object.values(SPORT_MODES).map(s => {
                const disabled = isFieldReadonly('sportMode')
                return (
                  <div key={s.value} onClick={() => { if (!disabled) handleSportModeSelect(s.value) }}
                    style={{
                      border: sportMode === s.value ? '2px solid #1677ff' : '1px solid #d9d9d9',
                      borderRadius: 8, padding: 16, cursor: disabled ? 'not-allowed' : 'pointer',
                      background: sportMode === s.value ? '#e6f4ff' : '#fff', opacity: disabled ? 0.6 : 1,
                    }}>
                    <Tag color={s.color} style={{ marginBottom: 4 }}>{s.label}</Tag>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
                      {s.value === 'all' ? '选择一个或多个运动项目，统计总运动时长' :
                       s.value === 'sunrun' ? '按频次+里程判定' :
                       s.value === 'single' ? '统计某个运动项目的成绩' :
                       '同时要求多个项目达标'}
                    </div>
                    <div style={{ fontSize: 11, color: '#bfbfbf' }}>
                      {s.value === 'all' ? '例：每日运动2小时' :
                       s.value === 'sunrun' ? '例：每周至少跑2次' :
                       s.value === 'single' ? '例：每月跳绳1000个' :
                       '例：每天跳绳100个+跑步1公里'}
                    </div>
                  </div>
                )
              })}
            </div>
            {sportMode && <Tag color="blue" style={{ marginTop: 12 }}>已选：{SPORT_MODES[sportMode.toUpperCase()]?.label || SPORT_MODES[sportMode]?.label || sportMode}</Tag>}
          </div>
        )}

        {/* Step 3: 目标值 */}
        {currentStep === 3 && (
          <Form form={form} layout="vertical" initialValues={editingGoal || {}}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
              设置目标值 — <Tag>{SPORT_MODES[sportMode]?.label || sportMode}</Tag>
            </div>

            {/* 多个项目 */}
            {sportMode === 'all' && (
              <div>
                <Form.Item label="计入运动项目" required>
                  <div style={{ marginBottom: 8 }}>
                    <Checkbox checked={allModeSports === 'all'}
                      onChange={e => setAllModeSports(e.target.checked ? 'all' : [])}>
                      全部项目
                    </Checkbox>
                  </div>
                  {allModeSports !== 'all' && (
                    <Select mode="multiple" placeholder="选择运动项目"
                      value={allModeSports}
                      onChange={setAllModeSports}
                      options={SPORTS_PROJECTS.map(p => ({ label: p, value: p }))}
                      maxTagCount={5} style={{ width: '100%' }} />
                  )}
                </Form.Item>
                <Form.Item label="运动时长" required>
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item name="duration" noStyle
                      rules={[{ required: true, message: '请输入运动时长' }, {
                        validator: (_, value) => {
                          const num = Number(value)
                          if (value !== '' && value !== undefined && value !== null && (isNaN(num) || !Number.isInteger(num) || num < 0 || num > 99999)) {
                            return Promise.reject('运动时长应在0-99999之间')
                          }
                          return Promise.resolve()
                        },
                      }]}>
                      <Input type="number" min={0} max={99999} placeholder="0-99999" style={{ flex: 1 }} />
                    </Form.Item>
                    <Form.Item name="durationUnit" noStyle initialValue="minute"
                      rules={[{ required: true, message: '请选择单位' }]}>
                      <Select style={{ width: 80 }} options={[
                        { label: '分钟', value: 'minute' },
                        { label: '小时', value: 'hour' },
                      ]} />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </div>
            )}

            {/* 阳光跑 */}
            {sportMode === 'sunrun' && (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ width: 130 }}>周最低次数</span>
                    <Switch checked={sunrunCfg.weeklyMinEnabled} onChange={v => setSunrunCfg({ ...sunrunCfg, weeklyMinEnabled: v })}
                    />
                    {sunrunCfg.weeklyMinEnabled && (
                      <Input type="number" min={1} placeholder="次数" style={{ width: 100 }}
                        value={sunrunCfg.weeklyMinTimes}
                        onChange={e => setSunrunCfg({ ...sunrunCfg, weeklyMinTimes: Number(e.target.value) })} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ width: 130 }}>月最低次数</span>
                    <Switch checked={sunrunCfg.monthlyMinEnabled} onChange={v => setSunrunCfg({ ...sunrunCfg, monthlyMinEnabled: v })}
                    />
                    {sunrunCfg.monthlyMinEnabled && (
                      <Input type="number" min={1} placeholder="次数" style={{ width: 100 }}
                        value={sunrunCfg.monthlyMinTimes}
                        onChange={e => setSunrunCfg({ ...sunrunCfg, monthlyMinTimes: Number(e.target.value) })} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ width: 130 }}>每日最多计入限制</span>
                    <Switch checked={sunrunCfg.dailyLimitEnabled} onChange={v => setSunrunCfg({ ...sunrunCfg, dailyLimitEnabled: v })}
                    />
                    {sunrunCfg.dailyLimitEnabled && (
                      <Input type="number" step={0.1} min={0.1} placeholder="公里" style={{ width: 120 }}
                        value={sunrunCfg.dailyLimitKm}
                        onChange={e => setSunrunCfg({ ...sunrunCfg, dailyLimitKm: Number(e.target.value) })}
                        addonAfter="公里" />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ width: 130 }}><span style={{ color: '#ff4d4f' }}>*</span> 里程目标</span>
                    <Input type="number" min={0.1} step={0.1} placeholder="公里（必填）" style={{ width: 120 }}
                      value={sunrunCfg.semesterGoal}
                      onChange={e => setSunrunCfg({ ...sunrunCfg, semesterGoal: Number(e.target.value) })}
                      addonAfter="公里" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ width: 130 }}>单次最低里程</span>
                    <Switch checked={sunrunCfg.singleRunMinEnabled} onChange={v => setSunrunCfg({ ...sunrunCfg, singleRunMinEnabled: v })} />
                    {sunrunCfg.singleRunMinEnabled && (
                      <Input type="number" step={0.1} min={0.1} placeholder="公里" style={{ width: 120 }}
                        value={sunrunCfg.singleRunMinKm}
                        onChange={e => setSunrunCfg({ ...sunrunCfg, singleRunMinKm: Number(e.target.value) })}
                        addonAfter="公里" />
                    )}
                  </div>
                </div>
                {currentOverview && (
                  <div style={{ padding: 12, background: '#e6f4ff', borderRadius: 6, fontSize: 13, color: '#1677ff', marginTop: 12 }}>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>周期概览</div>
                    {currentOverview.cycleType === 'daily' && (
                      <div>
                        <div>覆盖天数：{currentOverview.days} 天</div>
                        {(sunrunCfg.weeklyMinEnabled) && (
                          <div style={{ marginTop: 4 }}>
                            周维度：{currentOverview.weeks} 个自然周
                            <span style={{ color: '#8c8c8c', marginLeft: 8 }}>（周一至周日，不足一个自然周按一个周期，每周都需要满足最低次数要求）</span>
                          </div>
                        )}
                        {(sunrunCfg.monthlyMinEnabled) && (
                          <div style={{ marginTop: 4 }}>
                            月维度：{currentOverview.months} 个自然月
                            <span style={{ color: '#8c8c8c', marginLeft: 8 }}>（不足一个自然月按一个周期，每月都需要满足最低次数要求）</span>
                          </div>
                        )}
                      </div>
                    )}
                    {currentOverview.cycleType === 'monthly' && (
                      <div>
                        <div>覆盖月数：{currentOverview.months} 个自然月</div>
                        {(sunrunCfg.weeklyMinEnabled) && (
                          <div style={{ marginTop: 4 }}>
                            周维度：{currentOverview.weeks} 个自然周
                            <span style={{ color: '#8c8c8c', marginLeft: 8 }}>（周一至周日，不足一个自然周按一个周期，每周都需要满足最低次数要求）</span>
                          </div>
                        )}
                        {(sunrunCfg.monthlyMinEnabled) && (
                          <div style={{ marginTop: 4 }}>
                            月维度：{currentOverview.months} 个自然月
                            <span style={{ color: '#8c8c8c', marginLeft: 8 }}>（不足一个自然月按一个周期，每月都需要满足最低次数要求）</span>
                          </div>
                        )}
                      </div>
                    )}
                    {currentOverview.cycleType === 'semester' && (
                      <div>
                        <div>覆盖天数：{currentOverview.days} 天</div>
                        {(sunrunCfg.weeklyMinEnabled) && (
                          <div style={{ marginTop: 4 }}>
                            周维度：{currentOverview.weeks} 个自然周
                            <span style={{ color: '#8c8c8c', marginLeft: 8 }}>（周一至周日，不足一个自然周按一个周期，每周都需要满足最低次数要求）</span>
                          </div>
                        )}
                        {(sunrunCfg.monthlyMinEnabled) && (
                          <div style={{ marginTop: 4 }}>
                            月维度：{currentOverview.months} 个自然月
                            <span style={{ color: '#8c8c8c', marginLeft: 8 }}>（不足一个自然月按一个周期，每月都需要满足最低次数要求）</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 6, fontSize: 12, color: '#8c8c8c', marginTop: 12 }}>
                  配速要求：全局配置，当前配速阈值范围 3'30" - 8'00"，单次最低里程 0.8km
                </div>
              </div>
            )}

            {/* 单个项目 */}
            {sportMode === 'single' && (
              <>
                <Form.Item name="sportProject" label="运动项目" rules={[{ required: true, message: '请选择运动项目' }]}>
                  <Select placeholder="选择运动项目" showSearch
                    options={SPORTS_PROJECTS.map(p => ({ label: p, value: p }))} />
                </Form.Item>
                <Form.Item name="targetUnitType" label="目标单位类型" initialValue="score"
                  tooltip="成绩单位按完成值大于等于目标值判断；运动次数按累计完成次数大于等于目标次数判断。">
                  <Radio.Group options={TARGET_UNIT_TYPE_OPTIONS} />
                </Form.Item>
                <Form.Item name="targetValue" label="目标值" rules={[{ required: true, message: '请输入目标值' }]}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input type="number" min={1} placeholder="请输入正整数" style={{ flex: 1 }} />
                    <Form.Item name="targetUnit" noStyle initialValue="个">
                      <Select style={{ width: 110 }} options={SCORE_UNIT_OPTIONS} />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </>
            )}

            {/* 多个单项 */}
            {sportMode === 'multi' && (
              <div>
                <div style={{ marginBottom: 12, color: '#8c8c8c', fontSize: 13 }}>添加子条件，所有子条件全部满足即视为达标</div>
                {subConditions.map((sub, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <Select placeholder="运动项目" style={{ width: 150 }} value={sub.sportProject}
                      onChange={v => handleSubConditionChange(idx, 'sportProject', v)}
                      options={SPORTS_PROJECTS.filter(p => !usedSubProjects.includes(p) || sub.sportProject === p).map(p => ({ label: p, value: p }))} />
                    <Select style={{ width: 110 }} value={sub.targetUnitType || 'score'}
                      onChange={v => handleSubConditionChange(idx, 'targetUnitType', v)}
                      options={TARGET_UNIT_TYPE_OPTIONS} />
                    <Input type="number" placeholder="目标值" style={{ width: 100 }} value={sub.targetValue}
                      onChange={e => handleSubConditionChange(idx, 'targetValue', e.target.value)} />
                    <Select style={{ width: 90 }} value={sub.unit || '个'}
                      onChange={v => handleSubConditionChange(idx, 'unit', v)}
                      options={SCORE_UNIT_OPTIONS} />
                    <Button danger size="small" onClick={() => handleRemoveSubCondition(idx)}>删除</Button>
                  </div>
                ))}
                <Button type="dashed" block onClick={handleAddSubCondition}>+ 添加子条件</Button>
              </div>
            )}
          </Form>
        )}

        {/* Step 4: 适用范围（仅学生模式） */}
        {currentStep === 4 && !isTeacherMode && (
          <Form form={form} layout="vertical" initialValues={editingGoal || {}}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>适用范围</div>

            {goalTargetType === 'class' ? (
              <>
                <Form.Item name="scopeClasses" label="选择班级" rules={[{ required: true, message: '请选择班级' }]}
                  extra="班级目标仅可选择1个班级">
                  <Select placeholder="选择班级" options={CLASSES_POOL.map(c => ({ label: c.label, value: c.value }))}
                    disabled={isFieldReadonly('scopeClasses')} />
                </Form.Item>
                <Form.Item name="scopeGender" label="性别设定" rules={[{ required: true, message: '请选择适用性别' }]}>
                  <Radio.Group disabled={isFieldReadonly('scopeGender')}>
                    <Radio value="all">不限</Radio>
                    <Radio value="male">男</Radio>
                    <Radio value="female">女</Radio>
                  </Radio.Group>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item name="scopeLevel" label="适用层级" rules={[{ required: true, message: '请选择适用层级' }]}>
                  <Radio.Group disabled={isFieldReadonly('scopeLevel')} onChange={v => { form.setFieldValue('scopeTreeValue', []) }}>
                    <Radio value="all">全校</Radio>
                    <Radio value="custom">指定年级/班级</Radio>
                  </Radio.Group>
                </Form.Item>
                {form.getFieldValue('scopeLevel') === 'custom' && (
                  <Form.Item name="scopeTreeValue" label="选择年级/班级" rules={[{ required: true, message: '请至少选择1个年级或班级' }]}
                    extra="勾选年级则包含该年级下所有班级，也可仅勾选年级下的部分班级">
                    <TreeSelect treeCheckable treeData={SCOPE_TREE_DATA} placeholder="选择年级或班级"
                      disabled={isFieldReadonly('scopeGrades')} maxTagCount={5} showCheckedStrategy={TreeSelect.SHOW_ALL} />
                  </Form.Item>
                )}
                <Form.Item name="scopeGender" label="性别设定" rules={[{ required: true, message: '请选择适用性别' }]}>
                  <Radio.Group disabled={isFieldReadonly('scopeGender')}>
                    <Radio value="all">不限</Radio>
                    <Radio value="male">男</Radio>
                    <Radio value="female">女</Radio>
                  </Radio.Group>
                </Form.Item>
              </>
            )}

            {!scopeConfirmed && (
              <Button onClick={handleScopeConfirm} type={scopeConfirmed ? 'default' : 'dashed'} size="small">
                {scopeConfirmed ? '已确认' : '点击确认适用范围'}
              </Button>
            )}
            {scopeConfirmed && <Tag color="success" style={{ marginLeft: 8 }}>已确认</Tag>}
          </Form>
        )}

        {/* Step 4 (teacher) / Step 5 (student): 计入规则 */}
        {currentStep === (isTeacherMode ? 4 : 5) && (
          <Form form={form} layout="vertical" initialValues={editingGoal?.countingRules || {}}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>配置计入规则</div>

            {sportMode !== 'sunrun' ? (
              <>
                <Form.Item name="sportProjects" label="计入运动项目" rules={[{ required: true, message: '请至少选择1个运动项目' }]}>
                  {sportMode === 'all' ? (
                    <Select mode="multiple" placeholder="已选项目" disabled
                      value={allModeSports === 'all' ? SPORTS_PROJECTS : allModeSports}
                      options={SPORTS_PROJECTS.map(p => ({ label: p, value: p }))} maxTagCount={5} />
                  ) : sportMode === 'single' ? (
                    <Select mode="multiple" placeholder="已选项目" disabled
                      options={form.getFieldValue('sportProject') ? [{ label: form.getFieldValue('sportProject'), value: form.getFieldValue('sportProject') }] : []} />
                  ) : (
                    <Select mode="multiple" placeholder="已选项目" disabled
                      options={(subConditions || []).map(s => ({ label: s.sportProject, value: s.sportProject }))} />
                  )}
                </Form.Item>
                <Form.Item name="businessTypes" label="业务类型" rules={[{ required: true, message: '请至少选择1种业务类型' }]}>
                  <Select mode="multiple" placeholder="选择业务类型"
                    options={BUSINESS_TYPES.filter(b => b !== '阳光跑').map(b => ({ label: b, value: b }))} maxTagCount={5} />
                </Form.Item>
              </>
            ) : (
              <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 6, marginBottom: 12, fontSize: 13, color: '#595959' }}>
                计入运动项目：阳光跑（固定）<br />
                业务类型：阳光跑（固定）
              </div>
            )}
            <Form.Item name="scoreStatuses" label="成绩状态" rules={[{ required: true, message: '请至少选择1种成绩状态' }]}>
              <Checkbox.Group options={[
                { label: '正常', value: '正常' },
                { label: '异常', value: '异常' },
              ]} />
            </Form.Item>
            {sportMode !== 'sunrun' && (
              <Form.Item name="projectTags" label="项目标签（可选）">
                <Select mode="multiple" placeholder="选择项目标签" allowClear
                  options={getProjectTagOptions(sportMode, form, subConditions)} />
              </Form.Item>
            )}
          </Form>
        )}

        {/* 适用范围确认弹在 step 4 */}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        {currentStep > 0
          ? <Button onClick={() => setCurrentStep(currentStep - 1)}>上一步</Button>
          : <div />}
        <Button type="primary" onClick={goNext}>
          {currentStep === (isTeacherMode ? 4 : 5) ? '确认保存' : '下一步'}
        </Button>
      </div>
    </Modal>
  )
}
