const randomTimestamp = (hoursAgo = 24) => {
  const now = new Date();
  const date = new Date(now.getTime() - Math.random() * hoursAgo * 60 * 60 * 1000);
  return date.toISOString();
};

const customers = [
  'Luffy D. Monkey', 'Zoro Roronoa', 'Nami', 'Usopp', 'Sanji', 'Chopper', 
  'Robin', 'Franky', 'Brook', 'Jinbe', 'Vivi', 'Law', 'Ace', 'Sabo', 
  'Hancock', 'Mihawk', 'Shanks', 'Buggy', 'Crocodile', 'Doflamingo'
];

const menuItems = [
  'Viande grillée', 'Poisson frit', 'Salade de fruits', 'Café', 'Thé', 
  'Jus de fruit', 'Cocktail', 'Saké', 'Pâtisserie', 'Sandwich', 'Soda', 
  'Soupe de poisson', 'Riz au curry', 'Nouilles sautées', 'Légumes grillés', 
  'Fruits de mer', 'Dessert du jour', 'Glace', 'Gâteau', 'Eau minérale'
];

const generateRandomOrder = (id, status = 'pending') => {
  const itemCount = Math.floor(Math.random() * 3) + 1;
  const items = [];
  for (let i = 0; i < itemCount; i++) {
    const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
    if (!items.includes(randomItem)) {
      items.push(randomItem);
    }
  }
  
  const total = Math.floor(Math.random() * 20000) + 5000;
  const createdAt = randomTimestamp();
  
  const order = {
    id,
    customer: customers[Math.floor(Math.random() * customers.length)],
    items,
    total,
    status,
    createdAt
  };
  
  if (status === 'completed') {
    order.completedAt = new Date(new Date(createdAt).getTime() + Math.random() * 60 * 60 * 1000).toISOString();
  } else if (status === 'cancelled') {
    order.cancelledAt = new Date(new Date(createdAt).getTime() + Math.random() * 30 * 60 * 1000).toISOString();
  }
  
  return order;
};

let mockData = null;

const refreshMockData = () => {
  const pendingCount = 3 + Math.floor(Math.random() * 3);
  const completedCount = 5 + Math.floor(Math.random() * 5);
  const cancelledCount = 2 + Math.floor(Math.random() * 3);
  
  const orders = [];
  let id = 1;
  
  for (let i = 0; i < pendingCount; i++) {
    orders.push(generateRandomOrder(id++, 'pending'));
  }
  
  for (let i = 0; i < completedCount; i++) {
    orders.push(generateRandomOrder(id++, 'completed'));
  }
  
  for (let i = 0; i < cancelledCount; i++) {
    orders.push(generateRandomOrder(id++, 'cancelled'));
  }
  const dailyRevenue = Math.floor(Math.random() * 200000) + 100000;
  const monthlyRevenue = dailyRevenue * (20 + Math.floor(Math.random() * 10));
  const yearlyRevenue = monthlyRevenue * (10 + Math.floor(Math.random() * 5));
  
  mockData = {
    orders,
    revenue: {
      daily: [
        { date: new Date().toISOString().split('T')[0], amount: dailyRevenue }
      ],
      monthly: [
        { month: new Date().toISOString().slice(0, 7), amount: monthlyRevenue }
      ],
      yearly: [
        { year: new Date().getFullYear().toString(), amount: yearlyRevenue }
      ]
    },
    products: [
      { id: 1, name: 'Thieboudienne', price: 8000, category: 'Plat principal' },
      { id: 2, name: 'Yassa Poulet', price: 7000, category: 'Plat principal' },
      { id: 3, name: 'Mafé', price: 7500, category: 'Plat principal' },
      { id: 4, name: 'Bissap', price: 2000, category: 'Boisson' },
      { id: 5, name: 'Jus de Gingembre', price: 2500, category: 'Boisson' },
      { id: 6, name: 'Thiakry', price: 3000, category: 'Dessert' }
    ],
    customers: [
      { id: 1, name: 'Luffy D. Monkey', email: 'luffy@onepiece.com', phone: '77 123 45 67' },
      { id: 2, name: 'Zoro Roronoa', email: 'zoro@onepiece.com', phone: '77 234 56 78' },
      { id: 3, name: 'Nami', email: 'nami@onepiece.com', phone: '77 345 67 89' },
      { id: 4, name: 'Sanji', email: 'sanji@onepiece.com', phone: '77 456 78 90' },
      { id: 5, name: 'Usopp', email: 'usopp@onepiece.com', phone: '77 567 89 01' }
    ]
  };
  
  return mockData;
};

refreshMockData();

setInterval(refreshMockData, 5 * 60 * 1000);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  async getOrders() {
    await delay(500); 
    return { data: mockData.orders };
  },
  async getOrder(id) {
    await delay(300);
    const order = mockData.orders.find(o => o.id === parseInt(id));
    return { data: order || null };
  },
  async createOrder(order) {
    await delay(500);
    const newOrder = {
      ...order,
      id: mockData.orders.length + 1
    };
    mockData.orders.push(newOrder);
    return { data: newOrder };
  },
  async updateOrder(id, order) {
    await delay(400);
    const index = mockData.orders.findIndex(o => o.id === parseInt(id));
    if (index !== -1) {
      mockData.orders[index] = { ...order, id: parseInt(id) };
      return { data: mockData.orders[index] };
    }
    throw new Error('Commande non trouvée');
  },
  async deleteOrder(id) {
    await delay(300);
    const index = mockData.orders.findIndex(o => o.id === parseInt(id));
    if (index !== -1) {
      const deletedOrder = mockData.orders.splice(index, 1)[0];
      return { data: deletedOrder };
    }
    throw new Error('Commande non trouvée');
  },

  async getRevenue() {
    await delay(400);
    return { data: mockData.revenue };
  },
  async getProducts() {
    await delay(300);
    return { data: mockData.products };
  },
  async getProduct(id) {
    await delay(200);
    const product = mockData.products.find(p => p.id === parseInt(id));
    return { data: product || null };
  },

  async getCustomers() {
    await delay(300);
    return { data: mockData.customers };
  },
  async getCustomer(id) {
    await delay(200);
    const customer = mockData.customers.find(c => c.id === parseInt(id));
    return { data: customer || null };
  }
};
