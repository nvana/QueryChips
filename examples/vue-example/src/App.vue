

<script setup lang="ts">
import { ref, computed } from 'vue';
import QueryChipsVue from '../../../wrappers/QueryChipsVue.vue';

// Sample data for different examples
const employeeData = [
  { id: 1, name: 'John Doe', department: 'Engineering', status: 'Active', experience: 5, salary: 85000, location: 'San Francisco', remote: true, skills: ['JavaScript', 'React', 'Node.js'], joinDate: '2022-03-15', manager: 'Sarah Wilson' },
  { id: 2, name: 'Jane Smith', department: 'Design', status: 'Active', experience: 3, salary: 75000, location: 'New York', remote: false, skills: ['Figma', 'Sketch', 'Adobe Creative Suite'], joinDate: '2023-01-10', manager: 'Mike Chen' },
  { id: 3, name: 'Bob Johnson', department: 'Engineering', status: 'Inactive', experience: 7, salary: 95000, location: 'Seattle', remote: true, skills: ['Python', 'Django', 'PostgreSQL'], joinDate: '2021-08-22', manager: 'Sarah Wilson' },
  { id: 4, name: 'Alice Brown', department: 'Product', status: 'Active', experience: 4, salary: 80000, location: 'Austin', remote: true, skills: ['Product Management', 'User Research', 'Analytics'], joinDate: '2022-11-05', manager: 'David Lee' },
  { id: 5, name: 'Charlie Wilson', department: 'Marketing', status: 'Active', experience: 2, salary: 65000, location: 'Chicago', remote: false, skills: ['Digital Marketing', 'SEO', 'Content Creation'], joinDate: '2023-06-20', manager: 'Lisa Park' },
  { id: 6, name: 'Diana Miller', department: 'Engineering', status: 'Active', experience: 6, salary: 90000, location: 'Boston', remote: true, skills: ['Java', 'Spring Boot', 'Microservices'], joinDate: '2021-12-03', manager: 'Sarah Wilson' },
  { id: 7, name: 'Evan Davis', department: 'Design', status: 'Active', experience: 4, salary: 78000, location: 'Portland', remote: true, skills: ['UI/UX Design', 'Prototyping', 'User Testing'], joinDate: '2022-09-14', manager: 'Mike Chen' },
  { id: 8, name: 'Fiona Garcia', department: 'Sales', status: 'Active', experience: 8, salary: 82000, location: 'Miami', remote: false, skills: ['Sales Strategy', 'CRM', 'Negotiation'], joinDate: '2020-05-18', manager: 'Tom Rodriguez' },
  { id: 9, name: 'George Kim', department: 'Engineering', status: 'Active', experience: 3, salary: 88000, location: 'Denver', remote: true, skills: ['React', 'TypeScript', 'GraphQL'], joinDate: '2023-03-08', manager: 'Sarah Wilson' },
  { id: 10, name: 'Helen Wong', department: 'HR', status: 'Active', experience: 5, salary: 72000, location: 'Los Angeles', remote: false, skills: ['Recruitment', 'Employee Relations', 'HRIS'], joinDate: '2022-07-12', manager: 'Jennifer Adams' },
];

