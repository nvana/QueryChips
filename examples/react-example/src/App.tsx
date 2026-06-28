import React, { useState } from 'react';
import { QueryChipsReact } from '../../../wrappers/QueryChipsReact';

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

// Enhanced styles with better design
const styles = {
  container: {
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
    border: '1px solid #e9ecef'
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#6c757d',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  exampleCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '35px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  exampleTitle: {
    fontSize: '1.6rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  icon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#667eea',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  filterContainer: {
    marginBottom: '25px',
    border: '2px solid #e9ecef',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    transition: 'border-color 0.2s ease'
  },
  resultsSection: {
    marginTop: '25px'
  },
  resultsTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '0.9rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#495057'
  },
  tableCell: {
    padding: '12px 10px',
    borderBottom: '1px solid #e9ecef',
    color: '#495057',
    fontSize: '0.85rem'
  },
  tableHeaderCell: {
    padding: '15px 10px',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left' as const,
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  badgeActive: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460'
  },
  badgeInactive: {
    backgroundColor: '#f8d7da',
    color: '#721c24'
  },
  badgeRemote: {
    backgroundColor: '#d4edda',
    color: '#155724'
  },
  badgeOffice: {
    backgroundColor: '#fff3cd',
    color: '#856404'
  },
  badgeHigh: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460'
  },
  badgeMedium: {
    backgroundColor: '#fff3cd',
    color: '#856404'
  },
  badgeLow: {
    backgroundColor: '#f8d7da',
    color: '#721c24'
  },
  stats: {
    marginTop: '12px',
    fontSize: '0.8rem',
    color: '#6c757d',
    textAlign: 'center' as const,
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px'
  },
  description: {
    color: '#6c757d',
    marginBottom: '20px',
    lineHeight: '1.6',
    fontSize: '0.95rem'
  },
  featureList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  featureItem: {
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: '#495057'
  }
};

