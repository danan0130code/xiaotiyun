import {
  Button,
  Checkbox,
  DatePicker,
  Empty,
  Form,
  Input,
  message,
  Pagination,
  Progress,
  Select,
  Space,
  Tag,
  Timeline,
} from 'antd'
import {
  ArrowLeftOutlined,
  CameraOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileSearchOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deviceTypes, devicesByType, maintenanceLogs, schoolOptions, statusOptions } from '../../../mock/devices'

const statusColor = {
  在线: 'success',
  离线: 'default',
  外接设备连接异常: 'error',
}

function DeviceField({ label, value }) {
  return (
    <div className="device-field">
      <span className="device-field-label">{label}：</span>
      <span className="device-field-value" title={value}>{value}</span>
    </div>
  )
}

function DeviceCard({ device, checked, onCheck, onDetail }) {
  const navigate = useNavigate()

  return (
    <div className="device-card">
      <div className="device-card-head">
        <div className="device-card-title-wrap">
          <div className="device-title-line">
            <h3 className="device-title">{device.name}</h3>
            <span className="edit-mark">✎</span>
            <Tag className="status-tag" color={statusColor[device.status]}>{device.status}</Tag>
          </div>
          <div className="memory-text">内存已使用: {device.memoryUsage}</div>
        </div>
        <Checkbox checked={checked} onChange={event => onCheck(device.id, event.target.checked)} />
      </div>
      <div className="device-card-body">
        <DeviceField label="摄像头" value={device.cameraStatus} />
        <DeviceField label="开启的项目" value={device.enabledProjects.join('，')} />
      </div>
      <div className="device-card-body device-card-body-info">
        <DeviceField label="设备型号" value={device.model} />
        <DeviceField label="序列号" value={device.serialNo} />
        <DeviceField label="设备ID" value={device.deviceId} />
        <DeviceField label="激活日期" value={device.activatedAt} />
        <DeviceField label="最后心跳" value={device.lastHeartbeat} />
      </div>
      <div className="device-card-actions">
        <Button size="small" type="link" onClick={() => onDetail(device)}>
          查看详情
        </Button>
        <Button size="small" type="link" onClick={() => navigate(`/operations/remote-config/${device.id}`)}>
          远程配置
        </Button>
        <Button size="small" type="link">获取日志</Button>
        <Button size="small" type="link">日志下载</Button>
        <Button size="small" type="link">设备删除</Button>
        <Button className="business-log-btn" size="small" type="link">获取业务日志</Button>
      </div>
    </div>
  )
}

