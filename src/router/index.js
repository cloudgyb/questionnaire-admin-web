import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/Main'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home')
      },
      {
        path: '/user/list',
        name: 'UserList',
        component: () => import('@/views/usermanager/UserList')
      },
      {
        path: '/template',
        name: 'TemplateManager',
        component: () => import('@/views/template/QuestionnaireTemplateList')
      },
      {
        path: '/template/type',
        name: 'TemplateType',
        component: () => import('@/views/template/QuestionnaireTypeManager')
      },
      {
        path: '/sys/user',
        name: 'SysUserManager',
        component: () => import('@/views/sys/SysUserManager')
      },
      {
        path: '/sys/role',
        name: 'SysRoleManager',
        component: () => import('@/views/sys/SysRoleManager')
      },
      {
        path: '/sys/log',
        name: 'SysLogManager',
        component: () => import('@/views/sys/SysLogManager')
      },
      {
        path: '/sys/config',
        name: 'SysConfigManager',
        component: () => import('@/views/sys/SysConfigManager')
      },
      {
        path: '/sys/menu',
        name: 'SysMenuManager',
        component: () => import('@/views/sys/SysMenuManager')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/template/preview',
    name: 'TemplatePreview',
    component: () => import('@/views/template/QuestionnaireTemplatePreview')
  },
  {
    path: '/template/design',
    name: 'TemplateDesign',
    component: () => import('@/views/template/QuestionnaireTemplateDesign')
  }
]

const router = new VueRouter({
  routes
})

export default router
