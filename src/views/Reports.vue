<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-op-black mb-8">Rapports et Analyses</h1>
    
    <div class="card mb-8">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-gray-700 mb-2">Type de rapport</label>
          <select v-model="reportType" class="input">
            <option value="daily">Rapport journalier</option>
            <option value="monthly">Rapport mensuel</option>
            <option value="yearly">Rapport annuel</option>
            <option value="products">Analyse des produits</option>
            <option value="customers">Analyse des clients</option>
          </select>
        </div>
        
        <div v-if="reportType === 'daily'">
          <label class="block text-gray-700 mb-2">Date</label>
          <input type="date" v-model="selectedDate" class="input" />
        </div>
        
        <div v-if="reportType === 'monthly'">
          <label class="block text-gray-700 mb-2">Mois</label>
          <input type="month" v-model="selectedMonth" class="input" />
        </div>
        
        <div v-if="reportType === 'yearly'">
          <label class="block text-gray-700 mb-2">Année</label>
          <select v-model="selectedYear" class="input">
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button @click="generateReport" class="btn btn-primary">Générer le rapport</button>
        </div>
      </div>
    </div>
    
    <div v-if="reportGenerated" class="card mb-8">
      <h2 class="text-xl font-bold mb-4 text-op-black">{{ reportTitle }}</h2>
      
      <div v-if="reportType === 'daily' || reportType === 'monthly' || reportType === 'yearly'" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-medium mb-2 text-op-black">Total des ventes</h3>
            <p class="text-2xl font-bold text-op-blue">{{ formatCurrency(reportData.totalSales) }}</p>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-medium mb-2 text-op-black">Nombre de commandes</h3>
            <p class="text-2xl font-bold text-op-gold">{{ reportData.orderCount }}</p>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-medium mb-2 text-op-black">Valeur moyenne</h3>
            <p class="text-2xl font-bold text-op-red">{{ formatCurrency(reportData.averageValue) }}</p>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4 text-op-black">Répartition des ventes</h3>
          <div class="h-8 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-op-blue" 
              :style="{ width: `${reportData.completionRate}%` }"
            ></div>
          </div>
          <div class="flex justify-between mt-2 text-sm text-gray-600">
            <span>{{ reportData.completionRate }}% de commandes terminées</span>
            <span>{{ 100 - reportData.completionRate }}% de commandes annulées</span>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-medium mb-4 text-op-black">Détail des commandes</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in reportData.orders" :key="order.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ order.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.customer }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(getRelevantDate(order)) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(order.total) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span 
                      :class="{
                        'px-2 py-1 rounded-full text-xs font-medium': true,
                        'bg-green-100 text-green-800': order.status === 'completed',
                        'bg-red-100 text-red-800': order.status === 'cancelled',
                        'bg-yellow-100 text-yellow-800': order.status === 'pending'
                      }"
                    >
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div v-if="reportType === 'products'" class="mb-6">
        <h3 class="text-lg font-medium mb-4 text-op-black">Produits les plus vendus</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité vendue</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pourcentage</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(product, index) in reportData.productAnalysis" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.count }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div class="bg-op-blue h-2.5 rounded-full" :style="{ width: `${product.percentage}%` }"></div>
                    </div>
                    <span>{{ product.percentage }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-if="reportType === 'customers'" class="mb-6">
        <h3 class="text-lg font-medium mb-4 text-op-black">Analyse des clients</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de commandes</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total dépensé</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur moyenne</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(customer, index) in reportData.customerAnalysis" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ customer.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.orderCount }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(customer.totalSpent) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(customer.averageSpent) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="flex justify-end mt-4">
        <button @click="exportReport" class="btn bg-gray-700 text-white hover:bg-gray-800">
          Exporter en PDF
        </button>
      </div>
    </div>
    
    <div v-if="!reportGenerated" class="card flex items-center justify-center p-12">
      <div class="text-center text-gray">
        <h3 class="text-lg font-medium mb-2">Aucun rapport généré</h3>
        <p>Sélectionnez un type de rapport et cliquez sur "Générer le rapport" pour voir les résultats.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ReportsView',
  data() {
    return {
      reportType: 'daily',
      selectedDate: this.formatDateForInput(new Date()),
      selectedMonth: this.formatMonthForInput(new Date()),
      selectedYear: new Date().getFullYear(),
      reportGenerated: false,
      reportData: {
        totalSales: 0,
        orderCount: 0,
        averageValue: 0,
        completionRate: 0,
        orders: [],
        productAnalysis: [],
        customerAnalysis: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'pendingOrders',
      'completedOrders',
      'cancelledOrders'
    ]),
    availableYears() {
      const currentYear = new Date().getFullYear()
      return [currentYear - 2, currentYear - 1, currentYear]
    },
    reportTitle() {
      switch (this.reportType) {
        case 'daily':
          return `Rapport journalier - ${this.formatDate(this.selectedDate)}`
        case 'monthly':
          return `Rapport mensuel - ${this.formatMonth(this.selectedMonth)}`
        case 'yearly':
          return `Rapport annuel - ${this.selectedYear}`
        case 'products':
          return 'Analyse des produits'
        case 'customers':
          return 'Analyse des clients'
        default:
          return 'Rapport'
      }
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value) + ' FCFA'
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    formatDateForInput(date) {
      if (!date) return ''
      return new Date(date).toISOString().split('T')[0]
    },
    formatMonth(monthStr) {
      if (!monthStr) return ''
      const [year, month] = monthStr.split('-')
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      return `${months[parseInt(month) - 1]} ${year}`
    },
    formatMonthForInput(date) {
      if (!date) return ''
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      return `${year}-${month}`
    },
    getRelevantDate(order) {
      if (order.status === 'completed') return order.completedAt
      if (order.status === 'cancelled') return order.cancelledAt
      return order.createdAt
    },
    getStatusLabel(status) {
      switch (status) {
        case 'completed':
          return 'Terminée'
        case 'cancelled':
          return 'Annulée'
        case 'pending':
          return 'En cours'
        default:
          return status
      }
    },
    generateReport() {
      const allOrders = [...this.pendingOrders, ...this.completedOrders, ...this.cancelledOrders]
      
      let filteredOrders = []
      
      if (this.reportType === 'daily') {
        const selectedDate = new Date(this.selectedDate)
        selectedDate.setHours(0, 0, 0, 0)
        
        const nextDay = new Date(selectedDate)
        nextDay.setDate(selectedDate.getDate() + 1)
        
        filteredOrders = allOrders.filter(order => {
          const orderDate = new Date(this.getRelevantDate(order))
          return orderDate >= selectedDate && orderDate < nextDay
        })
      } else if (this.reportType === 'monthly') {
        const [year, month] = this.selectedMonth.split('-')
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
        const endDate = new Date(parseInt(year), parseInt(month), 0)
        
        filteredOrders = allOrders.filter(order => {
          const orderDate = new Date(this.getRelevantDate(order))
          return orderDate >= startDate && orderDate <= endDate
        })
      } else if (this.reportType === 'yearly') {
        const startDate = new Date(this.selectedYear, 0, 1)
        const endDate = new Date(this.selectedYear, 11, 31)
        
        filteredOrders = allOrders.filter(order => {
          const orderDate = new Date(this.getRelevantDate(order))
          return orderDate >= startDate && orderDate <= endDate
        })
      } else {
        filteredOrders = allOrders
      }
      
      const completedOrders = filteredOrders.filter(order => order.status === 'completed')
      const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0)
      const orderCount = completedOrders.length
      const averageValue = orderCount > 0 ? totalSales / orderCount : 0
      const completionRate = filteredOrders.length > 0 
        ? Math.round((completedOrders.length / filteredOrders.length) * 100) 
        : 0
      
      this.reportData = {
        totalSales,
        orderCount,
        averageValue,
        completionRate,
        orders: filteredOrders
      }
      
      if (this.reportType === 'products') {
        this.analyzeProducts(completedOrders)
      } else if (this.reportType === 'customers') {
        this.analyzeCustomers(completedOrders)
      }
      
      this.reportGenerated = true
    },
    analyzeProducts(orders) {
      const productCounts = {}
      let totalItems = 0
      
      orders.forEach(order => {
        order.items.forEach(item => {
          if (!productCounts[item]) {
            productCounts[item] = 0
          }
          productCounts[item]++
          totalItems++
        })
      })
      
      const productAnalysis = Object.entries(productCounts).map(([name, count]) => ({
        name,
        count,
        percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0
      }))
      
      productAnalysis.sort((a, b) => b.count - a.count)
      
      this.reportData.productAnalysis = productAnalysis
    },
    analyzeCustomers(orders) {
      const customerOrders = {}
      
      orders.forEach(order => {
        if (!customerOrders[order.customer]) {
          customerOrders[order.customer] = []
        }
        customerOrders[order.customer].push(order)
      })
      
      const customerAnalysis = Object.entries(customerOrders).map(([name, orders]) => {
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
        return {
          name,
          orderCount: orders.length,
          totalSpent,
          averageSpent: totalSpent / orders.length
        }
      })
      
      customerAnalysis.sort((a, b) => b.totalSpent - a.totalSpent)
      
      this.reportData.customerAnalysis = customerAnalysis
    },
  },
  created() {
    this.$store.dispatch('fetchOrders')
  }
}
</script>
