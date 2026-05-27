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
    path: '/sports-record',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/SportsRecord/index.vue') },
    ],
  },
  {
    path: '/sports-goal',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/SportsGoal/index.vue') },
      { path: 'history', component: () => import('@/pages/SportsGoal/HistoryGoals.vue') },
      { path: ':id', component: () => import('@/pages/SportsGoal/Detail.vue') },
    ],
  },
  {
    path: '/profile',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/Profile/index.vue') },
    ],
  },
]

export default routes
