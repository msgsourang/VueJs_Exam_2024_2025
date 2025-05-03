<template>
  <div class="layout">
    <aside class="sidebar" :class="{ 'sidebar-hidden': !sidebarOpen }">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="sidebar-brand-icon bg-primary text-white rounded-md p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div class="sidebar-brand-text ml-3">
            <span>One Piece</span>
          </div>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Menu principal</div>
          
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ 'active': $route.name === 'dashboard' }"
            exact
          >
            <svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span>Tableau de bord</span>
          </router-link>
          
          <router-link 
            to="/orders" 
            class="nav-link"
            :class="{ 'active': $route.name === 'orders' }"
          >
            <svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <span>Commandes</span>
            <span class="nav-link-badge">Nouveau</span>
          </router-link>
        </div>
        
        <div class="nav-section">
          <div class="nav-section-title">Finance</div>
          
          <router-link 
            to="/accounting" 
            class="nav-link"
            :class="{ 'active': $route.name === 'accounting' }"
          >
            <svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Comptabilité</span>
          </router-link>
          
          <router-link 
            to="/reports" 
            class="nav-link"
            :class="{ 'active': $route.name === 'reports' }"
          >
            <svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Rapports</span>
          </router-link>
        </div>
        
        <div class="nav-section">
          <div class="nav-section-title">Autres</div>
          
          <router-link 
            to="/history" 
            class="nav-link"
            :class="{ 'active': $route.name === 'history' }"
          >
            <svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Historique</span>
          </router-link>
          
          <a href="#" class="nav-link" @click.prevent="showNewOrderModal = true">
            <svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Nouvelle commande</span>
          </a>
        </div>
      </nav>
      

    </aside>
    
    <div class="main-content">
      <header class="header">
        <div class="header-left">
        </div>
        
        <div class="header-right">
          <button class="btn btn-primary" @click="showNewOrderModal = true">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nouvelle commande
          </button>
        </div>
      </header>
      
      <main class="p-6" style="width: 100%; min-height: calc(100vh - 64px); flex: 1; overflow-y: auto;">
        <div class="w-full" style="max-width: 100%;">
          <router-view />
        </div>
      </main>
    </div>
    
    <div v-if="showNewOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">Nouvelle commande</h2>
          <button @click="showNewOrderModal = false" class="btn-icon-only text-gray hover:text-dark">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-4">
          <form @submit.prevent="createNewOrder">
            <div class="form-group">
              <label for="customer" class="form-label">Client</label>
              <input type="text" id="customer" v-model="newOrder.customer" class="input" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Articles</label>
              <div v-for="(item, index) in newOrder.items" :key="index" class="flex items-center mb-2">
                <input type="text" v-model="newOrder.items[index]" class="input mr-2" placeholder="Nom de l'article">
                <button type="button" @click="removeItem(index)" class="btn-icon-only bg-danger-light text-danger">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              <button type="button" @click="addItem" class="btn btn-outline-primary btn-sm mt-2">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Ajouter un article
              </button>
            </div>
            
            <div class="form-group">
              <label for="total" class="form-label">Total (FCFA)</label>
              <input type="number" id="total" v-model="newOrder.total" class="input" required>
            </div>
            
            <div class="flex justify-end mt-6">
              <button type="button" @click="showNewOrderModal = false" class="btn btn-light mr-2">Annuler</button>
              <button type="submit" class="btn btn-primary">Créer la commande</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      sidebarOpen: false,
      notificationsOpen: false,
      showNewOrderModal: false,
      newOrder: {
        customer: '',
        items: [''],
        total: 0
      }
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    addItem() {
      this.newOrder.items.push('')
    },
    removeItem(index) {
      if (this.newOrder.items.length > 1) {
        this.newOrder.items.splice(index, 1)
      }
    },
    async createNewOrder() {
      try {
        const items = this.newOrder.items.filter(item => item.trim() !== '')
        
        if (items.length === 0) {
          alert('Veuillez ajouter au moins un article à la commande')
          return
        }
        
        if (!this.newOrder.customer) {
          alert('Veuillez indiquer le nom du client')
          return
        }
        
        if (!this.newOrder.total || this.newOrder.total <= 0) {
          alert('Veuillez indiquer un montant valide')
          return
        }
        
        const order = {
          customer: this.newOrder.customer,
          items: items,
          total: parseFloat(this.newOrder.total),
          createdAt: new Date().toISOString(),
          status: 'pending'
        }
        
        await this.$store.dispatch('createOrder', order)
        
        this.newOrder = {
          customer: '',
          items: [''],
          total: 0
        }
        
        this.showNewOrderModal = false
        
        alert('Commande créée avec succès')
      } catch (error) {
        alert('Erreur lors de la création de la commande: ' + error.message)
      }
    }
  },
  created() {
    const handleResize = () => {
      this.sidebarOpen = window.innerWidth >= 1024
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    this.$store.dispatch('loadAllData')
    
    this.handleResize = handleResize
  },
  
  beforeUnmount() {
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize)
    }
  }
}
</script>