const productData = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299, inStock: true, rating: 4.5, brand: 'TechCorp', tags: ['laptop', 'computer', 'workstation'], weight: 2.5, dimensions: '15.6" x 10.2" x 0.8"', warranty: '2 years' },
  { id: 2, name: 'Wireless Headphones', category: 'Electronics', price: 199, inStock: true, rating: 4.2, brand: 'AudioMax', tags: ['audio', 'wireless', 'bluetooth'], weight: 0.3, dimensions: '7.5" x 6.8" x 2.1"', warranty: '1 year' },
  { id: 3, name: 'Coffee Maker', category: 'Home', price: 89, inStock: false, rating: 4.0, brand: 'KitchenPro', tags: ['kitchen', 'appliance', 'coffee'], weight: 4.2, dimensions: '12" x 8" x 14"', warranty: '1 year' },
  { id: 4, name: 'Running Shoes', category: 'Sports', price: 120, inStock: true, rating: 4.7, brand: 'SportFlex', tags: ['footwear', 'running', 'athletic'], weight: 0.8, dimensions: '12" x 4" x 4"', warranty: '6 months' },
  { id: 5, name: 'Smartphone', category: 'Electronics', price: 899, inStock: true, rating: 4.3, brand: 'TechCorp', tags: ['mobile', 'phone', 'smartphone'], weight: 0.2, dimensions: '6.1" x 3.0" x 0.3"', warranty: '1 year' },
  { id: 6, name: 'Yoga Mat', category: 'Sports', price: 45, inStock: true, rating: 4.1, brand: 'FitLife', tags: ['fitness', 'yoga', 'exercise'], weight: 1.2, dimensions: '72" x 24" x 0.2"', warranty: 'None' },
  { id: 7, name: 'Blender', category: 'Home', price: 75, inStock: true, rating: 4.4, brand: 'KitchenPro', tags: ['kitchen', 'appliance', 'blending'], weight: 3.8, dimensions: '8" x 6" x 12"', warranty: '1 year' },
  { id: 8, name: 'Gaming Console', category: 'Electronics', price: 499, inStock: true, rating: 4.6, brand: 'GameTech', tags: ['gaming', 'console', 'entertainment'], weight: 4.5, dimensions: '15" x 4" x 10"', warranty: '1 year' },
  { id: 9, name: 'Desk Chair', category: 'Furniture', price: 299, inStock: true, rating: 4.3, brand: 'OfficeComfort', tags: ['furniture', 'office', 'ergonomic'], weight: 25.0, dimensions: '28" x 26" x 48"', warranty: '3 years' },
  { id: 10, name: 'Plant Pot', category: 'Garden', price: 35, inStock: true, rating: 4.0, brand: 'GreenThumb', tags: ['garden', 'plants', 'decor'], weight: 2.1, dimensions: '10" x 10" x 8"', warranty: 'None' },
];

const analyticsData = [
  { id: 1, page: '/home', views: 15420, bounceRate: 0.23, avgTime: 145, device: 'Desktop', country: 'US', date: '2024-01-15', conversions: 234, revenue: 12500 },
  { id: 2, page: '/products', views: 8920, bounceRate: 0.31, avgTime: 89, device: 'Mobile', country: 'CA', date: '2024-01-15', conversions: 156, revenue: 8900 },
  { id: 3, page: '/about', views: 3240, bounceRate: 0.18, avgTime: 203, device: 'Desktop', country: 'UK', date: '2024-01-15', conversions: 45, revenue: 2100 },
  { id: 4, page: '/contact', views: 1870, bounceRate: 0.45, avgTime: 67, device: 'Tablet', country: 'US', date: '2024-01-15', conversions: 23, revenue: 1200 },
  { id: 5, page: '/blog', views: 5670, bounceRate: 0.28, avgTime: 178, device: 'Desktop', country: 'DE', date: '2024-01-15', conversions: 89, revenue: 4500 },
  { id: 6, page: '/pricing', views: 4320, bounceRate: 0.35, avgTime: 156, device: 'Mobile', country: 'FR', date: '2024-01-15', conversions: 67, revenue: 3800 },
  { id: 7, page: '/features', views: 2980, bounceRate: 0.22, avgTime: 234, device: 'Desktop', country: 'AU', date: '2024-01-15', conversions: 34, revenue: 1900 },
  { id: 8, page: '/support', views: 2150, bounceRate: 0.41, avgTime: 98, device: 'Mobile', country: 'JP', date: '2024-01-15', conversions: 12, revenue: 800 },
  { id: 9, page: '/login', views: 8760, bounceRate: 0.15, avgTime: 45, device: 'Desktop', country: 'US', date: '2024-01-15', conversions: 1234, revenue: 0 },
  { id: 10, page: '/dashboard', views: 5430, bounceRate: 0.12, avgTime: 567, device: 'Desktop', country: 'US', date: '2024-01-15', conversions: 890, revenue: 0 },
];

