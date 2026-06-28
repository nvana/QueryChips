# QueryChips - Elasticsearch Example

A simple example demonstrating how to use QueryChips with Elasticsearch by connecting directly from the frontend.

## Features

- **Direct Connection**: Frontend connects directly to Elasticsearch (no backend required)
- **Dynamic Field Mapping**: Automatically fetches field definitions from Elasticsearch mapping
- **Query Builder**: Visual query builder using QueryChips
- **Real-time Search**: Execute queries against Elasticsearch and see results
- **Sample Data**: Pre-loaded product catalog with various fields

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Docker (for running Elasticsearch)

### 1. Start Elasticsearch

Using Docker Compose (recommended):

```bash
docker-compose up -d
```

Or manually start Elasticsearch:

```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Setup Elasticsearch

1. Open the application in your browser
2. Click "Connect to Elasticsearch" to create the index and sample data
3. Start building queries!

## How It Works

### Frontend (React)

The frontend connects directly to Elasticsearch and:

- **Health Check**: Verifies Elasticsearch is running
- **Index Creation**: Creates the products index with proper mapping
- **Sample Data**: Automatically populates with 8 sample products
- **Field Mapping**: Fetches field definitions from Elasticsearch mapping
- **Query Building**: Uses QueryChips to build and execute search queries
- **Results Display**: Shows search results in a clean interface

### Direct Elasticsearch Integration

The application makes direct HTTP requests to Elasticsearch:

- `GET /_cluster/health` - Check Elasticsearch status
- `GET /products/_mapping` - Fetch field definitions
- `PUT /products` - Create index with mapping
- `POST /_bulk` - Index sample data
- `POST /products/_search` - Execute search queries

### Sample Data

The example includes 8 sample products across different categories:

- **Electronics**: iPhone, Samsung Galaxy, Bluetooth Speaker
- **Clothing**: Nike shoes, Adidas t-shirt
- **Books**: The Great Gatsby, Python Programming
- **Home**: Coffee Maker

Each product has fields like name, category, brand, price, rating, stock status, tags, and description.

## Query Examples

Try these example queries:

1. **Find all electronics**: Set category to "Electronics"
2. **Find expensive items**: Set price range to "> 500"
3. **Find in-stock items**: Set "In Stock" to true
4. **Find high-rated items**: Set rating to "> 4.5"
5. **Find by brand**: Set brand to "Apple" or "Samsung"

## Project Structure

```
elasticsearch-example/
├── src/
│   └── App.tsx           # React app with direct Elasticsearch connection
├── docker-compose.yml    # Elasticsearch container setup
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## CORS Configuration

Since we're connecting directly from the browser, you may need to enable CORS in Elasticsearch. Add this to your Elasticsearch configuration:

```yaml
http.cors.enabled: true
http.cors.allow-origin: "*"
http.cors.allow-methods: OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers: "X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization"
```

Or use the provided docker-compose.yml which includes these settings.

## Troubleshooting

### Elasticsearch Connection Issues

1. Make sure Elasticsearch is running: `curl http://localhost:9200`
2. Check CORS settings if you see CORS errors in browser console
3. Verify Docker container is running: `docker ps`

### Setup Issues

1. If setup fails, try deleting the index: `curl -X DELETE localhost:9200/products`
2. Restart the application and try connecting again
3. Check the browser console for error messages

### Query Issues

1. Check the browser console for query logs
2. Verify the query structure in the network tab
3. Test queries directly against Elasticsearch: `curl -X POST localhost:9200/products/_search -H "Content-Type: application/json" -d '{"query":{"match_all":{}}}'`

## Development

### Adding New Fields

To add new fields to the sample data:

1. Update the mapping in `src/App.tsx` (in the `setupElasticsearch` function)
2. Add sample data with the new field
3. The field definitions will be automatically generated from the mapping

### Customizing the UI

The UI is styled with CSS-in-JS. Modify the styles in `src/App.tsx` to customize the appearance.

## Security Note

⚠️ **Important**: This example connects directly to Elasticsearch from the browser for demonstration purposes. In production:

- Use a backend API to proxy requests to Elasticsearch
- Implement proper authentication and authorization
- Configure CORS properly for your domain
- Consider using Elasticsearch security features

## License

This example is part of the QueryChips project. See the main project for license information. 