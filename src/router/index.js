import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * code: ''
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    hidden: true,
    children: [
      {
        path: 'home',
        name: '首页',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'icon_home' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/userImg',
    component: Layout,
    name: '用户画像',
    redirect: '/userImg/index',
    meta: { title: '用户画像', icon: 'people' },
    code: 'ea08258a-cb20-43d9-982b-0a5ff3c1ff85', // 菜单权限标示码
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/userImg/index'),
        meta: { title: '列表', icon: 'huaxiangguanli' },
        hidden: true,
        code: 'ea08258a-cb20-43d9-982b-0a5ff3c1ff85'
      },
      {
        path: 'createByCondition',
        name: 'createByCondition',
        component: () => import('@/views/userImg/CreateImg'),
        meta: { title: '筛选条件创建用户画像', icon: 'huaxiangguanli' },
        hidden: true,
        code: 'ea08258a-cb20-43d9-982b-0a5ff3c1ff85'
      },
      {
        path: 'CompareByFile',
        name: 'CompareByFile',
        component: () => import('@/views/userImg/CreateImgByFile'),
        meta: { title: '人群包创建画像', icon: 'huaxiangguanli' },
        hidden: true,
        code: 'ea08258a-cb20-43d9-982b-0a5ff3c1ff85'
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('@/views/userImg/detail'),
        meta: { title: '画像详情', icon: 'huaxiangguanli' },
        hidden: true,
        code: 'ea08258a-cb20-43d9-982b-0a5ff3c1ff85'
      },
      {
        path: 'compare',
        name: 'compare',
        component: () => import('@/views/userImg/compare'),
        meta: { title: '画像对比', icon: 'huaxiangguanli' },
        hidden: true,
        code: 'userImg'
      },
      {
        path: 'compareByself',
        name: 'compareByself',
        component: () => import('@/views/userImg/CompareBySelf'),
        meta: { title: '同人对比', icon: 'huaxiangguanli' },
        hidden: true,
        code: 'userImg'
      }
    ]
  },
  {
    path: '/dataDictionary',
    component: Layout,
    code: 'a780d321-cbee-45cb-b5f3-7cd6a4ae872c', // 菜单权限标示码
    redirect: '/dataDictionary/index',
    meta: { title: '数据字典', icon: 'dataDictionary' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dataDictionary/index'),
        meta: { title: '列表', icon: 'dataDictionary' },
        code: 'a780d321-cbee-45cb-b5f3-7cd6a4ae872c'
      },
      {
        path: 'type',
        component: () => import('@/views/dataDictionary/userImgType'),
        meta: { title: '画像类型', icon: 'user-type' },
        code: 'a780d321-cbee-45cb-b5f3-7cd6a4ae872c'
      }
    ]
  },
  {
    path: '/label',
    component: Layout,
    code: '1e58e3ed-ed22-488d-a06a-21b63a58bf06', // 菜单权限标示码
    redirect: '/label/index',
    meta: { title: '标签系统', icon: 'label' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/label/index'),
        meta: { title: '标签概览' },
        code: '1e58e3ed-ed22-488d-a06a-21b63a58bf06'
      },
      {
        path: 'aegis',
        component: () => import('@/views/label/aegis'),
        meta: { title: '标签维护' },
        code: '1e58e3ed-ed22-488d-a06a-21b63a58bf06'
      }
    ]
  },
  {
    path: '/operate',
    component: Layout,
    code: '1c35d56d-3b17-4a7f-b2a4-484f43cb48e8', // 菜单权限标示码
    redirect: '/operate/index',
    meta: { title: '运营看板', icon: 'operate' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/operate/index'),
        meta: { title: '运营看板' },
        code: '1c35d56d-3b17-4a7f-b2a4-484f43cb48e8'
      },
      {
        path: 'detail/:type',
        hidden: true,
        component: () => import('@/views/operate/detail'),
        meta: { title: '会员转化趋势' },
        code: '1c35d56d-3b17-4a7f-b2a4-484f43cb48e8'
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/log/index',
    code: 'b8ebb038-c85f-43df-a036-eed2f7279879',
    hidden: false,
    children: [
      {
        path: 'index',
        name: '日志',
        component: () => import('@/views/journal/index'),
        meta: { title: '日志管理', icon: 'rizhi' },
        code: 'b8ebb038-c85f-43df-a036-eed2f7279879'
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