const inferenceData = [
  { id: 1, color: 'Red', shape: 'Circle', size: 'Large', material: 'Plastic', weight: 150, price: 25.99, inStock: true, category: 'Toys' },
  { id: 2, color: 'Blue', shape: 'Square', size: 'Medium', material: 'Metal', weight: 200, price: 45.50, inStock: true, category: 'Hardware' },
  { id: 3, color: 'Green', shape: 'Triangle', size: 'Small', material: 'Wood', weight: 75, price: 12.99, inStock: false, category: 'Crafts' },
  { id: 4, color: 'Red', shape: 'Circle', size: 'Small', material: 'Plastic', weight: 50, price: 8.99, inStock: true, category: 'Toys' },
  { id: 5, color: 'Blue', shape: 'Square', size: 'Large', material: 'Metal', weight: 300, price: 89.99, inStock: true, category: 'Hardware' },
  { id: 6, color: 'Yellow', shape: 'Triangle', size: 'Medium', material: 'Plastic', weight: 100, price: 15.50, inStock: true, category: 'Toys' },
  { id: 7, color: 'Red', shape: 'Circle', size: 'Medium', material: 'Wood', weight: 120, price: 22.99, inStock: true, category: 'Crafts' },
  { id: 8, color: 'Green', shape: 'Square', size: 'Large', material: 'Metal', weight: 250, price: 65.99, inStock: false, category: 'Hardware' },
  { id: 9, color: 'Blue', shape: 'Triangle', size: 'Small', material: 'Plastic', weight: 80, price: 9.99, inStock: true, category: 'Toys' },
  { id: 10, color: 'Yellow', shape: 'Circle', size: 'Large', material: 'Wood', weight: 180, price: 32.99, inStock: true, category: 'Crafts' },
];

