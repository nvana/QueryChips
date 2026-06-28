import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { QueryChips } from '../../../dist/querychips.mjs';
import { Field, QueryChipsState, ElasticsearchQuery } from '../../../src/types';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  inStock: boolean;
  tags: string[];
  description: string;
}

interface ElasticsearchMapping {
  [key: string]: {
    type: string;
    properties?: ElasticsearchMapping;
  };
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const queryChipsRef = useRef<QueryChips | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Elasticsearch configuration
  const ELASTICSEARCH_URL = 'http://localhost:9200';
  const INDEX_NAME = 'products';

  // Convert Elasticsearch mapping to QueryChips fields
  const convertMappingToFields = (properties: ElasticsearchMapping): Field[] => {
    const fields: Field[] = [];
    
    const processProperties = (properties: ElasticsearchMapping, prefix = ''): void => {
      Object.entries(properties).forEach(([key, value]) => {
        const fieldKey = prefix ? `${prefix}.${key}` : key;
        
        // Skip internal Elasticsearch fields
        if (key.startsWith('_')) return;
        
        switch (value.type) {
          case 'text':
            fields.push({
              key: fieldKey,
              label: formatFieldLabel(key),
              type: 'string',
              placeholder: `Enter ${key.toLowerCase()}...`
            });
            break;
            
          case 'keyword':
            fields.push({
              key: fieldKey,
              label: formatFieldLabel(key),
              type: 'string',
              placeholder: `Enter ${key.toLowerCase()}...`
            });
            break;
            
          case 'long':
          case 'integer':
          case 'float':
          case 'double':
            fields.push({
              key: fieldKey,
              label: formatFieldLabel(key),
              type: 'number',
              placeholder: `Enter ${key.toLowerCase()}...`
            });
            break;
            
          case 'boolean':
            fields.push({
              key: fieldKey,
              label: formatFieldLabel(key),
              type: 'boolean'
            });
            break;
            
          case 'date':
            fields.push({
              key: fieldKey,
              label: formatFieldLabel(key),
              type: 'string',
              placeholder: `Enter date (YYYY-MM-DD)...`
            });
            break;
            
          case 'object':
            if (value.properties) {
              processProperties(value.properties, fieldKey);
            }
            break;
            
          case 'nested':
            if (value.properties) {
              processProperties(value.properties, fieldKey);
            }
            break;
        }
      });
    };
    
    processProperties(properties);
    return fields;
  };

