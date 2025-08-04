# bunq Support Dashboard Backend

A production-ready Node.js backend for the internal support ticket dashboard, built with enterprise-grade security, performance, and maintainability standards.

## 🚀 Features

- **RESTful API** with full CRUD operations for support tickets
- **Enterprise Database Support** - PostgreSQL for production, SQLite for development
- **Frontend Compatibility** - Full compatibility with existing frontend (ID formatting, date handling, etc.)
- **Slack Integration** - Automated notifications for ticket events
- **Security First** - Rate limiting, CORS, input validation, and secure headers
- **Production Ready** - Comprehensive logging, error handling, and monitoring
- **Database Migrations** - Structured schema management
- **Auto-generated IDs** - Frontend-compatible TKT-001 format from numeric database IDs

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **PostgreSQL** >= 12.0 (for production) or SQLite3 (for development)

## 🛠️ Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd bunq-support-dashboard-backend

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Basic Configuration
NODE_ENV=development
PORT=4000

# Database (PostgreSQL for production)
DB_CLIENT=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=bunq_tickets

# For development with SQLite (simpler setup)
# DB_CLIENT=sqlite3
# DB_CONNECTION=./tickets.sqlite

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Slack Integration (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
SLACK_ENABLED=true

# CORS (add your frontend URLs)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,https://your-frontend-domain.com
```

### 3. Database Setup

#### Option A: PostgreSQL (Recommended for Production)

1. **Install PostgreSQL**:
   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database and user
   CREATE DATABASE bunq_tickets;
   CREATE USER bunq_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE bunq_tickets TO bunq_user;
   \q
   ```

3. **Update .env** with your PostgreSQL credentials

#### Option B: SQLite (For Development)

```env
DB_CLIENT=sqlite3
DB_CONNECTION=./tickets.sqlite
```

### 4. Run Database Migration

```bash
npm run migrate
```

### 5. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:4000` (or your configured PORT).

## 🔧 Development Setup

### File Structure

```
backend/
├── config/
│   ├── database.js          # Database configuration
│   └── environment.js       # Environment variables
├── controllers/
│   └── ticket.controller.js # Request handlers
├── middleware/
│   ├── auth.middleware.js   # Authentication (future)
│   ├── validation.middleware.js # Input validation
│   └── error.middleware.js  # Error handling
├── models/
│   └── ticket.model.js      # Database model
├── routes/
│   └── ticket.routes.js     # API routes
├── utils/
│   ├── logger.js            # Winston logging
│   ├── slack.utils.js       # Slack integration
│   ├── id.utils.js          # ID formatting
│   └── date.utils.js        # Date transformations
├── migrations/
│   └── 001_create_tickets_table.js # Database schema
├── logs/                    # Log files (auto-created)
├── server.js               # Application entry point
├── package.json
├── .env.example
└── README.md
```

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run migrate    # Run database migrations
npm test           # Run tests (when implemented)
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 🌐 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Endpoints

#### GET /api/tickets
Get all tickets with optional filtering.

**Query Parameters:**
- `status` - Filter by status (Open, In Progress, Resolved, Closed)
- `team` - Filter by team (dev, qa, devops, support, product)
- `priority` - Filter by priority (Low, Medium, High, Critical)
- `search` - Search in title, description, and submitter name

**Response:**
```json
[
  {
    "id": "TKT-001",
    "title": "Login page not responding",
    "issueType": "Bug",
    "priority": "High",
    "team": "dev",
    "status": "In Progress",
    "description": "Users are unable to log in...",
    "submitterName": "John Doe",
    "submitterEmail": "john.doe@company.com",
    "assignedMember": "Alice Johnson",
    "createdDate": "2025-01-15T10:30:00.000Z",
    "lastUpdated": "2025-01-15T14:22:00.000Z"
  }
]
```

#### POST /api/tickets
Create a new ticket.

**Request Body:**
```json
{
  "issueType": "Bug",
  "priority": "High",
  "team": "dev",
  "description": "Detailed description of the issue",
  "submitterName": "John Doe",
  "submitterEmail": "john.doe@company.com"
}
```

#### GET /api/tickets/:id
Get a specific ticket by ID (accepts both TKT-001 and numeric formats).

#### PATCH /api/tickets/:id
Update a ticket (typically used for status changes).

**Request Body:**
```json
{
  "status": "Resolved"
}
```

#### DELETE /api/tickets/:id
Delete a ticket.

#### GET /api/tickets/stats
Get ticket statistics.

**Response:**
```json
{
  "total": 25,
  "open": 10,
  "inProgress": 8,
  "resolved": 5,
  "closed": 2,
  "critical": 3
}
```

## 🔐 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Joi schema validation for all inputs
- **Security Headers**: Helmet.js for secure HTTP headers
- **SQL Injection Protection**: Knex.js query builder with parameterized queries
- **Error Handling**: No sensitive information leaked in error responses

## 🔄 Frontend Integration

### ID Compatibility
- Backend uses numeric auto-increment IDs (1, 2, 3...)
- Frontend expects string IDs (TKT-001, TKT-002, TKT-003...)
- Automatic conversion handled by the API

### Date Handling
- Backend stores timestamps as `created_at`, `updated_at`
- Frontend expects `createdDate`, `lastUpdated` as ISO strings
- Automatic conversion handled by the model layer

### Slack Integration
- Moved from client-side to server-side for security
- Remove the webhook URL input from frontend
- Notifications sent automatically on ticket creation/updates

## 📊 Monitoring and Logging

### Logs Location
- Application logs: `./logs/app.log`
- Error logs: `./logs/error.log`
- Console output in development mode

### Log Levels
- `error`: Error conditions
- `warn`: Warning conditions  
- `info`: Informational messages
- `debug`: Debug messages (development only)

### Health Check
```bash
curl http://localhost:4000/api/health
```

## 🚀 Production Deployment

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=4000

# Production Database
DB_CLIENT=pg
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=bunq_tickets

# Security
JWT_SECRET=your-super-secure-jwt-secret-256-bits-minimum

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/PRODUCTION/WEBHOOK
SLACK_ENABLED=true

# CORS
ALLOWED_ORIGINS=https://your-production-domain.com

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/production.log
```

### Deployment Checklist

- [ ] PostgreSQL database setup and migrations run
- [ ] Environment variables configured
- [ ] SSL/TLS certificates configured (if applicable)
- [ ] Firewall rules configured
- [ ] Log rotation configured
- [ ] Monitoring alerts configured
- [ ] Backup strategy implemented

### Docker Support (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 Changelog

### v1.0.0
- Initial release
- Full CRUD API for tickets
- PostgreSQL/SQLite support
- Slack integration
- Frontend compatibility layer
- Enterprise security features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check PostgreSQL is running
brew services list | grep postgresql
sudo systemctl status postgresql

# Check database exists
psql -U postgres -l
```

**Port Already in Use**
```bash
# Find and kill process using port 4000
lsof -ti:4000 | xargs kill -9

# Or use a different port
PORT=4001 npm start
```

**Slack Notifications Not Working**
- Verify webhook URL is correct
- Check `SLACK_ENABLED=true` in .env
- Check logs for detailed error messages

### Support

For support and questions:
- Create an issue in the repository
- Check the logs in `./logs/` for detailed error information
- Contact the Process Engineering team

---

Built with ❤️ for bunq's Process Engineering team