// Field definitions
const employeeFields = [
  { key: 'name', label: 'Name', type: 'string', placeholder: 'Enter employee name...' },
  { key: 'department', label: 'Department', type: 'enum', values: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'] },
  { key: 'status', label: 'Status', type: 'enum', values: ['Active', 'Inactive'] },
  { key: 'experience', label: 'Experience', type: 'number', placeholder: 'Enter years...' },
  { key: 'salary', label: 'Salary', type: 'number', placeholder: 'Enter salary...' },
  { key: 'location', label: 'Location', type: 'string', placeholder: 'Enter location...' },
  { key: 'remote', label: 'Remote', type: 'boolean' },
  { key: 'manager', label: 'Manager', type: 'string', placeholder: 'Enter manager name...' }
];

const productFields = [
  { key: 'name', label: 'Product Name', type: 'string', placeholder: 'Search products...' },
  { key: 'category', label: 'Category', type: 'enum', values: ['Electronics', 'Home', 'Sports', 'Furniture', 'Garden'] },
  { key: 'brand', label: 'Brand', type: 'string', placeholder: 'Enter brand...' },
  { key: 'price', label: 'Price', type: 'number', placeholder: 'Enter price...' },
  { key: 'rating', label: 'Rating', type: 'number', placeholder: 'Enter rating...' },
  { key: 'inStock', label: 'In Stock', type: 'boolean' },
  { key: 'weight', label: 'Weight', type: 'number', placeholder: 'Enter weight...' }
];

const analyticsFields = [
  { key: 'page', label: 'Page', type: 'string', placeholder: 'Enter page path...' },
  { key: 'device', label: 'Device', type: 'enum', values: ['Desktop', 'Mobile', 'Tablet'] },
  { key: 'country', label: 'Country', type: 'enum', values: ['US', 'CA', 'UK', 'DE', 'FR', 'AU', 'JP'] },
  { key: 'views', label: 'Views', type: 'number', placeholder: 'Enter view count...' },
  { key: 'bounceRate', label: 'Bounce Rate', type: 'number', placeholder: 'Enter rate...' },
  { key: 'avgTime', label: 'Avg Time', type: 'number', placeholder: 'Enter time...' },
  { key: 'conversions', label: 'Conversions', type: 'number', placeholder: 'Enter conversions...' },
  { key: 'revenue', label: 'Revenue', type: 'number', placeholder: 'Enter revenue...' }
];

// Reactive state
const employeeResults = ref([...employeeData]);
const productResults = ref([...productData]);
const analyticsResults = ref([...analyticsData]);
const inferenceResults = ref([...inferenceData]);

// Computed properties for statistics
const employeeStats = computed(() => {
  if (employeeResults.value.length === 0) return { avgSalary: 0, remoteCount: 0, activeCount: 0 };
  const avgSalary = Math.round(employeeResults.value.reduce((sum, emp) => sum + emp.salary, 0) / employeeResults.value.length);
  const remoteCount = employeeResults.value.filter(emp => emp.remote).length;
  const activeCount = employeeResults.value.filter(emp => emp.status === 'Active').length;
  return { avgSalary, remoteCount, activeCount };
});

const productStats = computed(() => {
  if (productResults.value.length === 0) return { avgPrice: 0, inStockCount: 0, avgRating: 0 };
  const avgPrice = Math.round(productResults.value.reduce((sum, product) => sum + product.price, 0) / productResults.value.length);
  const inStockCount = productResults.value.filter(product => product.inStock).length;
  const avgRating = (productResults.value.reduce((sum, product) => sum + product.rating, 0) / productResults.value.length).toFixed(1);
  return { avgPrice, inStockCount, avgRating };
});

const analyticsStats = computed(() => {
  if (analyticsResults.value.length === 0) return { totalViews: 0, totalRevenue: 0, avgBounceRate: 0 };
  const totalViews = analyticsResults.value.reduce((sum, page) => sum + page.views, 0);
  const totalRevenue = analyticsResults.value.reduce((sum, page) => sum + page.revenue, 0);
  const avgBounceRate = (analyticsResults.value.reduce((sum, page) => sum + page.bounceRate, 0) / analyticsResults.value.length * 100).toFixed(1);
  return { totalViews, totalRevenue, avgBounceRate };
});

const inferenceStats = computed(() => {
  if (inferenceResults.value.length === 0) return { avgPrice: 0, inStockCount: 0, categoryCount: 0 };
  const avgPrice = (inferenceResults.value.reduce((sum, item) => sum + item.price, 0) / inferenceResults.value.length).toFixed(2);
  const inStockCount = inferenceResults.value.filter(item => item.inStock).length;
  const categoryCount = new Set(inferenceResults.value.map(item => item.category)).size;
  return { avgPrice, inStockCount, categoryCount };
});

// Event handlers
const handleEmployeeChange = (filtered: any[], state: any) => {
  employeeResults.value = filtered;
  console.log('Employee queries:', state);
};

const handleProductChange = (filtered: any[], state: any) => {
  productResults.value = filtered;
  console.log('Product queries:', state);
};

const handleAnalyticsChange = (filtered: any[], state: any) => {
  analyticsResults.value = filtered;
  console.log('Analytics queries:', state);
};

const handleInferenceChange = (filtered: any[], state: any) => {
  inferenceResults.value = filtered;
  console.log('Inference queries:', state);
};
</script>

<template>
  <div class="container">
    <div class="header">
      <h1 class="title">QueryChips Vue Examples</h1>
      <p class="subtitle">
        Explore different use cases and configurations of QueryChips in Vue applications. 
        Each example demonstrates various features like field inference, query generation, and advanced filtering.
      </p>
    </div>
    
    <!-- Employee Directory Example -->
    <div class="example-card">
      <h2 class="example-title">
        <span class="icon">👥</span>
        Employee Directory
      </h2>
      <p class="description">
        Comprehensive employee data with manual field configuration. Features include department filtering, 
        remote work status, salary ranges, and skill-based filtering. Demonstrates enum fields, boolean values, 
        and numeric comparisons.
      </p>
      <div class="filter-container">
        <QueryChipsVue
          :data="employeeData"
          :fields="employeeFields"
          :autoApply="true"
          :queryLanguages="['elasticsearch', 'sql']"
          @change="handleEmployeeChange"
        />
      </div>
      <div class="results-section">
        <h3 class="results-title">
          📊 Results ({{ employeeResults.length }} employees)
        </h3>
        <table class="table">
          <thead>
            <tr class="table-header">
              <th class="table-header-cell">Name</th>
              <th class="table-header-cell">Department</th>
              <th class="table-header-cell">Status</th>
              <th class="table-header-cell">Experience</th>
              <th class="table-header-cell">Salary</th>
              <th class="table-header-cell">Location</th>
              <th class="table-header-cell">Remote</th>
              <th class="table-header-cell">Manager</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employeeResults" :key="employee.id">
              <td class="table-cell">{{ employee.name }}</td>
              <td class="table-cell">{{ employee.department }}</td>
              <td class="table-cell">
                <span :class="['badge', employee.status === 'Active' ? 'badge-active' : 'badge-inactive']">
                  {{ employee.status }}
                </span>
              </td>
              <td class="table-cell">{{ employee.experience }} years</td>
              <td class="table-cell">${{ employee.salary.toLocaleString() }}</td>
              <td class="table-cell">{{ employee.location }}</td>
              <td class="table-cell">
                <span :class="['badge', employee.remote ? 'badge-remote' : 'badge-office']">
                  {{ employee.remote ? 'Remote' : 'Office' }}
                </span>
              </td>
              <td class="table-cell">{{ employee.manager }}</td>
            </tr>
            <tr v-if="employeeResults.length === 0">
              <td colspan="8" class="table-cell no-results">No results found.</td>
            </tr>
          </tbody>
        </table>
        <div class="stats">
          Average salary: ${{ employeeStats.avgSalary.toLocaleString() }} | 
          Remote workers: {{ employeeStats.remoteCount }} | 
          Active employees: {{ employeeStats.activeCount }}
        </div>
      </div>
    </div>

    <!-- Product Catalog Example -->
    <div class="example-card">
      <h2 class="example-title">
        <span class="icon">🛍️</span>
        Product Catalog
      </h2>
      <p class="description">
        E-commerce product data with comprehensive filtering options. Includes price ranges, 
        stock status, ratings, and category filtering. Shows how to handle different data types 
        and complex filtering scenarios.
      </p>
      <div class="filter-container">
        <QueryChipsVue
          :data="productData"
          :fields="productFields"
          :queryLanguages="['mongodb', 'sql']"
          @change="handleProductChange"
        />
      </div>
      <div class="results-section">
        <h3 class="results-title">
          📦 Results ({{ productResults.length }} products)
        </h3>
        <table class="table">
          <thead>
            <tr class="table-header">
              <th class="table-header-cell">Product</th>
              <th class="table-header-cell">Category</th>
              <th class="table-header-cell">Brand</th>
              <th class="table-header-cell">Price</th>
              <th class="table-header-cell">Rating</th>
              <th class="table-header-cell">Stock</th>
              <th class="table-header-cell">Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productResults" :key="product.id">
              <td class="table-cell">{{ product.name }}</td>
              <td class="table-cell">{{ product.category }}</td>
              <td class="table-cell">{{ product.brand }}</td>
              <td class="table-cell">${{ product.price }}</td>
              <td class="table-cell">
                <span :class="['badge', 
                  product.rating >= 4.5 ? 'badge-high' : 
                  product.rating >= 4.0 ? 'badge-medium' : 'badge-low']">
                  {{ product.rating }} ⭐
                </span>
              </td>
              <td class="table-cell">
                <span :class="['badge', product.inStock ? 'badge-active' : 'badge-inactive']">
                  {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                </span>
              </td>
              <td class="table-cell">{{ product.weight }} lbs</td>
            </tr>
            <tr v-if="productResults.length === 0">
              <td colspan="7" class="table-cell no-results">No results found.</td>
            </tr>
          </tbody>
        </table>
        <div class="stats">
          Average price: ${{ productStats.avgPrice }} | 
          In stock: {{ productStats.inStockCount }} | 
          Average rating: {{ productStats.avgRating }} ⭐
        </div>
      </div>
    </div>

    <!-- Analytics Dashboard Example -->
    <div class="example-card">
      <h2 class="example-title">
        <span class="icon">📈</span>
        Analytics Dashboard
      </h2>
      <p class="description">
        Web analytics data with performance metrics. Demonstrates filtering by page performance, 
        device types, geographic location, and conversion metrics. Shows how to handle complex 
        numeric data and date-based filtering.
      </p>
      <div class="filter-container">
        <QueryChipsVue
          :data="analyticsData"
          :fields="analyticsFields"
          :queryLanguages="['elasticsearch', 'graphql']"
          @change="handleAnalyticsChange"
        />
      </div>
      <div class="results-section">
        <h3 class="results-title">
          📊 Results ({{ analyticsResults.length }} pages)
        </h3>
        <table class="table">
          <thead>
            <tr class="table-header">
              <th class="table-header-cell">Page</th>
              <th class="table-header-cell">Device</th>
              <th class="table-header-cell">Country</th>
              <th class="table-header-cell">Views</th>
              <th class="table-header-cell">Bounce Rate</th>
              <th class="table-header-cell">Avg Time</th>
              <th class="table-header-cell">Conversions</th>
              <th class="table-header-cell">Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in analyticsResults" :key="page.id">
              <td class="table-cell">{{ page.page }}</td>
              <td class="table-cell">{{ page.device }}</td>
              <td class="table-cell">{{ page.country }}</td>
              <td class="table-cell">{{ page.views.toLocaleString() }}</td>
              <td class="table-cell">
                <span :class="['badge', 
                  page.bounceRate <= 0.25 ? 'badge-high' : 
                  page.bounceRate <= 0.35 ? 'badge-medium' : 'badge-low']">
                  {{ (page.bounceRate * 100).toFixed(1) }}%
                </span>
              </td>
              <td class="table-cell">{{ page.avgTime }}s</td>
              <td class="table-cell">{{ page.conversions }}</td>
              <td class="table-cell">${{ page.revenue.toLocaleString() }}</td>
            </tr>
            <tr v-if="analyticsResults.length === 0">
              <td colspan="8" class="table-cell no-results">No results found.</td>
            </tr>
          </tbody>
        </table>
        <div class="stats">
          Total views: {{ analyticsStats.totalViews.toLocaleString() }} | 
          Total revenue: ${{ analyticsStats.totalRevenue.toLocaleString() }} | 
          Avg bounce rate: {{ analyticsStats.avgBounceRate }}%
        </div>
      </div>
    </div>

    <!-- Field Inference Example -->
    <div class="example-card">
      <h2 class="example-title">
        <span class="icon">🔍</span>
        Field Inference Example
      </h2>
      <p class="description">
        Demonstrates automatic field detection from data. QueryChips automatically infers field types 
        and creates enums for fields with limited unique values. Shows how to use the library 
        without manual field configuration.
      </p>
      <div class="filter-container">
        <QueryChipsVue
          :data="inferenceData"
          :inferFields="true"
          :enumThreshold="5"
          :queryLanguages="['elasticsearch', 'sql', 'mongodb']"
          @change="handleInferenceChange"
        />
      </div>
      <div class="results-section">
        <h3 class="results-title">
          🎯 Results ({{ inferenceResults.length }} items)
        </h3>
        <table class="table">
          <thead>
            <tr class="table-header">
              <th class="table-header-cell">Color</th>
              <th class="table-header-cell">Shape</th>
              <th class="table-header-cell">Size</th>
              <th class="table-header-cell">Material</th>
              <th class="table-header-cell">Weight</th>
              <th class="table-header-cell">Price</th>
              <th class="table-header-cell">Category</th>
              <th class="table-header-cell">Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in inferenceResults" :key="item.id">
              <td class="table-cell">{{ item.color }}</td>
              <td class="table-cell">{{ item.shape }}</td>
              <td class="table-cell">{{ item.size }}</td>
              <td class="table-cell">{{ item.material }}</td>
              <td class="table-cell">{{ item.weight }}g</td>
              <td class="table-cell">${{ item.price }}</td>
              <td class="table-cell">{{ item.category }}</td>
              <td class="table-cell">
                <span :class="['badge', item.inStock ? 'badge-active' : 'badge-inactive']">
                  {{ item.inStock ? 'In Stock' : 'Out of Stock' }}
                </span>
              </td>
            </tr>
            <tr v-if="inferenceResults.length === 0">
              <td colspan="8" class="table-cell no-results">No results found.</td>
            </tr>
          </tbody>
        </table>
        <div class="stats">
          Average price: ${{ inferenceStats.avgPrice }} | 
          In stock: {{ inferenceStats.inStockCount }} | 
          Categories: {{ inferenceStats.categoryCount }}
        </div>
      </div>
    </div>

    <!-- Default Query Example -->
    <div class="example-card">
      <h2 class="example-title">
        <span class="icon">🚀</span>
        Default Query Example
      </h2>
      <p class="description">
        Demonstrates how to pre-populate QueryChips with default filters using the defaultQuery option. 
        Shows both simple format (field: value) and advanced format with complex conditions.
      </p>
      
      <!-- Simple Default Query -->
      <div class="filter-container" style="margin-bottom: 20px;">
        <h4 style="margin-bottom: 15px; color: #2c3e50; font-size: 1.1rem;">Simple Default Query</h4>
        <p style="margin-bottom: 15px; font-size: 0.9rem; color: #6c757d;">
          Pre-filters: department = "Engineering" AND remote = true
        </p>
        <QueryChipsVue
          :data="employeeData"
          :fields="employeeFields"
          :defaultQuery="[
            { id: '1', field: 'department', operator: '=', value: 'Engineering' },
            { id: '2', field: 'remote', operator: '=', value: true }
          ]"
          :autoApply="true"
          :queryLanguages="['elasticsearch', 'sql']"
          @change="(filtered: any[]) => console.log('Simple default query results:', filtered.length)"
        />
      </div>

      <!-- Advanced Default Query -->
      <div class="filter-container">
        <h4 style="margin-bottom: 15px; color: #2c3e50; font-size: 1.1rem;">Advanced Default Query</h4>
        <p style="margin-bottom: 15px; font-size: 0.9rem; color: #6c757d;">
          Pre-filters: (department = "Engineering" OR department = "Design") AND salary &gt; 80000 AND status = "Active"
        </p>
        <QueryChipsVue
          :data="employeeData"
          :fields="employeeFields"
          :defaultQuery="{
            conditions: [
              {
                id: 'group1',
                type: 'group',
                operator: 'OR',
                conditions: [
                                     { id: '1', field: 'department', operator: '=', value: 'Engineering' },
                   { id: '2', field: 'department', operator: '=', value: 'Design' }
                ]
              },
                             { id: '3', field: 'salary', operator: '>', value: 80000 },
               { id: '4', field: 'status', operator: '=', value: 'Active' }
            ],
                          logicalOperators: ['AND', 'AND']
            }"
            :autoApply="true"
            :queryLanguages="['elasticsearch', 'sql']"
            @change="(filtered: any[]) => console.log('Advanced default query results:', filtered.length)"
        />
      </div>
    </div>

    <!-- Features Overview -->
    <div class="example-card">
      <h2 class="example-title">
        <span class="icon">✨</span>
        Key Features Demonstrated
      </h2>
      <div class="feature-list">
        <div class="feature-item">🎯 Smart field detection and type inference</div>
        <div class="feature-item">🔍 Multiple query language generation (ES, SQL, MongoDB, GraphQL)</div>
        <div class="feature-item">⌨️ Full keyboard navigation and accessibility</div>
        <div class="feature-item">🏷️ Visual filter tags with remove functionality</div>
        <div class="feature-item">📱 Responsive design with touch support</div>
        <div class="feature-item">🎨 Customizable themes and styling</div>
        <div class="feature-item">🌍 Internationalization support</div>
        <div class="feature-item">⚡ High performance with large datasets</div>
        <div class="feature-item">🔧 Framework agnostic (React, Vue, Angular, Vanilla)</div>
        <div class="feature-item">📊 Real-time filtering and data updates</div>
        <div class="feature-item">🚀 Default query support for pre-populated filters</div>
        <div class="feature-item">🔢 Boolean field dropdowns with true/false options</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  border: 1px solid #e9ecef;
}

