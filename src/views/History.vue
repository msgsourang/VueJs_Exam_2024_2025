<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-op-black mb-8">Historique des Commandes</h1>
    
    <div class="card mb-8">
      <div class="flex flex-wrap gap-4 mb-4">
        <div class="w-full md:w-64">
          <label class="block text-gray-700 mb-2">Statut</label>
          <select v-model="statusFilter" class="input">
            <option value="all">Tous les statuts</option>
            <option value="completed">Terminées</option>
            <option value="cancelled">Annulées</option>
            <option value="pending">En cours</option>
          </select>
        </div>
        
        <div class="w-full md:w-64">
          <label class="block text-gray-700 mb-2">Période</label>
          <select v-model="periodFilter" class="input">
            <option value="all">Toutes les périodes</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="custom">Personnalisée</option>
          </select>
        </div>
        
        <div v-if="periodFilter === 'custom'" class="flex gap-4">
          <div class="w-full md:w-auto">
            <label class="block text-gray-700 mb-2">Date de début</label>
            <input type="date" v-model="startDate" class="input" />
          </div>
          <div class="w-full md:w-auto">
            <label class="block text-gray-700 mb-2">Date de fin</label>
            <input type="date" v-model="endDate" class="input" />
          </div>
        </div>
      </div>
      
      <div class="flex flex-wrap gap-4">
        <div class="w-full md:w-64">
          <label class="block text-gray-700 mb-2">Recherche</label>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Client, ID, articles..." 
            class="input"
          />
        </div>
        
        <div class="flex items-end">
          <button @click="applyFilters" class="btn btn-primary">Appliquer les filtres</button>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="card bg-white">
        <div class="text-center">
          <h3 class="text-sm font-medium mb-2 text-gray-500">TOTAL DES COMMANDES</h3>
          <p class="text-2xl font-bold text-op-black">{{ filteredOrders.length }}</p>
        </div>
      </div>
      
      <div class="card bg-white">
        <div class="text-center">
          <h3 class="text-sm font-medium mb-2 text-gray-500">TERMINÉES</h3>
          <p class="text-2xl font-bold text-green-600">{{ completedCount }}</p>
        </div>
      </div>
      
      <div class="card bg-white">
        <div class="text-center">
          <h3 class="text-sm font-medium mb-2 text-gray-500">ANNULÉES</h3>
          <p class="text-2xl font-bold text-red-600">{{ cancelledCount }}</p>
        </div>
      </div>
      
      <div class="card bg-white">
        <div class="text-center">
          <h3 class="text-sm font-medium mb-2 text-gray-500">EN COURS</h3>
          <p class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-op-black">Liste des commandes</h2>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Trier par:</span>
          <select v-model="sortOption" class="input py-1 px-2 text-sm">
            <option value="date-desc">Date (récent → ancien)</option>
            <option value="date-asc">Date (ancien → récent)</option>
            <option value="amount-desc">Montant (élevé → bas)</option>
            <option value="amount-asc">Montant (bas → élevé)</option>
          </select>
        </div>
      </div>
      
      <div v-if="filteredOrders.length === 0" class="text-gray-500 italic py-4">
        Aucune commande ne correspond aux critères de recherche
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in paginatedOrders" :key="order.id" :class="{'bg-gray-50': order.status === 'cancelled'}">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.customer }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <span v-for="(item, index) in order.items" :key="index" class="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {{ item }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(order.total) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(getRelevantDate(order)) }}
              </td>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="viewOrderDetails(order)" class="text-op-blue hover:text-blue-800">
                  Détails
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="flex justify-between items-center mt-4">
        <div class="text-sm text-gray-500">
          Affichage de {{ paginationStart + 1 }} à {{ paginationEnd }} sur {{ filteredOrders.length }} commandes
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)" 
            :disabled="currentPage === 1"
            :class="['btn', currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300']"
          >
            Précédent
          </button>
          <span class="text-sm text-gray-500">Page {{ currentPage }} sur {{ totalPages }}</span>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)" 
            :disabled="currentPage === totalPages"
            :class="['btn', currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300']"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">Détails de la commande #{{ selectedOrder.id }}</h2>
          <button @click="selectedOrder = null" class="btn-icon-only text-gray hover:text-dark">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-4">
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500">Client</p>
              <p class="font-medium">{{ selectedOrder.customer }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Date</p>
              <p class="font-medium">{{ formatDate(getRelevantDate(selectedOrder)) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Statut</p>
              <p>
                <span 
                  :class="{
                    'px-2 py-1 rounded-full text-xs font-medium': true,
                    'bg-green-100 text-green-800': selectedOrder.status === 'completed',
                    'bg-red-100 text-red-800': selectedOrder.status === 'cancelled',
                    'bg-yellow-100 text-yellow-800': selectedOrder.status === 'pending'
                  }"
                >
                  {{ getStatusLabel(selectedOrder.status) }}
                </span>
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total</p>
              <p class="font-medium">{{ formatCurrency(selectedOrder.total) }}</p>
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">Articles</h3>
            <ul class="space-y-2">
              <li v-for="(item, index) in selectedOrder.items" :key="index" class="bg-gray-50 p-3 rounded-lg">
                {{ item }}
              </li>
            </ul>
          </div>
          
          <div class="border-t border-gray-200 pt-4">
            <h3 class="text-lg font-medium mb-2">Historique</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <div class="bg-blue-100 rounded-full p-1 mr-3">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium">Commande créée</p>
                  <p class="text-sm text-gray-500">{{ formatDate(selectedOrder.createdAt) }}</p>
                </div>
              </li>
              <li v-if="selectedOrder.status === 'completed'" class="flex items-start">
                <div class="bg-green-100 rounded-full p-1 mr-3">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium">Commande terminée</p>
                  <p class="text-sm text-gray-500">{{ formatDate(selectedOrder.completedAt) }}</p>
                </div>
              </li>
              <li v-if="selectedOrder.status === 'cancelled'" class="flex items-start">
                <div class="bg-red-100 rounded-full p-1 mr-3">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium">Commande annulée</p>
                  <p class="text-sm text-gray-500">{{ formatDate(selectedOrder.cancelledAt) }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HistoryView',
  data() {
    return {
      statusFilter: 'all',
      periodFilter: 'all',
      startDate: this.formatDateForInput(new Date()),
      endDate: this.formatDateForInput(new Date()),
      searchQuery: '',
      sortOption: 'date-desc',
      currentPage: 1,
      itemsPerPage: 10,
      filteredOrders: [],
      selectedOrder: null
    }
  },
  computed: {
    ...mapGetters([
      'pendingOrders',
      'completedOrders',
      'cancelledOrders'
    ]),
    completedCount() {
      return this.filteredOrders.filter(order => order.status === 'completed').length
    },
    cancelledCount() {
      return this.filteredOrders.filter(order => order.status === 'cancelled').length
    },
    pendingCount() {
      return this.filteredOrders.filter(order => order.status === 'pending').length
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage)
    },
    paginationStart() {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    paginationEnd() {
      return Math.min(this.paginationStart + this.itemsPerPage, this.filteredOrders.length)
    },
    paginatedOrders() {
      return this.filteredOrders.slice(this.paginationStart, this.paginationEnd)
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
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
    applyFilters() {
      let allOrders = []
      
      if (this.statusFilter === 'all') {
        allOrders = [...this.pendingOrders, ...this.completedOrders, ...this.cancelledOrders]
      } else if (this.statusFilter === 'completed') {
        allOrders = [...this.completedOrders]
      } else if (this.statusFilter === 'cancelled') {
        allOrders = [...this.cancelledOrders]
      } else if (this.statusFilter === 'pending') {
        allOrders = [...this.pendingOrders]
      }
      
      // Filtrer par période
      let filteredByPeriod = allOrders
      
      if (this.periodFilter !== 'all') {
        const now = new Date()
        let startDate, endDate
        
        if (this.periodFilter === 'today') {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        } else if (this.periodFilter === 'week') {
          const dayOfWeek = now.getDay()
          const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
          startDate = new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0)
          endDate = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59)
        } else if (this.periodFilter === 'month') {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
        } else if (this.periodFilter === 'custom') {
          startDate = new Date(this.startDate)
          startDate.setHours(0, 0, 0)
          endDate = new Date(this.endDate)
          endDate.setHours(23, 59, 59)
        }
        
        filteredByPeriod = allOrders.filter(order => {
          const orderDate = new Date(this.getRelevantDate(order))
          return orderDate >= startDate && orderDate <= endDate
        })
      }
      
      let filteredBySearch = filteredByPeriod
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filteredBySearch = filteredByPeriod.filter(order => 
          order.customer.toLowerCase().includes(query) ||
          order.id.toString().includes(query) ||
          order.items.some(item => item.toLowerCase().includes(query))
        )
      }
      
      const sortedOrders = [...filteredBySearch]
      
      if (this.sortOption === 'date-desc') {
        sortedOrders.sort((a, b) => new Date(this.getRelevantDate(b)) - new Date(this.getRelevantDate(a)))
      } else if (this.sortOption === 'date-asc') {
        sortedOrders.sort((a, b) => new Date(this.getRelevantDate(a)) - new Date(this.getRelevantDate(b)))
      } else if (this.sortOption === 'amount-desc') {
        sortedOrders.sort((a, b) => b.total - a.total)
      } else if (this.sortOption === 'amount-asc') {
        sortedOrders.sort((a, b) => a.total - b.total)
      }
      
      this.filteredOrders = sortedOrders
      this.currentPage = 1
    },
    viewOrderDetails(order) {
      this.selectedOrder = order
    }
  },
  created() {
    this.$store.dispatch('fetchOrders')
    this.applyFilters()
  },
  watch: {
    sortOption() {
      this.applyFilters()
    },
    statusFilter() {
      this.applyFilters()
    },
    periodFilter() {
      this.applyFilters()
    },
    startDate() {
      this.applyFilters()
    },
    endDate() {
      this.applyFilters()
    },
    searchQuery() {
      this.applyFilters()
    }
  }
}
</script>
