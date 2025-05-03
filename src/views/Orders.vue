<template>
  <div class="container">
    <div class="card-header mb-6">
      <h1 class="card-title">Gestion des Commandes</h1>
      <button class="btn btn-primary btn-icon" @click="showNewOrderForm = !showNewOrderForm">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        {{ showNewOrderForm ? 'Annuler' : 'Nouvelle commande' }}
      </button>
    </div>
    
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div class="flex items-center space-x-2">
        <button 
          @click="activeTab = 'pending'" 
          :class="['btn', activeTab === 'pending' ? 'btn-primary' : 'btn-light']"
        >
          En cours <span class="badge badge-primary ml-2">{{ pendingOrders.length }}</span>
        </button>
        <button 
          @click="activeTab = 'completed'" 
          :class="['btn', activeTab === 'completed' ? 'btn-success' : 'btn-light']"
        >
          Terminées <span class="badge badge-success ml-2">{{ completedOrders.length }}</span>
        </button>
        <button 
          @click="activeTab = 'cancelled'" 
          :class="['btn', activeTab === 'cancelled' ? 'btn-danger' : 'btn-light']"
        >
          Annulées <span class="badge badge-danger ml-2">{{ cancelledOrders.length }}</span>
        </button>
      </div>
      
      <div class="w-full md:w-64">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher une commande..." 
          class="input"
        />
      </div>
    </div>
    
    <div v-if="showNewOrderForm" class="card mb-8">
      <div class="card-header">
        <h2 class="card-title">Nouvelle commande</h2>
      </div>
      
      <div class="p-4">
        <div class="form-group">
          <label class="form-label" for="customer">
            Client
          </label>
          <input 
            id="customer" 
            v-model="newOrder.customer" 
            type="text" 
            class="input" 
            placeholder="Nom du client"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">
            Articles
          </label>
          <div v-for="(item, index) in newOrder.items" :key="index" class="flex mb-2">
            <input 
              v-model="newOrder.items[index]" 
              type="text" 
              class="input mr-2 flex-grow" 
              placeholder="Nom de l'article"
            />
            <button 
              @click="removeItem(index)" 
              class="btn-icon-only bg-danger-light text-danger"
              :disabled="newOrder.items.length === 1"
              type="button"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
          <button 
            @click="addItem" 
            class="btn btn-outline-primary btn-sm mt-2"
            type="button"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Ajouter un article
          </button>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="total">
            Total (FCFA)
          </label>
          <input 
            id="total" 
            v-model.number="newOrder.total" 
            type="number" 
            class="input" 
            placeholder="Montant total"
            required
          />
        </div>
        
        <div class="flex justify-end mt-6">
          <button 
            @click="showNewOrderForm = false" 
            class="btn btn-light mr-2"
            type="button"
          >
            Annuler
          </button>
          <button 
            @click="submitNewOrder" 
            class="btn btn-primary"
            type="button"
          >
            Créer la commande
          </button>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h2 class="text-xl font-bold mb-4">
        {{ tabTitle }}
      </h2>
      
      <div v-if="filteredOrders.length === 0" class="text-gray-500 italic py-4">
        Aucune commande à afficher
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id">
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="viewOrderDetails(order)" class="text-primary hover:text-primary-dark">Détails</button>
                  <div v-if="activeTab === 'pending'" class="flex space-x-2">
                    <button @click="completeOrder(order.id)" class="text-success hover:text-success-dark">Terminer</button>
                    <button @click="cancelOrder(order.id)" class="text-danger hover:text-danger-dark">Annuler</button>
                  </div>
                  <div v-else-if="activeTab === 'completed'" class="text-success">Terminée</div>
                  <div v-else class="text-danger">Annulée</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
              <p class="text-sm text-gray">Client</p>
              <p class="font-semibold">{{ selectedOrder.customer }}</p>
            </div>
            <div>
              <p class="text-sm text-gray">Date</p>
              <p class="font-semibold">{{ formatDate(getRelevantDate(selectedOrder)) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray">Statut</p>
              <p class="font-semibold">
                <span v-if="selectedOrder.status === 'pending'" class="text-primary">En cours</span>
                <span v-else-if="selectedOrder.status === 'completed'" class="text-success">Terminée</span>
                <span v-else class="text-danger">Annulée</span>
              </p>
            </div>
            <div>
              <p class="text-sm text-gray">Montant</p>
              <p class="font-semibold">{{ formatCurrency(selectedOrder.total) }}</p>
            </div>
          </div>
          
          <div class="mb-6">
            <p class="text-sm text-gray mb-2">Articles</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="(item, index) in selectedOrder.items" :key="index" class="inline-block bg-gray-light rounded-full px-3 py-1 text-sm font-medium text-gray-dark">
                {{ item }}
              </span>
            </div>
          </div>
          
          <div v-if="selectedOrder.status === 'pending'" class="flex justify-end space-x-2">
            <button @click="completeOrder(selectedOrder.id); selectedOrder = null;" class="btn btn-success btn-sm">
              Terminer
            </button>
            <button @click="cancelOrder(selectedOrder.id); selectedOrder = null;" class="btn btn-danger btn-sm">
              Annuler
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
  name: 'OrdersView',
  data() {
    return {
      activeTab: 'pending',
      searchQuery: '',
      showNewOrderForm: false,
      selectedOrder: null,
      newOrder: {
        customer: '',
        items: [''],
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'pendingOrders',
      'completedOrders',
      'cancelledOrders'
    ]),
    tabTitle() {
      switch (this.activeTab) {
        case 'pending':
          return 'Commandes en cours'
        case 'completed':
          return 'Commandes terminées'
        case 'cancelled':
          return 'Commandes annulées'
        default:
          return 'Commandes'
      }
    },
    currentOrders() {
      switch (this.activeTab) {
        case 'pending':
          return this.pendingOrders
        case 'completed':
          return this.completedOrders
        case 'cancelled':
          return this.cancelledOrders
        default:
          return []
      }
    },
    filteredOrders() {
      if (!this.searchQuery) return this.currentOrders
      
      const query = this.searchQuery.toLowerCase()
      return this.currentOrders.filter(order => 
        order.customer.toLowerCase().includes(query) ||
        order.id.toString().includes(query) ||
        order.items.some(item => item.toLowerCase().includes(query))
      )
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
    formatDate(date) {
      return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getRelevantDate(order) {
      if (order.status === 'completed') return order.completedAt
      if (order.status === 'cancelled') return order.cancelledAt
      return order.createdAt
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
    addItem() {
      this.newOrder.items.push('')
    },
    removeItem(index) {
      if (this.newOrder.items.length > 1) {
        this.newOrder.items.splice(index, 1)
      }
    },
    viewOrderDetails(order) {
      this.selectedOrder = {...order}
    },
    async submitNewOrder() {
      try {
        if (!this.newOrder.customer.trim()) {
          alert('Veuillez entrer le nom du client')
          return
        }
        
        if (this.newOrder.items.every(item => !item.trim())) {
          alert('Veuillez ajouter au moins un article')
          return
        }
        
        if (!this.newOrder.total || this.newOrder.total <= 0) {
          alert('Veuillez entrer un montant valide')
          return
        }
        
        const order = {
          customer: this.newOrder.customer,
          items: this.newOrder.items.filter(item => item.trim()),
          total: this.newOrder.total,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
        
        await this.$store.dispatch('createOrder', order)
        
        this.newOrder = {
          customer: '',
          items: [''],
          total: 0
        }
        
        this.showNewOrderForm = false
        alert('Commande créée avec succès')
      } catch (error) {
        console.error('Erreur lors de la création de la commande:', error)
        alert(`Erreur: ${error.message || 'Une erreur est survenue lors de la création de la commande'}`)
      }
    }
  },
  created() {
    this.$store.dispatch('fetchOrders');
    
    this.autoRefreshInterval = setInterval(() => {
      this.$store.dispatch('fetchOrders');
    }, 30000);
  },
  
  beforeUnmount() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  }
}
</script>