.title {
  font-size: 2.8rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 20px;
  line-height: 1.6;
}

.example-card {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 35px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.example-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.example-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  width: 32px;
  height: 32px;
  background-color: #667eea;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.description {
  color: #6c757d;
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 0.95rem;
}

.filter-container {
  margin-bottom: 25px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  background-color: #f8f9fa;
  transition: border-color 0.2s ease;
}

.filter-container:hover {
  border-color: #667eea;
}

.results-section {
  margin-top: 25px;
}

.results-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
}

.table-header {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.table-cell {
  padding: 12px 10px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  font-size: 0.85rem;
}

.table-header-cell {
  padding: 15px 10px;
  border-bottom: 2px solid #dee2e6;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-active {
  background-color: #d1ecf1;
  color: #0c5460;
}

.badge-inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.badge-remote {
  background-color: #d4edda;
  color: #155724;
}

.badge-office {
  background-color: #fff3cd;
  color: #856404;
}

.badge-high {
  background-color: #d1ecf1;
  color: #0c5460;
}

.badge-medium {
  background-color: #fff3cd;
  color: #856404;
}

.badge-low {
  background-color: #f8d7da;
  color: #721c24;
}

.stats {
  margin-top: 12px;
  font-size: 0.8rem;
  color: #6c757d;
  text-align: center;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.no-results {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.feature-item {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #495057;
}
</style>