function App() {
  const [employeeResults, setEmployeeResults] = useState(employeeData);
  const [productResults, setProductResults] = useState(productData);
  const [analyticsResults, setAnalyticsResults] = useState(analyticsData);
  const [inferenceResults, setInferenceResults] = useState(inferenceData);

  // Handler functions to fix type issues
  const handleEmployeeChange = (filteredData: any[], state: any) => {
    setEmployeeResults(filteredData as typeof employeeData);
  };

  const handleProductChange = (filteredData: any[], state: any) => {
    setProductResults(filteredData as typeof productData);
  };

  const handleAnalyticsChange = (filteredData: any[], state: any) => {
    setAnalyticsResults(filteredData as typeof analyticsData);
  };

  const handleInferenceChange = (filteredData: any[], state: any) => {
    setInferenceResults(filteredData as typeof inferenceData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>QueryChips React Examples</h1>
        <p style={styles.subtitle}>
          Explore different use cases and configurations of QueryChips in React applications. 
          Each example demonstrates various features like field inference, query generation, and advanced filtering.
        </p>
      </div>
      
      {/* Employee Directory Example */}
      <div style={styles.exampleCard}>
        <h2 style={styles.exampleTitle}>
          <span style={styles.icon}>👥</span>
          Employee Directory
        </h2>
        <p style={styles.description}>
          Comprehensive employee data with manual field configuration. Features include department filtering, 
          remote work status, salary ranges, and skill-based filtering. Demonstrates enum fields, boolean values, 
          and numeric comparisons.
        </p>
        <div style={styles.filterContainer}>
          <QueryChipsReact
            data={employeeData}
            fields={[
              { key: 'name', label: 'Name', type: 'string', placeholder: 'Enter employee name...' },
              { key: 'department', label: 'Department', type: 'enum', values: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'] },
              { key: 'status', label: 'Status', type: 'enum', values: ['Active', 'Inactive'] },
              { key: 'experience', label: 'Experience', type: 'number', placeholder: 'Enter years...' },
              { key: 'salary', label: 'Salary', type: 'number', placeholder: 'Enter salary...' },
              { key: 'location', label: 'Location', type: 'string', placeholder: 'Enter location...' },
              { key: 'remote', label: 'Remote', type: 'boolean' },
              { key: 'manager', label: 'Manager', type: 'string', placeholder: 'Enter manager name...' }
            ]}
            onChange={handleEmployeeChange}
            queryLanguages={['elasticsearch', 'sql']}
            onQueryChange={(queries, state) => {
              console.log('Employee queries:', queries);
            }}
          />
        </div>
        <div style={styles.resultsSection}>
          <h3 style={styles.resultsTitle}>
            📊 Results ({employeeResults.length} employees)
          </h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Name</th>
                <th style={styles.tableHeaderCell}>Department</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Experience</th>
                <th style={styles.tableHeaderCell}>Salary</th>
                <th style={styles.tableHeaderCell}>Location</th>
                <th style={styles.tableHeaderCell}>Remote</th>
                <th style={styles.tableHeaderCell}>Manager</th>
              </tr>
            </thead>
            <tbody>
              {employeeResults.map(employee => (
                <tr key={employee.id}>
                  <td style={styles.tableCell}>{employee.name}</td>
                  <td style={styles.tableCell}>{employee.department}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge,
                      ...(employee.status === 'Active' ? styles.badgeActive : styles.badgeInactive)
                    }}>
                      {employee.status}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{employee.experience} years</td>
                  <td style={styles.tableCell}>${employee.salary.toLocaleString()}</td>
                  <td style={styles.tableCell}>{employee.location}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge,
                      ...(employee.remote ? styles.badgeRemote : styles.badgeOffice)
                    }}>
                      {employee.remote ? 'Remote' : 'Office'}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{employee.manager}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.stats}>
            Average salary: ${Math.round(employeeResults.reduce((sum, e) => sum + e.salary, 0) / employeeResults.length).toLocaleString()} | 
            Remote workers: {employeeResults.filter(e => e.remote).length} | 
            Active employees: {employeeResults.filter(e => e.status === 'Active').length}
          </div>
        </div>
      </div>

      {/* Product Catalog Example */}
      <div style={styles.exampleCard}>
        <h2 style={styles.exampleTitle}>
          <span style={styles.icon}>🛍️</span>
          Product Catalog
        </h2>
        <p style={styles.description}>
          E-commerce product data with comprehensive filtering options. Includes price ranges, 
          stock status, ratings, and category filtering. Shows how to handle different data types 
          and complex filtering scenarios.
        </p>
        <div style={styles.filterContainer}>
          <QueryChipsReact
            data={productData}
            fields={[
              { key: 'name', label: 'Product Name', type: 'string', placeholder: 'Search products...' },
              { key: 'category', label: 'Category', type: 'enum', values: ['Electronics', 'Home', 'Sports', 'Furniture', 'Garden'] },
              { key: 'brand', label: 'Brand', type: 'string', placeholder: 'Enter brand...' },
              { key: 'price', label: 'Price', type: 'number', placeholder: 'Enter price...' },
              { key: 'rating', label: 'Rating', type: 'number', placeholder: 'Enter rating...' },
              { key: 'inStock', label: 'In Stock', type: 'boolean' },
              { key: 'weight', label: 'Weight', type: 'number', placeholder: 'Enter weight...' }
            ]}
            onChange={handleProductChange}
            queryLanguages={['mongodb', 'sql']}
            onQueryChange={(queries, state) => {
              console.log('Product queries:', queries);
            }}
          />
        </div>
        <div style={styles.resultsSection}>
          <h3 style={styles.resultsTitle}>
            📦 Results ({productResults.length} products)
          </h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Product</th>
                <th style={styles.tableHeaderCell}>Category</th>
                <th style={styles.tableHeaderCell}>Brand</th>
                <th style={styles.tableHeaderCell}>Price</th>
                <th style={styles.tableHeaderCell}>Rating</th>
                <th style={styles.tableHeaderCell}>Stock</th>
                <th style={styles.tableHeaderCell}>Weight</th>
              </tr>
            </thead>
            <tbody>
              {productResults.map(product => (
                <tr key={product.id}>
                  <td style={styles.tableCell}>{product.name}</td>
                  <td style={styles.tableCell}>{product.category}</td>
                  <td style={styles.tableCell}>{product.brand}</td>
                  <td style={styles.tableCell}>${product.price}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge,
                      ...(product.rating >= 4.5 ? styles.badgeHigh : 
                          product.rating >= 4.0 ? styles.badgeMedium : styles.badgeLow)
                    }}>
                      {product.rating} ⭐
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge,
                      ...(product.inStock ? styles.badgeActive : styles.badgeInactive)
                    }}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{product.weight} lbs</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.stats}>
            Average price: ${Math.round(productResults.reduce((sum, p) => sum + p.price, 0) / productResults.length)} | 
            In stock: {productResults.filter(p => p.inStock).length} | 
            Average rating: {(productResults.reduce((sum, p) => sum + p.rating, 0) / productResults.length).toFixed(1)} ⭐
          </div>
        </div>
      </div>

      {/* Analytics Dashboard Example */}
      <div style={styles.exampleCard}>
        <h2 style={styles.exampleTitle}>
          <span style={styles.icon}>📈</span>
          Analytics Dashboard
        </h2>
        <p style={styles.description}>
          Web analytics data with performance metrics. Demonstrates filtering by page performance, 
          device types, geographic location, and conversion metrics. Shows how to handle complex 
          numeric data and date-based filtering.
        </p>
        <div style={styles.filterContainer}>
          <QueryChipsReact
            data={analyticsData}
            fields={[
              { key: 'page', label: 'Page', type: 'string', placeholder: 'Enter page path...' },
              { key: 'device', label: 'Device', type: 'enum', values: ['Desktop', 'Mobile', 'Tablet'] },
              { key: 'country', label: 'Country', type: 'enum', values: ['US', 'CA', 'UK', 'DE', 'FR', 'AU', 'JP'] },
              { key: 'views', label: 'Views', type: 'number', placeholder: 'Enter view count...' },
              { key: 'bounceRate', label: 'Bounce Rate', type: 'number', placeholder: 'Enter rate...' },
              { key: 'avgTime', label: 'Avg Time', type: 'number', placeholder: 'Enter time...' },
              { key: 'conversions', label: 'Conversions', type: 'number', placeholder: 'Enter conversions...' },
              { key: 'revenue', label: 'Revenue', type: 'number', placeholder: 'Enter revenue...' }
            ]}
            onChange={handleAnalyticsChange}
            queryLanguages={['elasticsearch', 'graphql']}
            onQueryChange={(queries, state) => {
              console.log('Analytics queries:', queries);
            }}
          />
        </div>
        <div style={styles.resultsSection}>
          <h3 style={styles.resultsTitle}>
            📊 Results ({analyticsResults.length} pages)
          </h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Page</th>
                <th style={styles.tableHeaderCell}>Device</th>
                <th style={styles.tableHeaderCell}>Country</th>
                <th style={styles.tableHeaderCell}>Views</th>
                <th style={styles.tableHeaderCell}>Bounce Rate</th>
                <th style={styles.tableHeaderCell}>Avg Time</th>
                <th style={styles.tableHeaderCell}>Conversions</th>
                <th style={styles.tableHeaderCell}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analyticsResults.map(page => (
                <tr key={page.id}>
                  <td style={styles.tableCell}>{page.page}</td>
                  <td style={styles.tableCell}>{page.device}</td>
                  <td style={styles.tableCell}>{page.country}</td>
                  <td style={styles.tableCell}>{page.views.toLocaleString()}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge,
                      ...(page.bounceRate <= 0.25 ? styles.badgeHigh : 
                          page.bounceRate <= 0.35 ? styles.badgeMedium : styles.badgeLow)
                    }}>
                      {(page.bounceRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td style={styles.tableCell}>{page.avgTime}s</td>
                  <td style={styles.tableCell}>{page.conversions}</td>
                  <td style={styles.tableCell}>${page.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.stats}>
            Total views: {analyticsResults.reduce((sum, p) => sum + p.views, 0).toLocaleString()} | 
            Total revenue: ${analyticsResults.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()} | 
            Avg bounce rate: {(analyticsResults.reduce((sum, p) => sum + p.bounceRate, 0) / analyticsResults.length * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Field Inference Example */}
      <div style={styles.exampleCard}>
        <h2 style={styles.exampleTitle}>
          <span style={styles.icon}>🔍</span>
          Field Inference Example
        </h2>
        <p style={styles.description}>
          Demonstrates automatic field detection from data. QueryChips automatically infers field types 
          and creates enums for fields with limited unique values. Shows how to use the library 
          without manual field configuration.
        </p>
        <div style={styles.filterContainer}>
          <QueryChipsReact
            data={inferenceData}
            inferFields={true}
            enumThreshold={5}
            onChange={handleInferenceChange}
            queryLanguages={['elasticsearch', 'sql', 'mongodb']}
            onQueryChange={(queries, state) => {
              console.log('Inference queries:', queries);
            }}
          />
        </div>
        <div style={styles.resultsSection}>
          <h3 style={styles.resultsTitle}>
            🎯 Results ({inferenceResults.length} items)
          </h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Color</th>
                <th style={styles.tableHeaderCell}>Shape</th>
                <th style={styles.tableHeaderCell}>Size</th>
                <th style={styles.tableHeaderCell}>Material</th>
                <th style={styles.tableHeaderCell}>Weight</th>
                <th style={styles.tableHeaderCell}>Price</th>
                <th style={styles.tableHeaderCell}>Category</th>
                <th style={styles.tableHeaderCell}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {inferenceResults.map(item => (
                <tr key={item.id}>
                  <td style={styles.tableCell}>{item.color}</td>
                  <td style={styles.tableCell}>{item.shape}</td>
                  <td style={styles.tableCell}>{item.size}</td>
                  <td style={styles.tableCell}>{item.material}</td>
                  <td style={styles.tableCell}>{item.weight}g</td>
                  <td style={styles.tableCell}>${item.price}</td>
                  <td style={styles.tableCell}>{item.category}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge,
                      ...(item.inStock ? styles.badgeActive : styles.badgeInactive)
                    }}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.stats}>
            Average price: ${(inferenceResults.reduce((sum, i) => sum + i.price, 0) / inferenceResults.length).toFixed(2)} | 
            In stock: {inferenceResults.filter(i => i.inStock).length} | 
            Categories: {new Set(inferenceResults.map(i => i.category)).size}
          </div>
        </div>
      </div>

      {/* Default Query Example */}
      <div style={styles.exampleCard}>
        <h2 style={styles.exampleTitle}>
          <span style={styles.icon}>🚀</span>
          Default Query Example
        </h2>
        <p style={styles.description}>
          Demonstrates how to pre-populate QueryChips with default filters using the defaultQuery option. 
          Shows both simple format (field: value) and advanced format with complex conditions.
        </p>
        
        {/* Simple Default Query */}
        <div style={{...styles.filterContainer, marginBottom: '20px'}}>
          <h4 style={{marginBottom: '15px', color: '#2c3e50', fontSize: '1.1rem'}}>Simple Default Query</h4>
          <p style={{marginBottom: '15px', fontSize: '0.9rem', color: '#6c757d'}}>
            Pre-filters: department = "Engineering" AND remote = true
          </p>
          <QueryChipsReact
            data={employeeData}
            fields={[
              { key: 'name', label: 'Name', type: 'string', placeholder: 'Enter employee name...' },
              { key: 'department', label: 'Department', type: 'enum', values: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'] },
              { key: 'status', label: 'Status', type: 'enum', values: ['Active', 'Inactive'] },
              { key: 'experience', label: 'Experience', type: 'number', placeholder: 'Enter years...' },
              { key: 'salary', label: 'Salary', type: 'number', placeholder: 'Enter salary...' },
              { key: 'location', label: 'Location', type: 'string', placeholder: 'Enter location...' },
              { key: 'remote', label: 'Remote', type: 'boolean' },
              { key: 'manager', label: 'Manager', type: 'string', placeholder: 'Enter manager name...' }
            ]}
            defaultQuery={[
              { id: '1', field: 'department', operator: '=', value: 'Engineering' },
              { id: '2', field: 'remote', operator: '=', value: true }
            ]}
            autoApply={true}
            onChange={(filtered) => {
              console.log('Simple default query results:', filtered.length);
            }}
            queryLanguages={['elasticsearch', 'sql']}
          />
        </div>

        {/* Advanced Default Query */}
        <div style={styles.filterContainer}>
          <h4 style={{marginBottom: '15px', color: '#2c3e50', fontSize: '1.1rem'}}>Advanced Default Query</h4>
          <p style={{marginBottom: '15px', fontSize: '0.9rem', color: '#6c757d'}}>
            Pre-filters: (department = "Engineering" OR department = "Design") AND salary &gt; 80000 AND status = "Active"
          </p>
          <QueryChipsReact
            data={employeeData}
            fields={[
              { key: 'name', label: 'Name', type: 'string', placeholder: 'Enter employee name...' },
              { key: 'department', label: 'Department', type: 'enum', values: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'] },
              { key: 'status', label: 'Status', type: 'enum', values: ['Active', 'Inactive'] },
              { key: 'experience', label: 'Experience', type: 'number', placeholder: 'Enter years...' },
              { key: 'salary', label: 'Salary', type: 'number', placeholder: 'Enter salary...' },
              { key: 'location', label: 'Location', type: 'string', placeholder: 'Enter location...' },
              { key: 'remote', label: 'Remote', type: 'boolean' },
              { key: 'manager', label: 'Manager', type: 'string', placeholder: 'Enter manager name...' }
            ]}
                        defaultQuery={{
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
            }}
            autoApply={true}
            onChange={(filtered) => {
              console.log('Advanced default query results:', filtered.length);
            }}
            queryLanguages={['elasticsearch', 'sql']}
          />
        </div>
      </div>

      {/* Features Overview */}
      <div style={styles.exampleCard}>
        <h2 style={styles.exampleTitle}>
          <span style={styles.icon}>✨</span>
          Key Features Demonstrated
        </h2>
        <div style={styles.featureList}>
          <div style={styles.featureItem}>🎯 Smart field detection and type inference</div>
          <div style={styles.featureItem}>🔍 Multiple query language generation (ES, SQL, MongoDB, GraphQL)</div>
          <div style={styles.featureItem}>⌨️ Full keyboard navigation and accessibility</div>
          <div style={styles.featureItem}>🏷️ Visual filter tags with remove functionality</div>
          <div style={styles.featureItem}>📱 Responsive design with touch support</div>
          <div style={styles.featureItem}>🎨 Customizable themes and styling</div>
          <div style={styles.featureItem}>🌍 Internationalization support</div>
          <div style={styles.featureItem}>⚡ High performance with large datasets</div>
          <div style={styles.featureItem}>🔧 Framework agnostic (React, Vue, Angular, Vanilla)</div>
          <div style={styles.featureItem}>📊 Real-time filtering and data updates</div>
          <div style={styles.featureItem}>🚀 Default query support for pre-populated filters</div>
          <div style={styles.featureItem}>🔢 Boolean field dropdowns with true/false options</div>
        </div>
      </div>
    </div>
  );
}

export default App; 