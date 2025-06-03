<template>
  <div class="welcome-shop">
    <h2 class="text-2xl font-bold text-center mb-6 dark:text-white">ช้อปปิ้งออนไลน์</h2>
    
    <!-- Search Bar -->
    <div class="mb-6 relative max-w-2xl mx-auto">
      <div class="relative">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาสินค้าหรือร้านค้า..."
          class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
        <span class="absolute left-3 top-3 text-gray-400">
          <span class="i-mdi-magnify text-xl"></span>
        </span>
      </div>
    </div>
    
    <!-- Categories -->
    <div class="mb-6 overflow-x-auto">
      <div class="flex space-x-2 pb-2">
        <button 
          v-for="(category, index) in categories" 
          :key="index"
          @click="selectCategory(category)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap',
            selectedCategory === category 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-700 dark:text-gray-300 dark:hover:bg-dark-600'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>
    
    <!-- Marketplace Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div 
        v-for="(product, index) in filteredProducts" 
        :key="index"
        class="bg-white dark:bg-dark-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-dark-600"
      >
        <div class="relative pt-[100%] bg-gray-100 dark:bg-dark-600">
          <img 
            :src="product.image" 
            :alt="product.name"
            class="absolute inset-0 w-full h-full object-cover"
          >
          <div class="absolute top-2 right-2 bg-white dark:bg-dark-800 rounded-full p-1 shadow">
            <span :class="product.platformIcon" class="text-lg"></span>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2 h-12">{{ product.name }}</h3>
          <div class="mt-2 flex items-center justify-between">
            <div>
              <p class="text-lg font-bold text-blue-600 dark:text-blue-400">฿{{ product.price.toLocaleString() }}</p>
              <div class="flex items-center text-yellow-400 text-sm">
                <span class="i-mdi-star"></span>
                <span class="ml-1 text-gray-600 dark:text-gray-400">{{ product.rating }} ({{ product.reviews }})</span>
              </div>
            </div>
            <button 
              class="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              title="เพิ่มลงในตะกร้า"
            >
              <span class="i-mdi-cart-plus text-xl"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Platform Tabs -->
    <div class="mt-8">
      <h3 class="text-lg font-medium mb-4 dark:text-white">แพลตฟอร์มยอดนิยม</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <div 
          v-for="platform in platforms" 
          :key="platform.name"
          @click="selectPlatform(platform)"
          class="p-4 border rounded-lg text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors dark:border-dark-600"
        >
          <div class="w-12 h-12 mx-auto mb-2 flex items-center justify-center text-2xl">
            <span :class="platform.icon"></span>
          </div>
          <span class="text-sm font-medium dark:text-gray-200">{{ platform.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedCategory = ref('ทั้งหมด');

const categories = [
  'ทั้งหมด',
  'แฟชั่น',
  'อิเล็กทรอนิกส์',
  'ของใช้ในบ้าน',
  'ความงาม',
  'ของเล่น',
  'กีฬา',
  'หนังสือ',
  'อื่นๆ'
];

const platforms = [
  { name: 'Lazada', icon: 'i-mdi-shopping text-red-500' },
  { name: 'Shopee', icon: 'i-mdi-shopping-search text-orange-400' },
  { name: 'JD Central', icon: 'i-mdi-store text-red-600' },
  { name: 'Shopify', icon: 'i-mdi-cart text-green-600' },
  { name: 'Amazon', icon: 'i-mdi-amazon text-yellow-500' },
  { name: 'eBay', icon: 'i-mdi-ebay text-blue-500' },
];

const products = [
  {
    name: 'หูฟังไร้สาย Sony WH-1000XM4',
    price: 9990,
    rating: 4.8,
    reviews: 1245,
    category: 'อิเล็กทรอนิกส์',
    platform: 'Lazada',
    platformIcon: 'i-mdi-shopping text-red-500',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'รองเท้าวิ่ง Nike Air Zoom Pegasus 39',
    price: 4290,
    rating: 4.6,
    reviews: 876,
    category: 'กีฬา',
    platform: 'Shopee',
    platformIcon: 'i-mdi-shopping-search text-orange-400',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'สมาร์ทโฟน Samsung Galaxy S23 Ultra',
    price: 42900,
    rating: 4.9,
    reviews: 2345,
    category: 'อิเล็กทรอนิกส์',
    platform: 'JD Central',
    platformIcon: 'i-mdi-store text-red-600',
    image: 'https://images.unsplash.com/photo-1676314925821-5fd089406f52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'นาฬิกาข้อมืออัจฉริยะ Apple Watch Series 8',
    price: 15900,
    rating: 4.7,
    reviews: 1890,
    category: 'อิเล็กทรอนิกส์',
    platform: 'Lazada',
    platformIcon: 'i-mdi-shopping text-red-500',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'กระเป๋าแบรนด์เนม Louis Vuitton',
    price: 85000,
    rating: 4.9,
    reviews: 342,
    category: 'แฟชั่น',
    platform: 'Shopee',
    platformIcon: 'i-mdi-shopping-search text-orange-400',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'หุ่นยนต์ดูดฝุ่น Xiaomi Robot Vacuum Mop 2 Pro',
    price: 12990,
    rating: 4.5,
    reviews: 765,
    category: 'ของใช้ในบ้าน',
    platform: 'Lazada',
    platformIcon: 'i-mdi-shopping text-red-500',
    image: 'https://images.unsplash.com/photo-1583845112203-4543754ea545?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'เครื่องทำกาแฟ Nespresso Vertuo Next',
    price: 8990,
    rating: 4.7,
    reviews: 432,
    category: 'ของใช้ในบ้าน',
    platform: 'JD Central',
    platformIcon: 'i-mdi-store text-red-600',
    image: 'https://images.unsplash.com/photo-1608350308993-110b8bcb0933?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'หูฟัง AirPods Pro 2',
    price: 10900,
    rating: 4.8,
    reviews: 3210,
    category: 'อิเล็กทรอนิกส์',
    platform: 'Shopee',
    platformIcon: 'i-mdi-shopping-search text-orange-400',
    image: 'https://images.unsplash.com/photo-1633894583724-7a3b2a9db8a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }
];

const filteredProducts = computed(() => {
  let result = [...products];
  
  // Filter by category
  if (selectedCategory.value !== 'ทั้งหมด') {
    result = result.filter(product => product.category === selectedCategory.value);
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query) ||
      product.platform.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const selectCategory = (category: string) => {
  selectedCategory.value = category;
};

const selectPlatform = (platform: {name: string, icon: string}) => {
  searchQuery.value = platform.name;
};

const emit = defineEmits(['select-app']);
</script>

<style scoped>
/* Add any specific styles for shop mode here */
.welcome-shop {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>