  // Format field label for better display
  const formatFieldLabel = (fieldName: string): string => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ')
      .trim();
  };

  // Check Elasticsearch connection and get mapping
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Check if Elasticsearch is running
      const healthResponse = await fetch(`${ELASTICSEARCH_URL}/_cluster/health`);
      if (!healthResponse.ok) {
        throw new Error('Elasticsearch not accessible');
      }
      
      setIsConnected(true);
      
      // Check if index exists
      const indexExists = await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}`);
      if (indexExists.ok) {
        // Get mapping
        await fetchMapping();
        // Load products
        await loadProducts();
      } else {
        // Create index and sample data
        await setupElasticsearch();
      }
    } catch (error) {
      setIsConnected(false);
      setError('Failed to connect to Elasticsearch. Make sure it\'s running on localhost:9200');
    }
  };

  const fetchMapping = async () => {
    try {
      const response = await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}/_mapping`);
      if (!response.ok) {
        throw new Error('Failed to fetch mapping');
      }
      
      const data = await response.json();
      const properties = data[INDEX_NAME]?.mappings?.properties;
      
      if (properties) {
        const fields = convertMappingToFields(properties);
        setFields(fields);
      }
    } catch (error) {
      console.error('Failed to fetch mapping:', error);
      setError('Failed to fetch field mapping');
    }
  };

  const setupElasticsearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create index with mapping
      const createResponse = await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mappings: {
            properties: {
              name: { type: 'text' },
              category: { type: 'keyword' },
              brand: { type: 'text' },
              price: { type: 'float' },
              rating: { type: 'float' },
              inStock: { type: 'boolean' },
              tags: { type: 'keyword' },
              description: { type: 'text' }
            }
          }
        })
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create index');
      }

      // Generate sample data
      const sampleProducts = [
        {
          name: 'iPhone 15 Pro',
          category: 'Electronics',
          brand: 'Apple',
          price: 999.99,
          rating: 4.8,
          inStock: true,
          tags: ['smartphone', '5G', 'camera'],
          description: 'Latest iPhone with advanced camera system and A17 Pro chip.'
        },
        {
          name: 'Samsung Galaxy S24',
          category: 'Electronics',
          brand: 'Samsung',
          price: 899.99,
          rating: 4.6,
          inStock: true,
          tags: ['smartphone', '5G', 'android'],
          description: 'Premium Android smartphone with AI features.'
        },
        {
          name: 'Nike Air Max',
          category: 'Clothing',
          brand: 'Nike',
          price: 129.99,
          rating: 4.5,
          inStock: true,
          tags: ['shoes', 'running', 'sports'],
          description: 'Comfortable running shoes with air cushioning.'
        },
        {
          name: 'Adidas T-Shirt',
          category: 'Clothing',
          brand: 'Adidas',
          price: 29.99,
          rating: 4.2,
          inStock: false,
          tags: ['shirt', 'cotton', 'casual'],
          description: 'Comfortable cotton t-shirt for everyday wear.'
        },
        {
          name: 'The Great Gatsby',
          category: 'Books',
          brand: 'F. Scott Fitzgerald',
          price: 12.99,
          rating: 4.7,
          inStock: true,
          tags: ['classic', 'fiction', 'literature'],
          description: 'Classic American novel about the Jazz Age.'
        },
        {
          name: 'Python Programming',
          category: 'Books',
          brand: 'O\'Reilly',
          price: 49.99,
          rating: 4.4,
          inStock: true,
          tags: ['programming', 'python', 'technical'],
          description: 'Comprehensive guide to Python programming language.'
        },
        {
          name: 'Coffee Maker',
          category: 'Home',
          brand: 'Breville',
          price: 199.99,
          rating: 4.3,
          inStock: true,
          tags: ['kitchen', 'coffee', 'appliance'],
          description: 'Automatic coffee maker with programmable features.'
        },
        {
          name: 'Bluetooth Speaker',
          category: 'Electronics',
          brand: 'JBL',
          price: 79.99,
          rating: 4.1,
          inStock: false,
          tags: ['speaker', 'bluetooth', 'portable'],
          description: 'Portable wireless speaker with great sound quality.'
        }
      ];

      // Index sample data
      const operations = sampleProducts.flatMap(doc => [
        { index: { _index: INDEX_NAME } },
        doc
      ]);

      const bulkResponse = await fetch(`${ELASTICSEARCH_URL}/_bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: operations.map(op => JSON.stringify(op)).join('\n') + '\n'
      });

      if (!bulkResponse.ok) {
        throw new Error('Failed to index sample data');
      }

      // Refresh index
      await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}/_refresh`, { method: 'POST' });

      // Get fields from mapping
      await fetchMapping();
      
      // Load products
      await loadProducts();
      
    } catch (error) {
      console.error('Setup error:', error);
      setError('Failed to setup Elasticsearch');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}/_search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: { match_all: {} },
          size: 100
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      
      const data = await response.json();
      const hits = data.hits?.hits || [];
      const products = hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source
      }));
      
      setProducts(products);
    } catch (error) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}/_search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          size: 100
        })
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      const hits = data.hits?.hits || [];
      const products = hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source
      }));
      
      setProducts(products);
    } catch (error) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const setupQueryChips = () => {
    if (!containerRef.current || queryChipsRef.current || fields.length === 0) return;

    queryChipsRef.current = new QueryChips({
      data: [],
      fields,
      autoApply: true,
      queryLanguages: ['elasticsearch'],
      onQueryChange: (queries: { elasticsearch?: ElasticsearchQuery }, state: QueryChipsState) => {
        console.log('Elasticsearch Query:', queries.elasticsearch);
        
        if (queries.elasticsearch && Object.keys(queries.elasticsearch).length > 0) {
          searchProducts(queries.elasticsearch);
        } else {
          loadProducts();
        }
      }
    });

    queryChipsRef.current.mount(containerRef.current);
  };

  useEffect(() => {
    if (isConnected && products.length > 0 && fields.length > 0) {
      setupQueryChips();
    }
  }, [isConnected, products, fields]);

  return (
    <div className="app">
      <header>
        <h1>QueryChips - Elasticsearch Example</h1>
        <p>Build queries and search Elasticsearch data directly from frontend</p>
      </header>

      <div className="status-section">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '✓ Connected' : '✗ Disconnected'}
        </div>
        
        {!isConnected && (
          <button onClick={checkConnection} disabled={loading}>
            {loading ? 'Connecting...' : 'Connect to Elasticsearch'}
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {isConnected && (
        <div className="querychips-section">
          <h2>Build Your Query</h2>
          {fields.length > 0 ? (
            <div ref={containerRef} className="querychips-container"></div>
          ) : (
            <div className="loading">Loading field definitions...</div>
          )}
        </div>
      )}

      <div className="results-section">
        <h2>Search Results</h2>
        {loading && <div className="loading">Loading...</div>}
        
        {!loading && products.length > 0 && (
          <div className="results-info">Found {products.length} products</div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="no-results">No products found</div>
        )}

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <div className="product-details">
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Rating:</strong> {product.rating}/5</p>
                <p><strong>In Stock:</strong> {product.inStock ? 'Yes' : 'No'}</p>
                <p><strong>Tags:</strong> {product.tags.join(', ')}</p>
              </div>
              <p className="product-description">{product.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .app {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        header {
          text-align: center;
          margin-bottom: 30px;
        }

        header h1 {
          color: #333;
          margin-bottom: 10px;
        }

        header p {
          color: #666;
          font-size: 16px;
        }

        .status-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .status-indicator {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
        }

        .status-indicator.connected {
          background: #d4edda;
          color: #155724;
        }

        .status-indicator.disconnected {
          background: #f8d7da;
          color: #721c24;
        }

        button {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .querychips-section {
          margin-bottom: 30px;
        }

        .querychips-section h2 {
          color: #333;
          margin-bottom: 15px;
        }

        .querychips-container {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          background: black;
        }

        .results-section {
          margin-top: 30px;
        }

        .results-section h2 {
          color: #333;
          margin-bottom: 15px;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .results-info {
          margin-bottom: 20px;
          color: #666;
          font-size: 14px;
        }

        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .product-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .product-card h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 18px;
        }

        .product-details {
          margin-bottom: 15px;
        }

        .product-details p {
          margin: 5px 0;
          font-size: 14px;
          color: #666;
        }

        .product-description {
          font-size: 14px;
          color: #888;
          font-style: italic;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default App; 