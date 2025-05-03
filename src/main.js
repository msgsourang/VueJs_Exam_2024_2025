import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import './assets/css/styles.css'

import DashboardView from './views/Dashboard.vue'
import OrdersView from './views/Orders.vue'
import AccountingView from './views/Accounting.vue'
import ReportsView from './views/Reports.vue'
import HistoryView from './views/History.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: DashboardView, name: 'dashboard' },
    { path: '/orders', component: OrdersView, name: 'orders' },
    { path: '/accounting', component: AccountingView, name: 'accounting' },
    { path: '/reports', component: ReportsView, name: 'reports' },
    { path: '/history', component: HistoryView, name: 'history' },
  ]
})

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
