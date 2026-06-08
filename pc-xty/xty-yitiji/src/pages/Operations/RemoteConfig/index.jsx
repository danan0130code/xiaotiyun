import {
  Alert,
  Button,
  Collapse,
  Descriptions,
  Drawer,
  Empty,
  InputNumber,
  Modal,
  Radio,
  Select,
  Slider,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  message,
} from 'antd'
import {
  ArrowLeftOutlined,
  LeftOutlined,
  CameraOutlined,
  ClockCircleOutlined,
  CloudSyncOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  SaveOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { devicesByType } from '../../../mock/devices'
import {
  faceCaptureConfig,
  imageDisplayConfig,
  mockCommandLogs,
  mockConfigRecords,
  remoteDevicesState,
  sportProjectOptions,
  sportProjectRules,
} from '../../../mock/remoteConfig'

const modeOptions = [
  { label: '体育锻炼模式', value: 'sport' },
  { label: '人脸抓拍模式', value: 'face' },
  { label: '相机图像显示设置', value: 'image' },
]

const saveText = {
  idle: '未保存',
  saving: '保存中',
  success: '保存成功',
  error: '保存失败',
}

const saveColor = {
  idle: 'default',
  saving: 'processing',
  success: 'success',
  error: 'error',
}

function getRemoteControlStorageKey(deviceId) {
  return `xty-yitiji-remote-control:${deviceId || 'default'}`
}

function readRemoteControlSession(deviceId) {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(getRemoteControlStorageKey(deviceId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.expiresAt || Number.isNaN(parsed.expiresAt)) return null
    if (parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(getRemoteControlStorageKey(deviceId))
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeRemoteControlSession(deviceId, expiresAt) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(getRemoteControlStorageKey(deviceId), JSON.stringify({ expiresAt }))
}

function clearRemoteControlSession(deviceId) {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(getRemoteControlStorageKey(deviceId))
}

function findDevice(deviceId) {
  const allDevices = Object.values(devicesByType).flat()
  if (!deviceId) return allDevices.find(device => device.id === 'ytj1-001') || allDevices[0]
  return allDevices.find(device => device.id === deviceId || device.deviceId === deviceId)
}

function getRemoteState(device) {
  if (!device) return null
  return remoteDevicesState[device.id] || remoteDevicesState.default
}

function SnapshotCanvas({ mode, project, snapshotTime }) {
  const isTrack = project === '短跑' || project === '长跑'
  const isFace = mode === 'face'
  const isImage = mode === 'image'

  return (
    <div className={`remote-canvas${isImage ? ' is-image-mode' : ''}`}>
      <div className="remote-canvas-toolbar">
        <span className="draw-tool-icons">
          <VideoCameraOutlined />
          <span>▭</span>
          <span>⌕</span>
          <span>⌫</span>
          <CameraOutlined />
          <span>⊙</span>
          <span>⛶</span>
        </span>
        <span>{snapshotTime || '未获取'}</span>
      </div>
      <div className="remote-canvas-stage">
        <div className="court-grid" />
        {!isImage && (
          <>
            <div className={isFace ? 'face-rule-box' : 'detect-rule-box'} />
            {isTrack ? (
              <>
                <div className="track-line line-1" />
                <div className="track-line line-2" />
                <div className="finish-line" />
              </>
            ) : (
              <div className="reference-line" />
            )}
          </>
        )}
        {isImage && (
          <div className="image-preview-copy">
            <CameraOutlined />
            <span>图像显示设置不需要画线，参数保存到当前相机</span>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusSummary({ device, isDeviceOnline }) {
  const items = [
    { label: '设备名称', children: device?.name || '--' },
    { label: '设备类型', children: device?.type || '--' },
    { label: '设备状态', children: <Tag color={isDeviceOnline ? 'success' : 'default'}>{isDeviceOnline ? '在线' : '离线'}</Tag> },
  ]

  return <Descriptions className="remote-summary" size="small" bordered column={3} items={items} />
}

function SectionTitle({ children }) {
  return <div className="legacy-section-title">{children}</div>
}

function CameraSwitcher({ cameras, cameraId, onChange, disabled }) {
  const currentIndex = Math.max(0, cameras.findIndex(camera => camera.id === cameraId))
  const current = cameras[currentIndex] || cameras[0]

  const switchCamera = direction => {
    if (disabled || cameras.length === 0) return
    const nextIndex = (currentIndex + direction + cameras.length) % cameras.length
    onChange(cameras[nextIndex].id)
  }

  return (
    <div className="camera-switcher">
      <Button
        className="camera-arrow-btn"
        icon={<LeftOutlined />}
        disabled={disabled || cameras.length <= 1}
        onClick={() => switchCamera(-1)}
      />
      <div className="camera-switcher-main">
        <span className="camera-switcher-label">当前相机</span>
        <Select
          className="camera-select"
          value={current?.id}
          disabled={disabled || cameras.length === 0}
          options={cameras.map(camera => ({
            label: `${camera.name}（${camera.status}）`,
            value: camera.id,
          }))}
          onChange={onChange}
        />
        <Tag color={current?.status === '在线' ? 'success' : 'default'}>{current?.status || '--'}</Tag>
        <span>最近一次配置时间：{current?.lastConfiguredAt || '--'}</span>
      </div>
      <Button
        className="camera-arrow-btn"
        icon={<RightOutlined />}
        disabled={disabled || cameras.length <= 1}
        onClick={() => switchCamera(1)}
      />
    </div>
  )
}

function SportConfig({ disabled, projectSelectDisabled = false, project, onProjectChange, sportMode, onSportModeChange, snapshotTime, onSnapshot, onSave, onDirty }) {
  const rule = sportProjectRules[project]

  return (
    <div className="legacy-draw-shell">
      <div className="legacy-draw-layout">
        <div className="legacy-param-panel">
          <SectionTitle>当前模式</SectionTitle>
          <div className="legacy-current-mode">{project}</div>

          <SectionTitle>项目选择</SectionTitle>
          <Select
            value={project}
            disabled={projectSelectDisabled}
            options={sportProjectOptions.map(item => ({ label: item, value: item }))}
            onChange={onProjectChange}
          />

          <SectionTitle>模式选择</SectionTitle>
          <Radio.Group
            disabled={disabled}
            value={sportMode}
            options={rule.modes.map(item => ({ label: `${item}模式`, value: item }))}
            onChange={event => {
              onSportModeChange(event.target.value)
            }}
          />

          <SectionTitle>画线元素</SectionTitle>
          <div className="tool-chip-list legacy-tool-list">
            {rule.drawingTools.map(tool => (
              <span className="tool-chip" key={tool}>{tool}</span>
            ))}
          </div>

          <SectionTitle>标准动作配置</SectionTitle>
          {rule.standardParams.map(item => (
            <div className="legacy-form-row" key={item}>
              <label>{item}</label>
              <div className="legacy-slider-line"><span /></div>
              <InputNumber size="small" min={0} max={100} defaultValue={5} disabled={disabled} />
            </div>
          ))}

          <SectionTitle>违规动作配置</SectionTitle>
          {rule.violationParams.map(item => (
            <div className="legacy-switch-row" key={item}>
              <span>{item}</span>
              {item.includes('过滤') || item.includes('时间') ? (
                <InputNumber size="small" min={0} max={100} defaultValue={item.includes('时间') ? 3 : 23} disabled={disabled} />
              ) : (
                <Switch defaultChecked disabled={disabled} />
              )}
            </div>
          ))}
          <Button className="legacy-save-btn" danger type="primary" disabled={disabled} icon={<SaveOutlined />} onClick={onSave}>
            保存
          </Button>
        </div>

        <div className="legacy-canvas-panel">
          <Button disabled={disabled} icon={<CameraOutlined />} onClick={onSnapshot}>
            获取现场画面
          </Button>
          <SnapshotCanvas mode="sport" project={project} snapshotTime={snapshotTime} />
          <div className="legacy-legend">
            <span><i className="legend-green" />检测区域</span>
            <span><i className="legend-yellow" />参考线</span>
            <span><i className="legend-red" />人脸识别区域</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FaceSliderField({ item, disabled }) {
  return (
    <div className="face-slider-control">
      <Slider defaultValue={item.value} min={item.min ?? 0} max={item.max ?? 100} disabled={disabled} />
      <InputNumber
        min={item.min ?? 0}
        max={item.max ?? 100}
        defaultValue={item.value}
        disabled={disabled}
        suffix={item.suffix}
      />
    </div>
  )
}

function FaceTransferField({ item, disabled }) {
  return (
    <div className="face-transfer-boxes">
      <div className="face-transfer-panel">
        <strong>可选择内容</strong>
        <div className="face-transfer-head">
          <span>类型</span>
        </div>
        {item.available.map(option => (
          <label key={option}>
            <input disabled={disabled} type="checkbox" />
            {option}
          </label>
        ))}
      </div>
      <div className="face-transfer-actions">
        <Button size="small" disabled>{'>'}</Button>
        <Button size="small" disabled>{'<'}</Button>
      </div>
      <div className="face-transfer-panel">
        <strong>已选择</strong>
        <div className="face-transfer-head is-selected">
          <span>类型</span>
          <span>排序</span>
        </div>
        {item.selected.map(option => (
          <label key={option}>
            <input disabled={disabled} type="checkbox" />
            {option}
            <span className="face-transfer-sort">↑ ↓</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function FaceFieldRows({ items, disabled, onDirty, section }) {
  const [switchValues, setSwitchValues] = useState({
    固定像素: false,
    人脸曝光: false,
    人脸姿态过滤: false,
  })

  const handleSwitchChange = (label, checked) => {
    setSwitchValues(prev => ({ ...prev, [label]: checked }))
    onDirty()
  }

  const rows = []
  let hideImageHeight = false
  let hideExposureFields = false
  let hiddenExposureCount = 0
  let hidePoseFields = false
  let hiddenPoseCount = 0

  items.forEach(item => {
    if (hideImageHeight && item.label === '图片高度') return

    if (hideExposureFields && hiddenExposureCount < 2) {
      hiddenExposureCount += 1
      return
    }

    if (hidePoseFields && hiddenPoseCount < 4) {
      hiddenPoseCount += 1
      return
    }

    if (item.type === 'group') {
      rows.push(<div className="legacy-face-group" key={item.label}>{item.label}</div>)
      return
    }
    if (item.type === 'transfer') {
      rows.push(
        <div className="face-field-row is-transfer" key={item.label}>
          <span>{item.label}</span>
          <FaceTransferField item={item} disabled={disabled} />
        </div>
      )
      return
    }
    if (typeof item.enabled === 'boolean') {
      const checked = Object.prototype.hasOwnProperty.call(switchValues, item.label) ? switchValues[item.label] : item.enabled

      if (item.label === '固定像素' && !checked) hideImageHeight = true
      if (item.label === '人脸曝光' && !checked) hideExposureFields = true
      if (item.label === '人脸姿态过滤' && !checked) hidePoseFields = true

      rows.push(
        <div className="face-field-row is-switch" key={item.label}>
          <span>
            {item.label === '人脸姿态过滤' && <InfoCircleOutlined className="face-info-icon" />}
            {item.label}
          </span>
          <Switch
            checked={checked}
            className="face-green-switch"
            disabled={disabled}
            onChange={value => handleSwitchChange(item.label, value)}
          />
        </div>
      )
      return
    }
    if (item.type === 'select') {
      rows.push(
        <div className="face-field-row" key={item.label}>
          <span>{item.label}</span>
          <Select
            className="face-select-control"
            defaultValue={item.value}
            disabled={disabled}
            options={item.options.map(option => ({ label: option, value: option }))}
            onChange={onDirty}
          />
        </div>
      )
      return
    }
    if (item.type === 'radio') {
      rows.push(
        <div className="face-field-row" key={item.label}>
          <span>{item.label}</span>
          <Radio.Group
            defaultValue={item.value}
            disabled={disabled}
            options={item.options.map(option => ({ label: option, value: option }))}
            onChange={onDirty}
          />
        </div>
      )
      return
    }
    if (item.type === 'slider') {
      rows.push(
        <div className={`face-field-row${section === 'advanced' ? ' is-wide' : ''}`} key={item.label}>
          <span>{item.label}</span>
          <FaceSliderField item={item} disabled={disabled} />
        </div>
      )
      return
    }
    if (item.type === 'number') {
      rows.push(
        <div className="face-field-row" key={item.label}>
          <span>{item.label}</span>
          <div className="face-number-control">
            {item.prefix && <em>{item.prefix}</em>}
            <InputNumber
              min={item.min}
              max={item.max}
              step={item.step}
              defaultValue={item.value}
              disabled={disabled}
              suffix={item.suffix}
              onChange={onDirty}
            />
          </div>
        </div>
      )
      return
    }
    if (item.type === 'captureCount') {
      rows.push(
        <div className="face-field-row" key={item.label}>
          <span>{item.label}</span>
          <div className="face-capture-count">
            <Radio.Group
              defaultValue={item.value}
              disabled={disabled}
              options={item.options.map(option => ({ label: option, value: option }))}
              onChange={onDirty}
            />
            <InputNumber min={1} max={99} defaultValue={item.count} disabled={disabled} onChange={onDirty} />
          </div>
        </div>
      )
      return
    }
    rows.push(
      <div className="face-field-row is-readonly" key={item.label}>
        <span>{item.label}</span>
        <strong>{item.value}</strong>
      </div>
    )
  })

  return rows
}

function FaceConfig({ disabled, snapshotTime, onSnapshot, onSave, onDirty }) {
  const [activeFaceTab, setActiveFaceTab] = useState('rule')

  return (
    <div className="face-capture-shell">
      <div className="legacy-tabs face-config-tabs">
        <button className={activeFaceTab === 'rule' ? 'is-active' : ''} type="button" onClick={() => setActiveFaceTab('rule')}>规则配置</button>
        <button className={activeFaceTab === 'overlay' ? 'is-active' : ''} type="button" onClick={() => setActiveFaceTab('overlay')}>叠加与抓图</button>
        <button className={activeFaceTab === 'advanced' ? 'is-active' : ''} type="button" onClick={() => setActiveFaceTab('advanced')}>高级参数</button>
      </div>

      <div className={`face-config-layout is-${activeFaceTab}${activeFaceTab === 'advanced' ? ' is-single' : ''}`}>
        <div className="face-config-form">
          <div className="face-mode-banner">
            <span>人脸抓拍模式</span>
            <strong>{activeFaceTab === 'rule' ? '规则区域与瞳距配置' : activeFaceTab === 'overlay' ? '信息叠加、背景图片和目标图片设置' : '抓拍参数与人脸质量控制'}</strong>
          </div>

          {activeFaceTab === 'rule' && (
            <div className="face-section">
              <SectionTitle>规则配置</SectionTitle>
              <div className="face-field-row is-switch">
                <span>启用</span>
                <Switch className="face-green-switch" defaultChecked disabled={disabled} onChange={onDirty} />
              </div>
              <div className="face-field-row">
                <span>最小瞳距</span>
                <InputNumber min={1} max={500} defaultValue={faceCaptureConfig.minPupilDistance} disabled={disabled} onChange={onDirty} />
              </div>
              <div className="face-field-row">
                <span>最大瞳距</span>
                <InputNumber min={1} max={500} defaultValue={faceCaptureConfig.maxPupilDistance} disabled={disabled} onChange={onDirty} />
              </div>
              <p className="legacy-note">请确保需抓拍的人脸完整包含在规则框内。</p>
            </div>
          )}

          {activeFaceTab === 'overlay' && (
            <div className="face-section">
              <SectionTitle>叠加与抓图</SectionTitle>
              <FaceFieldRows items={faceCaptureConfig.overlays} disabled={disabled} onDirty={onDirty} />
            </div>
          )}

          {activeFaceTab === 'advanced' && (
            <div className="face-section">
              <SectionTitle>高级参数</SectionTitle>
              <FaceFieldRows items={faceCaptureConfig.advanced} disabled={disabled} onDirty={onDirty} section="advanced" />
            </div>
          )}

          <Button className="legacy-save-btn" danger type="primary" disabled={disabled} icon={<SaveOutlined />} onClick={onSave}>
            保存
          </Button>
        </div>

        {activeFaceTab !== 'advanced' && (
          <div className="face-preview-column">
            {activeFaceTab === 'rule' && (
              <>
                <Button disabled={disabled} icon={<CameraOutlined />} onClick={onSnapshot}>
                  获取现场画面
                </Button>
                <SnapshotCanvas mode="face" snapshotTime={snapshotTime} />
              </>
            )}
            {activeFaceTab === 'overlay' && (
              <div className="face-person-card">
                <div className="face-person-stage">
                  <div className="face-person-head">
                    <span className="hair" />
                    <span className="ear" />
                    <span className="eye" />
                    <span className="nose" />
                  </div>
                  <div className="face-person-neck" />
                  <div className="face-person-body" />
                  <div className="target-box width-box" />
                  <div className="target-box face-height-box" />
                  <div className="target-box body-height-box" />
                  <span className="target-copy width-copy">宽度</span>
                  <span className="target-copy face-copy">人脸部分高度</span>
                  <span className="target-copy body-copy">身体部分高度</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ImageField({ field, disabled, onDirty }) {
  if (field.type === 'tip') {
    return <div className="image-setting-tip">{field.text}</div>
  }
  if (field.type === 'tag') {
    return <div className="image-setting-tag">{field.label}</div>
  }
  if (field.type === 'slider') {
    return (
      <div className="image-setting-row">
        <label>{field.label}</label>
        <div className="image-slider-control">
          <Slider defaultValue={field.value} min={0} max={100} disabled={disabled} onChange={onDirty} />
          <InputNumber min={0} max={100} defaultValue={field.value} disabled={disabled} onChange={onDirty} />
        </div>
      </div>
    )
  }
  if (field.type === 'select') {
    return (
      <div className="image-setting-row">
        <label>{field.label}</label>
        <Select
          className="camera-image-select"
          defaultValue={field.value}
          disabled={disabled}
          options={field.options.map(item => ({ label: item, value: item }))}
          onChange={onDirty}
        />
      </div>
    )
  }
  if (field.type === 'radio') {
    return (
      <div className="image-setting-row">
        <label>{field.label}</label>
        <Radio.Group
          defaultValue={field.value}
          disabled={disabled}
          options={field.options.map(item => ({ label: item, value: item }))}
          onChange={onDirty}
        />
      </div>
    )
  }
  if (field.type === 'switch') {
    return (
      <div className="image-setting-row is-switch">
        <label>{field.label}</label>
        <Switch defaultChecked={field.value} disabled={disabled} onChange={onDirty} />
      </div>
    )
  }
  return null
}

function ImageConfig({ disabled, onSave, onDirty }) {
  const [activePackage, setActivePackage] = useState(imageDisplayConfig.packages[0])

  return (
    <div className="legacy-image-settings">
      <SectionTitle>参数套餐</SectionTitle>
      <div className="package-grid">
        {imageDisplayConfig.packages.map(item => (
          <button
            key={item}
            className={item === activePackage ? 'is-active' : ''}
            disabled={disabled}
            type="button"
            onClick={() => {
              setActivePackage(item)
              onDirty()
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <Collapse
        className="image-settings-collapse"
        bordered={false}
        expandIconPlacement="end"
        items={imageDisplayConfig.groups.map(group => ({
          key: group.name,
          label: group.name,
          children: (
            <div className="image-setting-fields">
              {group.fields.map(field => (
                <ImageField key={`${group.name}-${field.label || field.text}`} field={field} disabled={disabled} onDirty={onDirty} />
              ))}
            </div>
          ),
        }))}
      />
      <Button className="legacy-save-btn" danger type="primary" disabled={disabled} icon={<SaveOutlined />} onClick={onSave}>
        保存
      </Button>
    </div>
  )
}

export default function RemoteConfig() {
  const navigate = useNavigate()
  const { deviceId } = useParams()
  const device = useMemo(() => findDevice(deviceId), [deviceId])
  const state = useMemo(() => getRemoteState(device), [device])
  const isDeviceOnline = state?.onlineStatus === '在线' && device?.status !== '离线'
  const initialRemoteSession = useMemo(() => readRemoteControlSession(device?.id), [device?.id])
  const [cameraId, setCameraId] = useState(state?.cameras?.[0]?.id)
  const [mode, setMode] = useState('face')
  const [project, setProject] = useState('引体向上')
  const [sportMode, setSportMode] = useState(sportProjectRules.引体向上.modes[0])
  const [snapshotTime, setSnapshotTime] = useState(state?.lastSnapshot)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [commandLogs, setCommandLogs] = useState(mockCommandLogs)
  const [configRecords, setConfigRecords] = useState(mockConfigRecords)
  const [recordsOpen, setRecordsOpen] = useState(false)
  const [idleTimeoutOpen, setIdleTimeoutOpen] = useState(false)
  const [idleTimeoutMinutes, setIdleTimeoutMinutes] = useState(60)
  const [remoteControlActive, setRemoteControlActive] = useState(Boolean(initialRemoteSession))
  const [remoteControlExpiresAt, setRemoteControlExpiresAt] = useState(initialRemoteSession?.expiresAt || null)
  const [autoExitSeconds, setAutoExitSeconds] = useState(() => (initialRemoteSession ? Math.max(0, Math.ceil((initialRemoteSession.expiresAt - Date.now()) / 1000)) : 60 * 60))
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [cameraConfigTimes, setCameraConfigTimes] = useState(() => {
    return Object.fromEntries((state?.cameras || []).map(camera => [camera.id, camera.lastConfiguredAt]))
  })
  const editDisabled = !remoteControlActive
  const autoExitCountdown = `${String(Math.floor(autoExitSeconds / 60)).padStart(2, '0')}:${String(autoExitSeconds % 60).padStart(2, '0')}`

  const selectedCameraSource = state?.cameras?.find(camera => camera.id === cameraId) || state?.cameras?.[0]
  const selectedCamera = selectedCameraSource
    ? { ...selectedCameraSource, lastConfiguredAt: cameraConfigTimes[selectedCameraSource.id] || selectedCameraSource.lastConfiguredAt }
    : undefined
  const camerasWithConfigTimes = (state?.cameras || []).map(camera => ({
    ...camera,
    lastConfiguredAt: cameraConfigTimes[camera.id] || camera.lastConfiguredAt,
  }))

  const appendLog = (command, status, result) => {
    setCommandLogs(prev => [
      { time: dayjs().format('HH:mm:ss'), command, status, result },
      ...prev,
    ])
  }

  const resetAutoExitCountdown = () => {
    if (remoteControlActive) {
      const nextExpiresAt = Date.now() + idleTimeoutMinutes * 60 * 1000
      setRemoteControlExpiresAt(nextExpiresAt)
      setAutoExitSeconds(idleTimeoutMinutes * 60)
      writeRemoteControlSession(device?.id, nextExpiresAt)
    }
  }

  useEffect(() => {
    const activeSession = readRemoteControlSession(device?.id)
    if (!activeSession) {
      setRemoteControlActive(false)
      setRemoteControlExpiresAt(null)
      return
    }

    setRemoteControlActive(true)
    setRemoteControlExpiresAt(activeSession.expiresAt)
    setAutoExitSeconds(Math.max(0, Math.ceil((activeSession.expiresAt - Date.now()) / 1000)))
  }, [device?.id])

  useEffect(() => {
    if (!remoteControlActive) return undefined

    const handleUserAction = () => {
      const nextExpiresAt = Date.now() + idleTimeoutMinutes * 60 * 1000
      setRemoteControlExpiresAt(nextExpiresAt)
      setAutoExitSeconds(idleTimeoutMinutes * 60)
      writeRemoteControlSession(device?.id, nextExpiresAt)
    }
    document.addEventListener('click', handleUserAction, true)
    document.addEventListener('input', handleUserAction, true)
    document.addEventListener('keydown', handleUserAction, true)

    return () => {
      document.removeEventListener('click', handleUserAction, true)
      document.removeEventListener('input', handleUserAction, true)
      document.removeEventListener('keydown', handleUserAction, true)
    }
  }, [device?.id, remoteControlActive, idleTimeoutMinutes])

  useEffect(() => {
    if (!remoteControlActive) return undefined

    const timer = window.setInterval(() => {
      const remainingSeconds = remoteControlExpiresAt ? Math.max(0, Math.ceil((remoteControlExpiresAt - Date.now()) / 1000)) : 0
      setAutoExitSeconds(remainingSeconds)
      if (remainingSeconds <= 0) {
          window.clearInterval(timer)
          setRemoteControlActive(false)
          setRemoteControlExpiresAt(null)
          setHasUnsavedChanges(false)
          setSaveStatus('idle')
          clearRemoteControlSession(device?.id)
          appendLog('自动退出运维模式', '成功', '空闲时间已到，WebSocket 已断开')
          message.info('已自动退出远程配置模式')
      }
    }, 1000)

    return () => window.clearInterval(timer)
  }, [device?.id, remoteControlActive, remoteControlExpiresAt])

  const markDirty = () => {
    if (editDisabled) return
    resetAutoExitCountdown()
    setHasUnsavedChanges(true)
    setSaveStatus('idle')
  }

  const handleSnapshot = () => {
    if (editDisabled) return
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    setSnapshotTime(time)
    markDirty()
    appendLog('获取现场画面', '成功', `${selectedCamera?.name || '--'} 已返回现场图`)
    message.success('现场画面已更新')
  }

  const handleModeChange = nextMode => {
    if (nextMode === mode) return

    if (editDisabled) {
      setMode(nextMode)
      setSaveStatus('idle')
      setHasUnsavedChanges(false)
      return
    }

    const currentModeLabel = modeOptions.find(item => item.value === mode)?.label
    const nextModeLabel = modeOptions.find(item => item.value === nextMode)?.label

    Modal.confirm({
      title: '切换配置模式',
      icon: <ExclamationCircleOutlined />,
      content: `当前${currentModeLabel}存在未保存内容，切换到${nextModeLabel}后，当前未保存的画线和参数配置会被清空。确认切换吗？`,
      okText: '确认切换',
      cancelText: '继续编辑',
      onOk: () => {
        setMode(nextMode)
        setHasUnsavedChanges(false)
        setSaveStatus('idle')
        message.info('已切换配置模式，未保存内容已清空')
      },
    })
  }

  const handleCameraChange = nextCameraId => {
    if (nextCameraId === cameraId) return
    const nextCamera = state?.cameras?.find(camera => camera.id === nextCameraId)

    if (editDisabled) {
      setCameraId(nextCameraId)
      setSaveStatus('idle')
      setHasUnsavedChanges(false)
      return
    }

    Modal.confirm({
      title: '切换相机',
      icon: <ExclamationCircleOutlined />,
      content: `当前相机存在未保存内容，切换到${nextCamera?.name || '其他相机'}后，当前未保存的画线和参数配置会被清空。确认切换吗？`,
      okText: '确认切换',
      cancelText: '继续编辑',
      onOk: () => {
        setCameraId(nextCameraId)
        setHasUnsavedChanges(false)
        setSaveStatus('idle')
        setSnapshotTime(state?.lastSnapshot)
        message.info('已切换相机，未保存内容已清空')
      },
    })
  }

  const handleProjectChange = nextProject => {
    if (nextProject === project) return

    if (editDisabled) {
      setProject(nextProject)
      setSportMode(sportProjectRules[nextProject].modes[0])
      setSaveStatus('idle')
      setHasUnsavedChanges(false)
      return
    }

    Modal.confirm({
      title: '切换运动项目',
      icon: <ExclamationCircleOutlined />,
      content: `当前运动项目存在未保存内容，切换到${nextProject}后，当前未保存的画线和参数配置会被清空。确认切换吗？`,
      okText: '确认切换',
      cancelText: '继续编辑',
      onOk: () => {
        setProject(nextProject)
        setSportMode(sportProjectRules[nextProject].modes[0])
        setHasUnsavedChanges(false)
        setSaveStatus('idle')
        message.info('已切换运动项目，未保存内容已清空')
      },
    })
  }

  const handleSportModeChange = nextSportMode => {
    if (nextSportMode === sportMode) return

    if (editDisabled) {
      setSportMode(nextSportMode)
      setSaveStatus('idle')
      setHasUnsavedChanges(false)
      return
    }

    Modal.confirm({
      title: '切换项目模式',
      icon: <ExclamationCircleOutlined />,
      content: `当前项目模式存在未保存内容，切换到${nextSportMode}模式后，当前未保存的画线和参数配置会被清空。确认切换吗？`,
      okText: '确认切换',
      cancelText: '继续编辑',
      onOk: () => {
        setSportMode(nextSportMode)
        setHasUnsavedChanges(false)
        setSaveStatus('idle')
        message.info('已切换项目模式，未保存内容已清空')
      },
    })
  }

  const handleSave = () => {
    if (editDisabled) return
    Modal.confirm({
      title: '确认保存配置',
      icon: <ExclamationCircleOutlined />,
      width: 640,
      content: '保存后，相机会停止当前相机任务；体育锻炼和人脸抓拍配置会切换到当前配置模式，图像显示设置不会切换运动项目。若该相机正在被其他设备或运动复用，可能影响正在进行的运动。确认保存吗？',
      okText: '确认保存',
      cancelText: '取消',
      onOk: () => {
        setSaveStatus('saving')
        appendLog('保存配置', '执行中', '设备正在保存配置')
        window.setTimeout(() => {
          const savedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
          const modeLabel = modeOptions.find(item => item.value === mode)?.label
          const target = mode === 'sport' ? `${selectedCamera?.name} / ${project}` : selectedCamera?.name
          setSaveStatus('success')
          setHasUnsavedChanges(false)
          setCameraConfigTimes(prev => ({ ...prev, [cameraId]: savedAt }))
          setConfigRecords(prev => [
            {
              time: savedAt,
              mode: modeLabel,
              target,
              operator: '超管',
            },
            ...prev,
          ])
          appendLog(mode === 'image' ? '保存相机图像显示设置' : `保存${modeLabel}`, '成功', '生成操作日志和配置记录')
          message.success('保存成功，配置已同步到设备')
        }, 600)
      },
    })
  }

  const handleRemoteControlToggle = () => {
    if (!remoteControlActive) {
      if (!isDeviceOnline) return

      appendLog('WebSocket 连接', '执行中', '正在判断设备是否空闲')

      if (state?.busyReason) {
        appendLog('WebSocket 空闲检测', '失败', '设备正在运动中')
        Modal.info({
          title: '无法开启远程配置',
          icon: <ExclamationCircleOutlined />,
          content: '设备正在运动中，无法开启远程配置',
          okText: '好的',
        })
        return
      }

      if (state?.maintenanceOwner) {
        appendLog('WebSocket 空闲检测', '失败', `设备正在被 ${state.maintenanceOwner} 远程维护`)
        Modal.info({
          title: '无法开启远程配置',
          icon: <ExclamationCircleOutlined />,
          content: `设备正在被 ${state.maintenanceOwner} 远程维护，无法开启远程配置`,
          okText: '好的',
        })
        return
      }

      Modal.confirm({
        title: '开启远程配置',
        icon: <ExclamationCircleOutlined />,
        content: '开启后，一体机将开启“运维模式”，用户无法使用',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const nextExpiresAt = Date.now() + idleTimeoutMinutes * 60 * 1000
          setRemoteControlActive(true)
          setRemoteControlExpiresAt(nextExpiresAt)
          setAutoExitSeconds(idleTimeoutMinutes * 60)
          writeRemoteControlSession(device?.id, nextExpiresAt)
          appendLog('开启运维模式', '成功', 'WebSocket 已连接，设备进入运维模式')
          message.success('已开启远程配置模式')
        },
      })
      return
    }

    Modal.confirm({
      title: '结束远程配置',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认退出远程配置模式？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setRemoteControlActive(false)
        setRemoteControlExpiresAt(null)
        setAutoExitSeconds(idleTimeoutMinutes * 60)
        setHasUnsavedChanges(false)
        setSaveStatus('idle')
        clearRemoteControlSession(device?.id)
        appendLog('退出运维模式', '成功', 'WebSocket 已断开')
        message.success('已退出远程配置模式')
      },
    })
  }

  if (!device) {
    return (
      <div className="page-card">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/operations/device')}>返回设备列表</Button>
        <Empty description="未找到设备" />
      </div>
    )
  }

  return (
    <div
      className="remote-config-page"
      onChangeCapture={resetAutoExitCountdown}
      onClickCapture={resetAutoExitCountdown}
      onKeyDownCapture={resetAutoExitCountdown}
    >
      <div className="remote-page-head">
        <Space>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/operations/device')} />
          <div>
            <h2>相机远程配置</h2>
          </div>
        </Space>
        <Space>
          <Button className="idle-timeout-btn" icon={<ClockCircleOutlined />} onClick={() => setIdleTimeoutOpen(true)}>
            {remoteControlActive ? `${autoExitCountdown} 后自动退出运维模式` : `空闲超时 ${idleTimeoutMinutes} 分钟`}
            <Tooltip title="超过该时间一直未操作则结束一体机远程控制">
              <QuestionCircleOutlined className="idle-timeout-help" onClick={event => event.stopPropagation()} />
            </Tooltip>
          </Button>
          <Button onClick={() => setRecordsOpen(true)}>
            配置记录
          </Button>
          <Button
            disabled={!isDeviceOnline}
            type={remoteControlActive ? 'default' : 'primary'}
            icon={<CloudSyncOutlined />}
            danger={remoteControlActive}
            onClick={handleRemoteControlToggle}
          >
            {remoteControlActive ? '结束远程配置' : '开启远程控制'}
          </Button>
          <Button disabled={editDisabled} type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            保存配置
          </Button>
        </Space>
      </div>

      {!isDeviceOnline ? (
        <Alert className="remote-alert" type="error" showIcon message="设备离线，无法远程配置" description="仍可查看三种模式下的配置参数，设备离线时不能开启远程控制。" />
      ) : null}

      <StatusSummary
        device={device}
        isDeviceOnline={isDeviceOnline}
      />

      <div className="remote-top-config">
        <CameraSwitcher
          cameras={camerasWithConfigTimes}
          cameraId={cameraId}
          disabled={false}
          onChange={handleCameraChange}
        />
        <div className="top-mode-tabs">
          {modeOptions.map(option => (
            <button
              key={option.value}
              className={`top-mode-tab${mode === option.value ? ' is-active' : ''}`}
              type="button"
              onClick={() => handleModeChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        {remoteControlActive && (
          <div className="top-save-state">
            保存状态：<Tag color={saveColor[saveStatus]}>{saveText[saveStatus]}</Tag>
            {hasUnsavedChanges && <Tag color="warning">有未保存改动</Tag>}
            <span>最近成功现场图：{snapshotTime || '--'}</span>
          </div>
        )}
      </div>

      <div className="remote-workspace">
        {mode === 'sport' && (
          <SportConfig
            disabled={editDisabled}
            projectSelectDisabled={false}
            project={project}
            onProjectChange={handleProjectChange}
            sportMode={sportMode}
            onSportModeChange={handleSportModeChange}
            snapshotTime={snapshotTime}
            onSnapshot={handleSnapshot}
            onSave={handleSave}
            onDirty={markDirty}
          />
        )}
        {mode === 'face' && (
          <FaceConfig disabled={editDisabled} snapshotTime={snapshotTime} onSnapshot={handleSnapshot} onSave={handleSave} onDirty={markDirty} />
        )}
        {mode === 'image' && (
          <ImageConfig disabled={editDisabled} onSave={handleSave} onDirty={markDirty} />
        )}
      </div>

      <Drawer
        title="配置记录"
        size="large"
        open={recordsOpen}
        onClose={() => setRecordsOpen(false)}
      >
        <Table
          size="small"
          rowKey={record => `${record.time}-${record.mode}-${record.target}`}
          pagination={false}
          dataSource={configRecords}
          columns={[
            { title: '时间', dataIndex: 'time', width: 156 },
            { title: '配置模式', dataIndex: 'mode', width: 120 },
            { title: '配置对象', dataIndex: 'target' },
            { title: '操作人', dataIndex: 'operator', width: 90 },
          ]}
        />
      </Drawer>

      <Modal
        title="空闲超时设置"
        open={idleTimeoutOpen}
        okText="保存"
        cancelText="取消"
        onCancel={() => setIdleTimeoutOpen(false)}
        onOk={() => {
          setIdleTimeoutOpen(false)
          if (remoteControlActive) {
            const nextExpiresAt = Date.now() + idleTimeoutMinutes * 60 * 1000
            setRemoteControlExpiresAt(nextExpiresAt)
            setAutoExitSeconds(idleTimeoutMinutes * 60)
            writeRemoteControlSession(device?.id, nextExpiresAt)
          }
          message.success('空闲超时时间已更新')
        }}
      >
        <div className="idle-timeout-form">
          <span>空闲超时</span>
          <InputNumber
            min={1}
            max={120}
            value={idleTimeoutMinutes}
            suffix="分钟"
            onChange={value => setIdleTimeoutMinutes(value || 15)}
          />
        </div>
        <p className="idle-timeout-tip">超过该时间一直未操作则结束一体机远程控制。</p>
      </Modal>
    </div>
  )
}
