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
  { id: 11, color: 'Purple', shape: 'Hexagon', size: 'Medium', material: 'Glass', weight: 110, price: 19.99, inStock: false, category: 'Decor' },
  { id: 12, color: 'Orange', shape: 'Circle', size: 'Small', material: 'Plastic', weight: 60, price: 7.49, inStock: true, category: 'Toys' },
  { id: 13, color: 'Black', shape: 'Square', size: 'Large', material: 'Metal', weight: 320, price: 99.99, inStock: true, category: 'Hardware' },
  { id: 14, color: 'White', shape: 'Triangle', size: 'Medium', material: 'Wood', weight: 130, price: 17.99, inStock: false, category: 'Crafts' },
  { id: 15, color: 'Pink', shape: 'Circle', size: 'Large', material: 'Glass', weight: 170, price: 29.99, inStock: true, category: 'Decor' },
  { id: 16, color: 'Gray', shape: 'Square', size: 'Small', material: 'Metal', weight: 90, price: 12.99, inStock: true, category: 'Hardware' },
  { id: 17, color: 'Brown', shape: 'Hexagon', size: 'Large', material: 'Wood', weight: 210, price: 39.99, inStock: false, category: 'Crafts' },
  { id: 18, color: 'Red', shape: 'Triangle', size: 'Medium', material: 'Plastic', weight: 105, price: 14.99, inStock: true, category: 'Toys' },
  { id: 19, color: 'Blue', shape: 'Circle', size: 'Small', material: 'Glass', weight: 70, price: 11.99, inStock: true, category: 'Decor' },
  { id: 20, color: 'Green', shape: 'Square', size: 'Large', material: 'Metal', weight: 310, price: 79.99, inStock: false, category: 'Hardware' },
  { id: 21, color: 'Yellow', shape: 'Hexagon', size: 'Medium', material: 'Plastic', weight: 115, price: 16.50, inStock: true, category: 'Toys' },
  { id: 22, color: 'Purple', shape: 'Triangle', size: 'Small', material: 'Wood', weight: 85, price: 13.49, inStock: false, category: 'Crafts' },
  { id: 23, color: 'Orange', shape: 'Circle', size: 'Large', material: 'Glass', weight: 190, price: 34.99, inStock: true, category: 'Decor' },
  { id: 24, color: 'Black', shape: 'Square', size: 'Medium', material: 'Metal', weight: 220, price: 55.99, inStock: true, category: 'Hardware' },
  { id: 25, color: 'White', shape: 'Hexagon', size: 'Small', material: 'Plastic', weight: 65, price: 8.99, inStock: true, category: 'Toys' },
  { id: 26, color: 'Pink', shape: 'Triangle', size: 'Large', material: 'Wood', weight: 200, price: 27.99, inStock: false, category: 'Crafts' },
  { id: 27, color: 'Gray', shape: 'Circle', size: 'Medium', material: 'Glass', weight: 120, price: 18.99, inStock: true, category: 'Decor' },
  { id: 28, color: 'Brown', shape: 'Square', size: 'Small', material: 'Metal', weight: 95, price: 10.99, inStock: true, category: 'Hardware' },
  { id: 29, color: 'Red', shape: 'Hexagon', size: 'Large', material: 'Plastic', weight: 230, price: 42.99, inStock: false, category: 'Toys' },
  { id: 30, color: 'Blue', shape: 'Triangle', size: 'Medium', material: 'Wood', weight: 140, price: 20.99, inStock: true, category: 'Crafts' },
  { id: 31, color: 'Green', shape: 'Circle', size: 'Small', material: 'Glass', weight: 75, price: 9.99, inStock: true, category: 'Decor' },
  { id: 32, color: 'Yellow', shape: 'Square', size: 'Large', material: 'Metal', weight: 305, price: 85.99, inStock: false, category: 'Hardware' },
  { id: 33, color: 'Purple', shape: 'Hexagon', size: 'Medium', material: 'Plastic', weight: 112, price: 15.99, inStock: true, category: 'Toys' },
  { id: 34, color: 'Orange', shape: 'Triangle', size: 'Small', material: 'Wood', weight: 82, price: 12.49, inStock: false, category: 'Crafts' },
  { id: 35, color: 'Black', shape: 'Circle', size: 'Large', material: 'Glass', weight: 185, price: 31.99, inStock: true, category: 'Decor' },
  { id: 36, color: 'White', shape: 'Square', size: 'Medium', material: 'Metal', weight: 215, price: 52.99, inStock: true, category: 'Hardware' },
  { id: 37, color: 'Pink', shape: 'Hexagon', size: 'Small', material: 'Plastic', weight: 68, price: 7.99, inStock: true, category: 'Toys' },
  { id: 38, color: 'Gray', shape: 'Triangle', size: 'Large', material: 'Wood', weight: 205, price: 25.99, inStock: false, category: 'Crafts' },
  { id: 39, color: 'Brown', shape: 'Circle', size: 'Medium', material: 'Glass', weight: 125, price: 17.99, inStock: true, category: 'Decor' },
  { id: 40, color: 'Red', shape: 'Square', size: 'Small', material: 'Metal', weight: 92, price: 11.99, inStock: true, category: 'Hardware' }
];

