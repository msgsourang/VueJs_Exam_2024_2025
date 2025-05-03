import { createStore } from 'vuex';
import api from '@/services/api';

export default createStore({
  state() {
    return {
      orders: [],
      completedOrders: [],
      cancelledOrders: [],
      dailyRevenue: 0,
      monthlyRevenue: 0,
      yearlyRevenue: 0,
      products: [],
      customers: [],
      loading: false,
      error: null
    };
  },
  mutations: {
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_ORDERS(state, orders) {
      state.orders = orders.filter(order => order.status === 'pending');
      state.completedOrders = orders.filter(order => order.status === 'completed');
      state.cancelledOrders = orders.filter(order => order.status === 'cancelled');
    },
    SET_REVENUE(state, revenue) {
      const today = new Date().toISOString().split('T')[0];
      const dailyRevenue = revenue.daily.find(item => item.date === today);
      state.dailyRevenue = dailyRevenue ? dailyRevenue.amount : 0;
      
      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthlyRevenue = revenue.monthly.find(item => item.month === currentMonth);
      state.monthlyRevenue = monthlyRevenue ? monthlyRevenue.amount : 0;
      
      const currentYear = new Date().getFullYear().toString();
      const yearlyRevenue = revenue.yearly.find(item => item.year === currentYear);
      state.yearlyRevenue = yearlyRevenue ? yearlyRevenue.amount : 0;
    },
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    SET_CUSTOMERS(state, customers) {
      state.customers = customers;
    },
    ADD_ORDER(state, order) {
      if (order.status === 'pending') {
        state.orders.push(order);
      } else if (order.status === 'completed') {
        state.completedOrders.push(order);
      } else if (order.status === 'cancelled') {
        state.cancelledOrders.push(order);
      }
    },
    UPDATE_ORDER_STATUS(state, { orderId, newStatus, timestamp }) {
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        const order = { ...state.orders[orderIndex] };
        order.status = newStatus;
        
        state.orders.splice(orderIndex, 1);
        
        if (newStatus === 'completed') {
          order.completedAt = timestamp;
          state.completedOrders.push(order);
          
          state.dailyRevenue += order.total;
          state.monthlyRevenue += order.total;
          state.yearlyRevenue += order.total;
        } else if (newStatus === 'cancelled') {
          order.cancelledAt = timestamp;
          state.cancelledOrders.push(order);
        }
      }
    }
  },
  actions: {
    async fetchOrders({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.getOrders();
        commit('SET_ORDERS', response.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', 'Erreur lors du chargement des commandes: ' + error.message);
        console.error('Erreur lors du chargement des commandes:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchRevenue({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.getRevenue();
        commit('SET_REVENUE', response.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', 'Erreur lors du chargement des revenus: ' + error.message);
        console.error('Erreur lors du chargement des revenus:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchProducts({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.getProducts();
        commit('SET_PRODUCTS', response.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', 'Erreur lors du chargement des produits: ' + error.message);
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchCustomers({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.getCustomers();
        commit('SET_CUSTOMERS', response.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', 'Erreur lors du chargement des clients: ' + error.message);
        console.error('Erreur lors du chargement des clients:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createOrder({ commit }, order) {
      commit('SET_LOADING', true);
      try {
        const response = await api.createOrder({
          ...order,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        commit('ADD_ORDER', response.data);
        commit('SET_ERROR', null);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', 'Erreur lors de la création de la commande: ' + error.message);
        console.error('Erreur lors de la création de la commande:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async completeOrder({ commit, state }, orderId) {
      commit('SET_LOADING', true);
      try {
        const order = state.orders.find(o => o.id === orderId);
        if (!order) throw new Error('Commande non trouvée');
        
        const timestamp = new Date().toISOString();
        const updatedOrder = {
          ...order,
          status: 'completed',
          completedAt: timestamp
        };
        
        await api.updateOrder(orderId, updatedOrder);
        commit('UPDATE_ORDER_STATUS', { orderId, newStatus: 'completed', timestamp });
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', 'Erreur lors de la complétion de la commande: ' + error.message);
        console.error('Erreur lors de la complétion de la commande:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async cancelOrder({ commit, state }, orderId) {
      commit('SET_LOADING', true);
      try {
        const order = state.orders.find(o => o.id === orderId);
        if (!order) throw new Error('Commande non trouvée');
        
        const timestamp = new Date().toISOString();
        const updatedOrder = {
          ...order,
          status: 'cancelled',
          cancelledAt: timestamp
        };
        
        await api.updateOrder(orderId, updatedOrder);
        commit('UPDATE_ORDER_STATUS', { orderId, newStatus: 'cancelled', timestamp });
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', 'Erreur lors de l\'annulation de la commande: ' + error.message);
        console.error('Erreur lors de l\'annulation de la commande:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async loadAllData({ dispatch }) {
      await Promise.all([
        dispatch('fetchOrders'),
        dispatch('fetchRevenue'),
        dispatch('fetchProducts'),
        dispatch('fetchCustomers')
      ]);
    }
  },
  getters: {
    pendingOrders: state => state.orders,
    completedOrders: state => state.completedOrders,
    cancelledOrders: state => state.cancelledOrders,
    dailyRevenue: state => state.dailyRevenue,
    monthlyRevenue: state => state.monthlyRevenue,
    yearlyRevenue: state => state.yearlyRevenue,
    products: state => state.products,
    customers: state => state.customers,
    isLoading: state => state.loading,
    error: state => state.error
  }
});
