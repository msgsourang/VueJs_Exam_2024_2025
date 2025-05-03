<template>
  <div class="container">
    <div class="card-header mb-6">
      <h1 class="card-title">Tableau de bord - One Piece Restaurant</h1>
      <button @click="loadData" class="btn btn-primary btn-icon">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Actualiser
      </button>
    </div>
    
    <div v-if="isLoading" class="flex justify-center items-center" style="height: 200px;">
      <div class="text-center">
        <div class="inline-block h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
        <p class="text-gray">Chargement...</p>
      </div>
    </div>
    
    <div v-else-if="error" class="flex justify-center items-center" style="height: 200px;">
      <div class="text-center">
        <div class="inline-block h-8 w-8 text-danger mb-2">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <p class="text-danger mb-3">Erreur de chargement</p>
        <button @click="loadData" class="btn btn-sm btn-primary">
          Réessayer
        </button>
      </div>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center mb-4">
            <div class="p-2 rounded-md bg-primary-light mr-3">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray mb-1">Revenus du jour</h3>
              <p class="text-xl font-bold text-dark">{{ formatCurrency(dailyRevenue) }} <span class="text-xs font-normal">FCFA</span></p>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-xs text-gray flex items-center">
              <svg class="w-4 h-4 mr-1 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <span>Aujourd'hui, {{ formatDate(new Date(), 'short') }}</span>
            </div>
            <span class="badge badge-primary">FCFA</span>
          </div>
        </div>
        
        <div class="card">
          <div class="flex items-center mb-4">
            <div class="p-2 rounded-md bg-warning-light mr-3">
              <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray mb-1">Revenus du mois</h3>
              <p class="text-xl font-bold text-dark">{{ formatCurrency(monthlyRevenue) }} <span class="text-xs font-normal">FCFA</span></p>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-xs text-gray flex items-center">
              <svg class="w-4 h-4 mr-1 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <span>{{ getCurrentMonth() }}</span>
            </div>
            <span class="badge badge-warning">FCFA</span>
          </div>
        </div>
        
        <div class="card">
          <div class="flex items-center mb-4">
            <div class="p-2 rounded-md bg-secondary-light mr-3">
              <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray mb-1">Revenus de l'année</h3>
              <p class="text-xl font-bold text-dark">{{ formatCurrency(yearlyRevenue) }} <span class="text-xs font-normal">FCFA</span></p>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-xs text-gray flex items-center">
              <svg class="w-4 h-4 mr-1 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <span>Année {{ new Date().getFullYear() }}</span>
            </div>
            <span class="badge badge-secondary">FCFA</span>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title flex items-center">
              <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              Commandes en cours
            </h2>
            <span class="badge badge-primary">
              {{ pendingOrders.length }} commande(s)
            </span>
          </div>
          
          <div v-if="pendingOrders.length === 0" class="flex flex-col items-center justify-center py-8 text-gray">
            <svg class="w-16 h-16 mb-4 text-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <p class="text-center font-medium">Aucune commande en cours</p>
            <p class="text-sm text-center text-gray mt-1">Les nouvelles commandes apparaîtront ici</p>
          </div>
          
          <div v-else class="space-y-4 max-h-96 overflow-y-auto pr-2">
            <div v-for="order in pendingOrders" :key="order.id" class="p-4 border border-gray-light rounded-lg hover:shadow transition-all duration-200">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center">
                    <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-light text-primary mr-3 font-bold text-sm">
                      #{{ order.id }}
                    </span>
                    <h3 class="font-semibold text-dark">{{ order.customer }}</h3>
                  </div>
                  <p class="text-sm text-gray mt-2 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ formatDate(order.createdAt) }}
                  </p>
                  <div class="mt-2">
                    <span v-for="(item, index) in order.items" :key="index" class="inline-block bg-gray-light rounded-full px-3 py-1 text-sm font-medium text-gray-dark mr-2 mb-2">
                      {{ item }}
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold text-lg text-primary">
                    {{ formatCurrency(order.total) }}
                    <span class="text-xs font-normal text-gray ml-1">FCFA</span>
                  </p>
                  <div class="mt-3 space-x-2 flex">
                    <button @click="completeOrder(order.id)" class="btn btn-success btn-sm flex-1 flex items-center justify-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Terminer
                    </button>
                    <button @click="cancelOrder(order.id)" class="btn btn-danger btn-sm flex-1 flex items-center justify-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="flex items-center mb-6">
            <h2 class="text-xl font-bold text-op-brown flex items-center">
              <svg class="w-6 h-6 mr-2 text-op-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Statistiques rapides
            </h2>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="flex items-center mb-2">
                <div class="p-2 rounded-md bg-green-100 mr-3">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-600">Commandes terminées</span>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ todayCompletedOrders.length }}</p>
              <p class="text-xs text-gray-500 mt-1">Aujourd'hui</p>
            </div>
            
            <div class="bg-red-50 p-4 rounded-lg">
              <div class="flex items-center mb-2">
                <div class="p-2 rounded-md bg-red-100 mr-3">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-600">Commandes annulées</span>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ todayCancelledOrders.length }}</p>
              <p class="text-xs text-gray-500 mt-1">Aujourd'hui</p>
            </div>
          </div>
          
          <div class="bg-op-tan bg-opacity-20 p-5 rounded-lg">
            <div class="flex items-center mb-4">
              <div class="p-2 rounded-md bg-op-gold bg-opacity-20 mr-3">
                <svg class="w-5 h-5 text-op-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-gray-700 font-medium">Valeur moyenne des commandes</span>
            </div>
            <p class="text-3xl font-bold text-op-brown">{{ formatCurrency(averageOrderValue) }}</p>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <span>Calculé sur les commandes terminées</span>
            </div>
          </div>
          
          <div class="mt-6 text-center">
            <button class="btn btn-senegal w-full">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Générer un rapport complet
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardView',
  computed: {
    ...mapGetters([
      'pendingOrders',
      'completedOrders',
      'cancelledOrders',
      'dailyRevenue',
      'monthlyRevenue',
      'yearlyRevenue',
      'isLoading',
      'error'
    ]),
    todayCompletedOrders() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      return this.completedOrders.filter(order => {
        const orderDate = new Date(order.completedAt)
        return orderDate >= today
      })
    },
    todayCancelledOrders() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      return this.cancelledOrders.filter(order => {
        const orderDate = new Date(order.cancelledAt)
        return orderDate >= today
      })
    },
    averageOrderValue() {
      if (this.completedOrders.length === 0) return 0
      
      const totalValue = this.completedOrders.reduce((total, order) => total + order.total, 0)
      return totalValue / this.completedOrders.length
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    },
    formatDate(dateString, format = 'full') {
      const date = new Date(dateString)
      if (format === 'short') {
        return date.toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit'
        })
      } else {
        return date.toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    },
    getCurrentMonth() {
      const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ]
      const currentDate = new Date()
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    },
    async completeOrder(orderId) {
      try {
        await this.$store.dispatch('completeOrder', orderId)
        alert('Commande terminée avec succès')
      } catch (error) {
        alert('Erreur lors de la complétion de la commande: ' + error.message)
      }
    },
    async cancelOrder(orderId) {
      try {
        if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
          await this.$store.dispatch('cancelOrder', orderId)
          alert('Commande annulée avec succès')
        }
      } catch (error) {
        alert('Erreur lors de l\'annulation de la commande: ' + error.message)
      }
    },
    loadData() {
      this.$store.dispatch('loadAllData')
    }
  },
  created() {
    this.loadData();
    
    this.autoRefreshInterval = setInterval(() => {
      this.loadData();
    }, 30000);
  },
  
  beforeUnmount() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  }
}
</script>
