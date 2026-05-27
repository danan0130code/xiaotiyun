import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

// 基础管理
import BasicSchool from './pages/Basic/School'
import BasicStudent from './pages/Basic/Student'
import BasicTeacher from './pages/Basic/Teacher'
import BasicClass from './pages/Basic/Class'
import BasicSemester from './pages/Basic/Semester'
import BasicScoring from './pages/Basic/Scoring'
import BasicDevice from './pages/Basic/Device'
import BasicOps from './pages/Basic/Ops'
import BasicPermission from './pages/Basic/Permission'

// 教学管理
import TeachingClassTraining from './pages/Teaching/ClassTraining'
import TeachingCrossTraining from './pages/Teaching/CrossTraining'
import TeachingSmartClassroom from './pages/Teaching/SmartClassroom'
import TeachingResource from './pages/Teaching/Resource'
import TeachingHomework from './pages/Teaching/Homework'
import TeachingRopeSkipping from './pages/Teaching/RopeSkipping'

// 体质测试
import PhysicalDistrict from './pages/Physical/District'
import PhysicalSchool from './pages/Physical/School'
import PhysicalSettings from './pages/Physical/Settings'

// 阳光跑管理
import SunrunTasks from './pages/SunRun/Tasks'
import SunrunScores from './pages/SunRun/Scores'
import SunrunRuleSettings from './pages/SunRun/RuleSettings'

// 运动目标
import GoalManagement from './pages/Goal/Management'
import GoalDetail from './pages/Goal/Management/GoalDetail'
import GoalStatistics from './pages/Goal/Statistics'

// 学生运动数据
import SportsRecords from './pages/Sports/Records'
import SportsScoreReports from './pages/Sports/ScoreReports'
import SportsActivities from './pages/Sports/Activities'
import SportsExercise from './pages/Sports/Exercise'
import SportsCoins from './pages/Sports/Coins'

// 驾驶舱
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* 基础管理 */}
        <Route path="basic/school" element={<BasicSchool />} />
        <Route path="basic/student" element={<BasicStudent />} />
        <Route path="basic/teacher" element={<BasicTeacher />} />
        <Route path="basic/class" element={<BasicClass />} />
        <Route path="basic/semester" element={<BasicSemester />} />
        <Route path="basic/scoring" element={<BasicScoring />} />
        <Route path="basic/device" element={<BasicDevice />} />
        <Route path="basic/ops" element={<BasicOps />} />
        <Route path="basic/permission" element={<BasicPermission />} />

        {/* 教学管理 */}
        <Route path="teaching/class-training" element={<TeachingClassTraining />} />
        <Route path="teaching/cross-training" element={<TeachingCrossTraining />} />
        <Route path="teaching/smart-classroom" element={<TeachingSmartClassroom />} />
        <Route path="teaching/resource" element={<TeachingResource />} />
        <Route path="teaching/homework" element={<TeachingHomework />} />
        <Route path="teaching/rope-skipping" element={<TeachingRopeSkipping />} />

        {/* 体质测试 */}
        <Route path="physical/district" element={<PhysicalDistrict />} />
        <Route path="physical/school" element={<PhysicalSchool />} />
        <Route path="physical/settings" element={<PhysicalSettings />} />

        {/* 阳光跑管理 */}
        <Route path="sunrun/tasks" element={<SunrunTasks />} />
        <Route path="sunrun/scores" element={<SunrunScores />} />
        <Route path="sunrun/rules" element={<SunrunRuleSettings />} />

        {/* 运动目标 */}
        <Route path="goal/management/:goalId" element={<GoalDetail />} />
        <Route path="goal/management" element={<GoalManagement />} />
        <Route path="goal/statistics" element={<GoalStatistics />} />

        {/* 学生运动数据 */}
        <Route path="sports/records" element={<SportsRecords />} />
        <Route path="sports/score-reports" element={<SportsScoreReports />} />
        <Route path="sports/activities" element={<SportsActivities />} />
        <Route path="sports/exercise" element={<SportsExercise />} />
        <Route path="sports/coins" element={<SportsCoins />} />
      </Route>
    </Routes>
  )
}

export default App
