const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/Home/index.vue') },
    ],
  },
  {
    path: '/profile',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/Profile/index.vue') },
    ],
  },
  // 运动目标模块（独立页面，不包裹 MainLayout，自带导航栏）
  { path: '/sports-goal', component: () => import('@/pages/SportsGoal/index.vue') },
  { path: '/sports-goal/goal/:id', component: () => import('@/pages/SportsGoal/GoalDetail.vue') },
  { path: '/sports-goal/student/:goalId/:studentId', component: () => import('@/pages/SportsGoal/StudentDetail.vue') },
  { path: '/sports-goal/history', component: () => import('@/pages/SportsGoal/HistoryGoal.vue') },
]

export default routes