function DeviceDetailPage({ device }) {
  const navigate = useNavigate()
  const hours = Array.from({ length: 24 }, (_, index) => index)

  if (!device) {
    return (
      <div className="page-card">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/operations/device')}>返回设备列表</Button>
        <Empty description="未找到设备" />
      </div>
    )
  }

  return (
    <div className="device-detail-page">
      <div className="detail-page-head">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/operations/device')} />
        <h2>设备详情</h2>
      </div>

      <div className="detail-panel">
        <div className="detail-device-summary">
          <div className="detail-device-title">
            <h3>{device.name}</h3>
            <span className="edit-mark">✎</span>
            <Tag className="status-tag" color={statusColor[device.status]}>{device.status}</Tag>
            <span className="memory-text">内存已使用: {device.memoryUsage}</span>
          </div>
          <div className="detail-subline">开启的项目：{device.enabledProjects.join('，')}</div>
        </div>

        <div className="detail-block">
          <h4>设备状态</h4>
          <div className="status-date-row">
            <span className="status-date-label">查询日期：</span>
            <DatePicker value={null} placeholder="2026-05-27" style={{ width: 270 }} />
          </div>
          <div className="hour-timeline">
            <div className="hour-active-bar" />
            <div className="hour-scale">
              {hours.map(hour => (
                <span key={hour}>{hour}<em>时</em></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-panel">
        <div className="device-operation-head">
          <h4>一体机设备</h4>
          <div>
            <Button type="text">批量重启</Button>
            <Button type="text">批量人脸建模</Button>
          </div>
        </div>
        <div className="detail-table">
          <div className="detail-table-title">一体机</div>
          <div className="detail-table-row">
            <span>当前版本：</span>
            <strong>V3.6.6</strong>
          </div>
          <div className="detail-table-row">
            <span>更新日期：</span>
            <strong>--</strong>
          </div>
          <div className="detail-table-row">
            <span>最近配置的更新：</span>
            <strong>V4.19.3</strong>
          </div>
        </div>
        <Space className="detail-action-row">
          <Button type="primary" icon={<CameraOutlined />} onClick={() => navigate(`/operations/remote-config/${device.id}`)}>
            相机远程配置
          </Button>
          <Button icon={<ReloadOutlined />}>更新</Button>
          <Button>重启</Button>
          <Button>删除更新包</Button>
          <Button icon={<CloudDownloadOutlined />}>获取日志</Button>
          <Button icon={<DownloadOutlined />}>日志下载</Button>
          <Button danger icon={<DeleteOutlined />}>设备删除</Button>
        </Space>
      </div>

      <div className="detail-panel">
        <div className="detail-info-grid">
          <div><span>关联学校：</span>{device.schoolName}</div>
          <div><span>设备类型：</span>{device.type}</div>
          <div><span>设备型号：</span>{device.model}</div>
          <div><span>序列号：</span>{device.serialNo}</div>
          <div><span>设备ID：</span>{device.deviceId}</div>
          <div><span>激活日期：</span>{device.activatedAt}</div>
          <div><span>最后心跳：</span>{device.lastHeartbeat}</div>
          <div><span>摄像头：</span>{device.cameraStatus}</div>
        </div>
      </div>

      <div className="detail-panel">
        <h3 className="page-title">维护操作记录</h3>
        <Timeline
          items={maintenanceLogs.map(item => ({
            children: `${item.time} ${item.operator} ${item.action}：${item.result}`,
          }))}
        />
      </div>
    </div>
  )
}

export default function DeviceList() {
  const navigate = useNavigate()
  const { deviceId } = useParams()
  const [activeType, setActiveType] = useState('一体机(2代)')
  const [filters, setFilters] = useState({
    schoolName: '红山农场学校',
    deviceUid: '',
    status: '全部',
  })
  const [selectedIds, setSelectedIds] = useState([])

  const currentDevices = useMemo(() => devicesByType[activeType] || [], [activeType])
  const allDevices = useMemo(() => Object.values(devicesByType).flat(), [])
  const routeDevice = useMemo(
    () => allDevices.find(device => device.id === deviceId || device.deviceId === deviceId),
    [allDevices, deviceId],
  )

  const filteredDevices = useMemo(() => {
    return currentDevices.filter(device => {
      const matchSchool = !filters.schoolName || device.schoolName === filters.schoolName
      const matchUid = !filters.deviceUid || device.deviceId.toLowerCase().includes(filters.deviceUid.toLowerCase())
      const matchStatus = filters.status === '全部' || device.status === filters.status
      return matchSchool && matchUid && matchStatus
    })
  }, [currentDevices, filters])

  const selectedVisibleCount = selectedIds.filter(id => filteredDevices.some(device => device.id === id)).length
  const allVisibleSelected = filteredDevices.length > 0 && selectedVisibleCount === filteredDevices.length
  const onlineCount = filteredDevices.filter(device => device.status === '在线').length
  const offlineCount = filteredDevices.filter(device => device.status === '离线').length

  const handleFilterValuesChange = (_, values) => {
    setFilters(values)
    setSelectedIds([])
  }

  const handleReset = () => {
    setFilters({ schoolName: '红山农场学校', deviceUid: '', status: '全部' })
    setSelectedIds([])
  }

  const handleSelectAll = checked => {
    if (!checked) {
      setSelectedIds([])
      return
    }
    setSelectedIds(filteredDevices.map(device => device.id))
  }

  const handleSelectOne = (id, checked) => {
    setSelectedIds(prev => {
      if (checked) return Array.from(new Set([...prev, id]))
      return prev.filter(item => item !== id)
    })
  }

  const handleTabChange = key => {
    setActiveType(key)
    setSelectedIds([])
  }

  const tabItems = deviceTypes.map(type => ({
    key: type,
    label: type,
    children: null,
  }))

  if (deviceId) {
    return <DeviceDetailPage device={routeDevice} />
  }

  return (
    <div className="device-page">
        <div className="page-card" style={{ minHeight: 'auto', paddingBottom: 12 }}>
          <div className="page-title">设备列表</div>
          <div className="device-tabs">
            <Space wrap size={8}>
              {tabItems.map(item => (
                <Button
                  key={item.key}
                  type={item.key === activeType ? 'primary' : 'default'}
                  onClick={() => handleTabChange(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </Space>
          </div>
        </div>

        <Form
          className="device-filter"
          layout="inline"
          initialValues={filters}
          fields={[
            { name: ['schoolName'], value: filters.schoolName },
            { name: ['deviceUid'], value: filters.deviceUid },
            { name: ['status'], value: filters.status },
          ]}
          onValuesChange={handleFilterValuesChange}
        >
          <Form.Item label="学校名称" name="schoolName">
            <Select
              showSearch
              style={{ width: 220 }}
              options={schoolOptions.map(name => ({ label: name, value: name }))}
            />
          </Form.Item>
          <Form.Item label="设备UID" name="deviceUid">
            <Input style={{ width: 240 }} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="在线状态" name="status">
            <Select style={{ width: 180 }} options={statusOptions.map(status => ({ label: status, value: status }))} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" icon={<SearchOutlined />}>提交</Button>
            </Space>
          </Form.Item>
        </Form>

        <div className="device-toolbar">
          <div className="device-toolbar-left">
            <Button type="primary" onClick={() => message.info('已创建批量更新固件包任务')}>
              批量更新固件包
            </Button>
            <Checkbox checked={allVisibleSelected} onChange={event => handleSelectAll(event.target.checked)}>
              选择全部设备
            </Checkbox>
            <span className="device-count">已选择{selectedVisibleCount}台设备</span>
          </div>
          <div className="device-toolbar-right">
            <span className="device-count">
              总设备：{filteredDevices.length}台 在线：{onlineCount}台 离线：{offlineCount}台
            </span>
          </div>
        </div>

        <div className="device-list">
          {filteredDevices.length === 0 ? (
            <div className="page-card">
              <Empty description={`${activeType} 暂无设备`} />
            </div>
          ) : (
            filteredDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                checked={selectedIds.includes(device.id)}
                onCheck={handleSelectOne}
                onDetail={item => navigate(`/operations/device/${item.id}`)}
              />
            ))
          )}
        </div>

        <div className="device-toolbar">
          <span className="device-count">共 {filteredDevices.length} 条</span>
          <Pagination
            current={1}
            total={filteredDevices.length}
            pageSize={10}
            showSizeChanger
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </div>

    </div>
  )
}