// Utility functions
function createBadge(text, type) {
  const badge = document.createElement('span');
  badge.className = `badge badge-${type}`;
  badge.textContent = text;
  return badge;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

function formatPercentage(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// Table rendering functions
function renderEmployeeTable(data) {
  const tbody = document.getElementById('employee-tbody');
  const countElement = document.getElementById('employee-count');
  
  tbody.innerHTML = '';
  countElement.textContent = data.length;
  
  data.forEach(employee => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.department}</td>
      <td>${createBadge(employee.status, employee.status === 'Active' ? 'active' : 'inactive').outerHTML}</td>
      <td>${employee.experience} years</td>
      <td>${employee.location}</td>
      <td>${createBadge(employee.remote ? 'Remote' : 'Office', employee.remote ? 'remote' : 'office').outerHTML}</td>
      <td>${formatCurrency(employee.salary)}</td>
    `;
    tbody.appendChild(row);
  });
}



function renderInferenceTable(data) {
  const tbody = document.getElementById('inference-tbody');
  const countElement = document.getElementById('inference-count');
  
  tbody.innerHTML = '';
  countElement.textContent = data.length;
  
  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.color}</td>
      <td>${item.shape}</td>
      <td>${item.size}</td>
      <td>${item.material}</td>
      <td>${item.weight}g</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${createBadge(item.inStock ? 'Yes' : 'No', item.inStock ? 'active' : 'inactive').outerHTML}</td>
      <td>${item.category}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderSimpleDefaultTable(data) {
  const tbody = document.getElementById('simple-default-tbody');
  const countElement = document.getElementById('simple-default-count');
  
  tbody.innerHTML = '';
  countElement.textContent = data.length;
  
  data.forEach(employee => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.department}</td>
      <td>${createBadge(employee.status, employee.status === 'Active' ? 'active' : 'inactive').outerHTML}</td>
      <td>${employee.experience} years</td>
      <td>${employee.location}</td>
      <td>${createBadge(employee.remote ? 'Remote' : 'Office', employee.remote ? 'remote' : 'office').outerHTML}</td>
      <td>${formatCurrency(employee.salary)}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderAdvancedDefaultTable(data) {
  const tbody = document.getElementById('advanced-default-tbody');
  const countElement = document.getElementById('advanced-default-count');
  
  tbody.innerHTML = '';
  countElement.textContent = data.length;
  
  data.forEach(employee => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.department}</td>
      <td>${createBadge(employee.status, employee.status === 'Active' ? 'active' : 'inactive').outerHTML}</td>
      <td>${employee.experience} years</td>
      <td>${employee.location}</td>
      <td>${createBadge(employee.remote ? 'Remote' : 'Office', employee.remote ? 'remote' : 'office').outerHTML}</td>
      <td>${formatCurrency(employee.salary)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Query display functions
function displayQueries(queries, prefix) {
  if (queries.elasticsearch) {
    document.getElementById(`${prefix}-elasticsearch`).textContent = JSON.stringify(queries.elasticsearch, null, 2);
  }
  if (queries.sql) {
    document.getElementById(`${prefix}-sql`).textContent = queries.sql.query;
  }
  if (queries.mongodb) {
    document.getElementById(`${prefix}-mongodb`).textContent = JSON.stringify(queries.mongodb.filter, null, 2);
  }
  if (queries.graphql) {
    document.getElementById(`${prefix}-graphql`).textContent = queries.graphql.query;
  }
}

// Tab functionality
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      const tabContent = document.getElementById(`${tabName}-content`);
      
      // Remove active class from all tabs and contents
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      tabContent.classList.add('active');
    });
  });
}

// Initialize QueryChips instances
function initializeQueryChips() {
  // Check if QueryChips is loaded
  if (typeof window.QueryChips === 'undefined' || typeof window.QueryChips.QueryChips === 'undefined') {
    console.error('QueryChips library not loaded. Please check the script link.');
    return;
  }

  // Employee Management Example
  const employeeQueryChips = new window.QueryChips.QueryChips({
    data: employeeData,
    container: document.getElementById('employee-filter'),
    inferFields: true,
    queryLanguages: ['elasticsearch', 'sql', 'mongodb', 'graphql'],
    onChange: (filteredData, state) => {
      renderEmployeeTable(filteredData);
    },
    onQueryChange: (queries, state) => {
      displayQueries(queries, 'employee');
    }
  });



  // Smart Inference Example
  const inferenceQueryChips = new window.QueryChips.QueryChips({
    data: inferenceData,
    container: document.getElementById('inference-filter'),
    inferFields: true,
    onChange: (filteredData, state) => {
      renderInferenceTable(filteredData);
    }
  });

  // Default Query Example - Simple Format
  const simpleDefaultQueryChips = new window.QueryChips.QueryChips({
    data: employeeData,
    container: document.getElementById('simple-default-filter'),
    fields: [
      { key: 'name', label: 'Name', type: 'string', placeholder: 'Enter employee name...' },
      { key: 'department', label: 'Department', type: 'enum', values: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'] },
      { key: 'status', label: 'Status', type: 'enum', values: ['Active', 'Inactive'] },
      { key: 'experience', label: 'Experience', type: 'number', placeholder: 'Enter years...' },
      { key: 'salary', label: 'Salary', type: 'number', placeholder: 'Enter salary...' },
      { key: 'location', label: 'Location', type: 'string', placeholder: 'Enter location...' },
      { key: 'remote', label: 'Remote', type: 'boolean' },
      { key: 'manager', label: 'Manager', type: 'string', placeholder: 'Enter manager name...' }
    ],
    defaultQuery: [
      { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      { id: '2', field: 'remote', operator: '=', value: true }
    ],
    autoApply: true,
    onChange: (filteredData, state) => {
      renderSimpleDefaultTable(filteredData);
      console.log('Simple default query results:', filteredData.length);
    },
    queryLanguages: ['elasticsearch', 'sql']
  });

  // Default Query Example - Advanced Format
  const advancedDefaultQueryChips = new window.QueryChips.QueryChips({
    data: employeeData,
    container: document.getElementById('advanced-default-filter'),
    fields: [
      { key: 'name', label: 'Name', type: 'string', placeholder: 'Enter employee name...' },
      { key: 'department', label: 'Department', type: 'enum', values: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'] },
      { key: 'status', label: 'Status', type: 'enum', values: ['Active', 'Inactive'] },
      { key: 'experience', label: 'Experience', type: 'number', placeholder: 'Enter years...' },
      { key: 'salary', label: 'Salary', type: 'number', placeholder: 'Enter salary...' },
      { key: 'location', label: 'Location', type: 'string', placeholder: 'Enter location...' },
      { key: 'remote', label: 'Remote', type: 'boolean' },
      { key: 'manager', label: 'Manager', type: 'string', placeholder: 'Enter manager name...' }
    ],
    defaultQuery: {
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
      },
      autoApply: true,
      onChange: (filteredData, state) => {
        renderAdvancedDefaultTable(filteredData);
        console.log('Advanced default query results:', filteredData.length);
      },
      queryLanguages: ['elasticsearch', 'sql']
  });

  // Mount all instances
  employeeQueryChips.mount(document.getElementById('employee-filter'));
  inferenceQueryChips.mount(document.getElementById('inference-filter'));
  simpleDefaultQueryChips.mount(document.getElementById('simple-default-filter'));
  advancedDefaultQueryChips.mount(document.getElementById('advanced-default-filter'));

  // Initial render
  renderEmployeeTable(employeeData);
  renderInferenceTable(inferenceData);
  renderSimpleDefaultTable(employeeData);
  renderAdvancedDefaultTable(employeeData);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for the CDN script to load
  setTimeout(() => {
    initializeQueryChips();
    setupTabs();
  }, 100);
}); 