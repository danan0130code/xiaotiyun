import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DeviceList from './pages/Operations/Device'
import MasterDevice from './pages/Operations/MasterDevice'
import Firmware from './pages/Operations/Firmware'
import Settings from './pages/Operations/Settings'
import RemoteConfig from './pages/Operations/RemoteConfig'
import Users from './pages/Users'
import Menus from './pages/Menus'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/operations/device" replace />} />
        <Route path="operations/device/:deviceId" element={<DeviceList />} />
        <Route path="operations/device" element={<DeviceList />} />
        <Route path="operations/remote-config" element={<RemoteConfig />} />
        <Route path="operations/remote-config/:deviceId" element={<RemoteConfig />} />
        <Route path="operations/master-device" element={<MasterDevice />} />
        <Route path="operations/firmware" element={<Firmware />} />
        <Route path="operations/settings" element={<Settings />} />
        <Route path="users" element={<Users />} />
        <Route path="menus" element={<Menus />} />
      </Route>
    </Routes>
  )
}
