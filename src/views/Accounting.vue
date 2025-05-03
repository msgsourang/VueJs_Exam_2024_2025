<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-op-black mb-8">Comptabilité</h1>
    
    <div class="card mb-8">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-gray-700 mb-2">Période</label>
          <select v-model="selectedPeriod" class="input">
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
            <option value="custom">Personnalisée</option>
          </select>
        </div>
        
        <div v-if="selectedPeriod === 'custom'" class="flex gap-4">
          <div>
            <label class="block text-gray-700 mb-2">Date de début</label>
            <input type="date" v-model="startDate" class="input" />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Date de fin</label>
            <input type="date" v-model="endDate" class="input" />
          </div>
        </div>
        
        <div class="flex items-end">
          <button @click="applyFilter" class="btn btn-primary">Appliquer</button>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card bg-white">
        <h3 class="text-lg font-medium mb-2 text-op-black">Revenus</h3>
        <p class="text-3xl font-bold text-op-blue">{{ formatCurrency(totalRevenue) }}</p>
        <p class="text-sm text-gray-500 mt-2">{{ periodLabel }}</p>
      </div>
      
      <div class="card bg-white">
        <h3 class="text-lg font-medium mb-2 text-op-black">Nombre de commandes</h3>
        <p class="text-3xl font-bold text-op-gold">{{ completedOrdersCount }}</p>
        <p class="text-sm text-gray-500 mt-2">{{ periodLabel }}</p>
      </div>
      
      <div class="card bg-white">
        <h3 class="text-lg font-medium mb-2 text-op-black">Valeur moyenne</h3>
        <p class="text-3xl font-bold text-op-red">{{ formatCurrency(averageOrderValue) }}</p>
        <p class="text-sm text-gray-500 mt-2">{{ periodLabel }}</p>
      </div>
    </div>
    
    <!-- Graphique des revenus -->
    <div class="card mb-8">
      <h2 class="text-xl font-bold mb-4 text-op-black">Évolution des revenus</h2>
      <div class="h-64 flex items-center justify-center">
        <div v-if="revenueData.length === 0" class="text-gray-500 italic">
          Aucune donnée disponible pour la période sélectionnée
        </div>
        <div v-else class="w-full h-full">
          <div class="flex h-full items-end justify-between">
            <div v-for="(item, index) in revenueData" :key="index" class="flex flex-col items-center w-full">
              <div 
                class="bg-op-blue w-10 rounded-t-md transition-all duration-500" 
                :style="{ height: `${(item.value / maxRevenue) * 100}%` }"
              ></div>
              <span class="text-xs mt-2">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h2 class="text-xl font-bold mb-4 text-op-black">Détail des transactions</h2>
      
      <div v-if="filteredOrders.length === 0" class="text-gray-500 italic py-4">
        Aucune transaction pour la période sélectionnée
      </div>
      
      <div v-else class="overflow-x-auto">
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
            <tr v-for="order in filteredOrders" :key="order.id">
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
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AccountingView',
  data() {
    return {
      selectedPeriod: 'day',
      startDate: this.formatDateForInput(new Date()),
      endDate: this.formatDateForInput(new Date()),
      filteredOrders: [],
      revenueData: []
    }
  },
  computed: {
    ...mapGetters([
      'pendingOrders',
      'completedOrders',
      'cancelledOrders'
    ]),
    periodLabel() {
      switch (this.selectedPeriod) {
        case 'day':
          return "Aujourd'hui"
        case 'week':
          return 'Cette semaine'
        case 'month':
          return 'Ce mois'
        case 'year':
          return 'Cette année'
        case 'custom':
          return `Du ${this.formatDate(this.startDate)} au ${this.formatDate(this.endDate)}`
        default:
          return ''
      }
    },
    totalRevenue() {
      return this.filteredOrders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0)
    },
    completedOrdersCount() {
      return this.filteredOrders.filter(order => order.status === 'completed').length
    },
    averageOrderValue() {
      const completedOrders = this.filteredOrders.filter(order => order.status === 'completed')
      if (completedOrders.length === 0) return 0
      
      return this.totalRevenue / completedOrders.length
    },
    maxRevenue() {
      if (this.revenueData.length === 0) return 0
      return Math.max(...this.revenueData.map(item => item.value))
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
    applyFilter() {
      let start, end
      const now = new Date()
      
      switch (this.selectedPeriod) {
        case 'day':
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
          break
        case 'week':
          {
            const dayOfWeek = now.getDay()
            const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
            start = new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0)
            end = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59)
          }
          break
        case 'month':
          start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
          break
        case 'year':
          start = new Date(now.getFullYear(), 0, 1, 0, 0, 0)
          end = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
          break
        case 'custom':
          start = new Date(this.startDate)
          end = new Date(this.endDate)
          end.setHours(23, 59, 59)
          break
        default:
          start = new Date(0)
          end = new Date()
      }
      
      const allOrders = [...this.pendingOrders, ...this.completedOrders, ...this.cancelledOrders]
      this.filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(this.getRelevantDate(order))
        return orderDate >= start && orderDate <= end
      })
      
      this.generateRevenueData(start, end)
    },
    generateRevenueData(start, end) {
      this.revenueData = []
      
      if (this.selectedPeriod === 'day') {
        for (let hour = 0; hour < 24; hour += 3) {
          const hourStart = new Date(start)
          hourStart.setHours(hour, 0, 0)
          
          const hourEnd = new Date(start)
          hourEnd.setHours(hour + 2, 59, 59)
          
          const hourRevenue = this.calculateRevenueForPeriod(hourStart, hourEnd)
          
          this.revenueData.push({
            label: `${hour}h`,
            value: hourRevenue
          })
        }
      } else if (this.selectedPeriod === 'week') {
        const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(start)
          dayStart.setDate(start.getDate() + i)
          dayStart.setHours(0, 0, 0)
          
          const dayEnd = new Date(dayStart)
          dayEnd.setHours(23, 59, 59)
          
          const dayRevenue = this.calculateRevenueForPeriod(dayStart, dayEnd)
          
          this.revenueData.push({
            label: days[i],
            value: dayRevenue
          })
        }
      } else if (this.selectedPeriod === 'month') {
        const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
        for (let i = 1; i <= daysInMonth; i += 7) {
          const weekStart = new Date(start.getFullYear(), start.getMonth(), i, 0, 0, 0)
          
          const weekEnd = new Date(start.getFullYear(), start.getMonth(), Math.min(i + 6, daysInMonth), 23, 59, 59)
          
          const weekRevenue = this.calculateRevenueForPeriod(weekStart, weekEnd)
          
          this.revenueData.push({
            label: `S${Math.ceil(i / 7)}`,
            value: weekRevenue
          })
        }
      } else if (this.selectedPeriod === 'year') {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(start.getFullYear(), month, 1, 0, 0, 0)
          
          const monthEnd = new Date(start.getFullYear(), month + 1, 0, 23, 59, 59)
          
          const monthRevenue = this.calculateRevenueForPeriod(monthStart, monthEnd)
          
          this.revenueData.push({
            label: months[month],
            value: monthRevenue
          })
        }
      } else if (this.selectedPeriod === 'custom') {
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays <= 7) {
          for (let i = 0; i < diffDays; i++) {
            const dayStart = new Date(start)
            dayStart.setDate(start.getDate() + i)
            dayStart.setHours(0, 0, 0)
            
            const dayEnd = new Date(dayStart)
            dayEnd.setHours(23, 59, 59)
            
            const dayRevenue = this.calculateRevenueForPeriod(dayStart, dayEnd)
            
            this.revenueData.push({
              label: dayStart.getDate().toString(),
              value: dayRevenue
            })
          }
        } else if (diffDays <= 31) {
          for (let i = 0; i < diffDays; i += 7) {
            const weekStart = new Date(start)
            weekStart.setDate(start.getDate() + i)
            
            const weekEnd = new Date(start)
            weekEnd.setDate(start.getDate() + Math.min(i + 6, diffDays - 1))
            weekEnd.setHours(23, 59, 59)
            
            const weekRevenue = this.calculateRevenueForPeriod(weekStart, weekEnd)
            
            this.revenueData.push({
              label: `S${Math.ceil((i + 1) / 7)}`,
              value: weekRevenue
            })
          }
        } else {
          let currentMonth = start.getMonth()
          let currentYear = start.getFullYear()
          
          while (currentYear < end.getFullYear() || (currentYear === end.getFullYear() && currentMonth <= end.getMonth())) {
            const monthStart = new Date(currentYear, currentMonth, 1, 0, 0, 0)
            
            const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)
            
            const monthRevenue = this.calculateRevenueForPeriod(monthStart, monthEnd)
            
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
            this.revenueData.push({
              label: months[currentMonth],
              value: monthRevenue
            })
            
            currentMonth++
            if (currentMonth > 11) {
              currentMonth = 0
              currentYear++
            }
          }
        }
      }
    },
    calculateRevenueForPeriod(start, end) {
      return this.filteredOrders
        .filter(order => {
          const orderDate = new Date(this.getRelevantDate(order))
          return order.status === 'completed' && orderDate >= start && orderDate <= end
        })
        .reduce((sum, order) => sum + order.total, 0)
    }
  },
  created() {
    this.$store.dispatch('fetchOrders')
    this.applyFilter()
  }
}
</script>
