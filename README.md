# bunq Support Dashboard - Complete Full-Stack Application

A production-ready internal support ticket dashboard built with industry-standard security, performance, and maintainability. This repository contains both the **frontend** (HTML/CSS/JavaScript) and **enterprise-grade Node.js backend** with full database persistence and Slack integration.

## 🎯 Project Overview

This is a complete ticketing system designed for internal support teams, featuring:
- **Modern responsive frontend** with professional design system
- **Enterprise-grade Node.js backend** with PostgreSQL database
- **Real-time Slack notifications** for ticket events
- **Advanced filtering and search** capabilities
- **Auto-assignment logic** based on issue types
- **Full CRUD operations** with persistent data storage

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  index.html │  │   app.js    │  │  style.css  │    │
│  │    (UI)     │  │  (Logic)    │  │  (Styling)  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                              │
                           HTTP API
                              │
┌─────────────────────────────────────────────────────────┐
│                 Node.js Backend Server                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Routes    │  │ Controllers │  │   Models    │    │
│  │ (API Layer) │  │ (Business)  │  │ (Database)  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌─────────────┐      ┌─────────────┐
            │ PostgreSQL  │      │    Slack    │
            │  Database   │      │  Webhooks   │
            └─────────────┘      └─────────────┘
```

## 🚀 Quick Start Guide

### Prerequisites

Before starting, ensure you have:
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0  
- **PostgreSQL** >= 12.0 (or SQLite for development)
- **Git** for version control

```bash
# Check your versions
node --version  # Should be 18.0+
npm --version   # Should be 8.0+
```

### 1. Project Setup

```bash
# Clone or download the project
mkdir bunq-support-dashboard
cd bunq-support-dashboard

# Create directory structure
mkdir backend frontend
```

### 2. Frontend Setup

Place the provided frontend files in the `frontend/` directory:

```
frontend/
├── index.html    # Main dashboard interface
├── app.js        # Frontend JavaScript logic
└── style.css     # Complete design system and styling
```

**Frontend Features:**
- ✅ Responsive design with light/dark mode support
- ✅ Professional design system with bunq branding
- ✅ Real-time ticket filtering and search
- ✅ Modal-based ticket details view
- ✅ Auto-assignment logic for teams and priorities
- ✅ Comprehensive form validation
- ✅ Toast notifications for user feedback

### 3. Backend Setup

Extract the backend files to the `backend/` directory:

```
backend/
├── package.json                    # Dependencies and scripts
├── server.js                       # Application entry point
├── .env.example                    # Environment template
├── README.md                       # Backend documentation
├── Dockerfile                      # Container configuration
├── docker-compose.yml             # Development setup
├── config/
│   ├── database.js                # Database configuration
│   └── environment.js             # Environment management
├── controllers/
│   └── ticket.controller.js       # Request handlers
├── middleware/
│   ├── validation.middleware.js   # Input validation
│   └── error.middleware.js        # Error handling
├── models/
│   └── ticket.model.js            # Database model
├── routes/
│   └── ticket.routes.js           # API routes
├── utils/
│   ├── logger.js                  # Winston logging
│   ├── slack.utils.js             # Slack integration
│   ├── id.utils.js                # ID formatting
│   └── date.utils.js              # Date transformations
└── migrations/
    └── 001_create_tickets_table.js # Database schema
```

#### Install Backend Dependencies

```bash
cd backend
npm install
```

#### Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

**Essential Environment Variables:**

```env
# Basic Configuration
NODE_ENV=development
PORT=4000

# Database (PostgreSQL recommended for production)
DB_CLIENT=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=bunq_tickets

# For development with SQLite (easier setup)
# DB_CLIENT=sqlite3
# DB_CONNECTION=./tickets.sqlite

# Security
JWT_SECRET=your-super-secure-jwt-secret-change-this-in-production

# Slack Integration (optional but recommended)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
SLACK_ENABLED=true

# CORS (add your frontend URL)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://127.0.0.1:5500
```

### 4. Database Setup

#### Option A: PostgreSQL (Recommended for Production)

**Install PostgreSQL:**

```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows - Download from https://www.postgresql.org/download/
```

**Create Database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE bunq_tickets;
CREATE USER bunq_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE bunq_tickets TO bunq_user;
ALTER USER bunq_user CREATEDB;  -- For migrations
\q
```

**Update .env with PostgreSQL settings:**
```env
DB_CLIENT=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=bunq_user
DB_PASSWORD=your_secure_password
DB_NAME=bunq_tickets
```

#### Option B: SQLite (Quick Development Setup)

```env
DB_CLIENT=sqlite3
DB_CONNECTION=./tickets.sqlite
```

### 5. Run Database Migration

```bash
# From the backend directory
npm run migrate
```

This will:
- Create the tickets table with proper schema
- Set up indexes for performance
- Insert sample data for development
- Configure database triggers (PostgreSQL)

### 6. Start the Application

#### Backend Server

```bash
# From backend directory
npm run dev  # Development mode with auto-reload
# or
npm start    # Production mode
```

The backend will start on `http://localhost:4000`

#### Frontend Server

For the frontend, you can use any static file server:

```bash
# Option 1: Python (if available)
cd frontend
python -m http.server 3000  # Python 3
# or
python -m SimpleHTTPServer 3000  # Python 2

# Option 2: Node.js serve package
npm install -g serve
cd frontend
serve -p 3000

# Option 3: VS Code Live Server extension
# Right-click index.html -> "Open with Live Server"
```

The frontend will be available at `http://localhost:3000`

### 7. Slack Integration Setup (Optional)

1. Go to your Slack workspace
2. Create a new app at https://api.slack.com/apps
3. Enable "Incoming Webhooks"
4. Create a webhook for your desired channel
5. Copy the webhook URL to your `.env` file
6. Set `SLACK_ENABLED=true`

## 🔧 Development Workflow

### Frontend Development

The frontend uses vanilla JavaScript with a modern class-based architecture:

**Key Components:**
- `TicketDashboard` class manages all application state
- Automatic team assignment based on issue types
- Smart priority detection from description keywords
- Real-time filtering and search functionality
- Modal-based ticket detail views

**Auto-Assignment Logic:**
```javascript
// Issue Type → Team Assignment
"Bug" → "dev"
"Feature Request" → "product" 
"Performance Issue" → "devops"
"Security Issue" → "devops"
"Account Issue" → "support"

// Description Keywords → Priority Assignment
["urgent", "critical", "down"] → "Critical"
["important", "blocking", "major"] → "High"
["enhancement", "improvement"] → "Medium"
["minor", "cosmetic", "suggestion"] → "Low"
```

### Backend Development

The backend follows a clean MVC architecture:

**API Endpoints:**
```
GET    /api/health              # Health check
GET    /api/tickets             # List tickets (with filtering)
POST   /api/tickets             # Create new ticket
GET    /api/tickets/:id         # Get specific ticket
PATCH  /api/tickets/:id         # Update ticket
DELETE /api/tickets/:id         # Delete ticket
GET    /api/tickets/stats       # Get dashboard statistics
```

**Data Flow:**
1. **Routes** receive HTTP requests
2. **Middleware** validates input and handles authentication
3. **Controllers** process business logic
4. **Models** interact with database
5. **Utils** handle cross-cutting concerns (logging, Slack, etc.)

### Testing the Integration

1. **Start both servers** (backend on :4000, frontend on :3000)
2. **Open frontend** in browser
3. **Create a test ticket** using the form
4. **Verify database** persistence by refreshing the page
5. **Check Slack** for notification (if configured)
6. **Test filtering** and search functionality
7. **Try status updates** and deletions

## 🔐 Security Features

### Backend Security
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Joi schema validation for all endpoints
- **SQL Injection Protection**: Parameterized queries with Knex.js
- **Security Headers**: Helmet.js with CSP policies
- **Error Handling**: No sensitive data leakage
- **Comprehensive Logging**: Full audit trail

### Frontend Security
- **XSS Prevention**: Proper HTML escaping
- **CSRF Protection**: Same-origin policy
- **Input Sanitization**: Client-side validation
- **Secure Communication**: HTTPS ready

## 📊 Database Schema

```sql
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,                    -- Auto-increment ID
  title VARCHAR(255) NOT NULL,              -- Generated from issue type + description
  issueType VARCHAR(100) NOT NULL,          -- Bug, Feature Request, etc.
  priority VARCHAR(20) DEFAULT 'Low',       -- Low, Medium, High, Critical
  team VARCHAR(50) NOT NULL,                -- dev, qa, devops, support, product
  status VARCHAR(20) DEFAULT 'Open',        -- Open, In Progress, Resolved, Closed
  description TEXT NOT NULL,                -- Full issue description
  submitterName VARCHAR(255) NOT NULL,      -- Person who submitted
  submitterEmail VARCHAR(255) NOT NULL,     -- Contact email
  assignedMember VARCHAR(255),              -- Team member assigned
  created_at TIMESTAMP DEFAULT NOW(),       -- Creation timestamp
  updated_at TIMESTAMP DEFAULT NOW()        -- Last update timestamp
);

-- Indexes for performance
CREATE INDEX idx_tickets_status_team_priority ON tickets(status, team, priority);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_submitter_email ON tickets(submitterEmail);
```

## 🎨 Design System

The frontend uses a comprehensive design system based on CSS custom properties:

**Color Palette:**
- **Primary**: Teal (#21808D) - bunq brand color
- **Success**: Teal variants for positive actions
- **Warning**: Orange (#A84B2F) for medium priority
- **Error**: Red (#C0152F) for critical issues
- **Surface**: Cream (#FFFFFE) and Charcoal (#1F2121) for backgrounds

**Typography:**
- **Primary Font**: FKGroteskNeue (bunq brand font)
- **Fallbacks**: Geist, Inter, system fonts
- **Responsive Scaling**: 11px to 30px range

**Dark Mode Support:**
- Automatic detection via `prefers-color-scheme`
- Manual toggle support via `data-color-scheme` attribute
- Smooth transitions between themes

## 🚀 Production Deployment

### Environment Setup

**Production Environment Variables:**
```env
NODE_ENV=production
PORT=4000

# Production Database
DB_CLIENT=pg
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=bunq_tickets

# Security
JWT_SECRET=your-256-bit-secure-jwt-secret

# Slack Production Webhook
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/PRODUCTION/WEBHOOK
SLACK_ENABLED=true

# Production CORS
ALLOWED_ORIGINS=https://your-production-domain.com

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/production.log
```

### Docker Deployment

The project includes Docker support:

```bash
# Build and run with Docker
cd backend
docker build -t bunq-support-dashboard .
docker run -p 4000:4000 --env-file .env bunq-support-dashboard

# Or use Docker Compose (includes PostgreSQL)
docker-compose up -d
```

### Production Checklist

- [ ] **Database**: PostgreSQL server configured and accessible
- [ ] **Environment**: All production environment variables set
- [ ] **Security**: JWT secrets and database passwords are secure
- [ ] **SSL/TLS**: HTTPS certificates configured (recommended)
- [ ] **Firewall**: Appropriate ports opened (4000 for backend)
- [ ] **Monitoring**: Health check endpoint configured for monitoring
- [ ] **Backup**: Database backup strategy implemented
- [ ] **Logging**: Log rotation and retention configured
- [ ] **Slack**: Production webhook configured and tested

## 📈 Monitoring and Maintenance

### Health Monitoring

```bash
# Check backend health
curl http://localhost:4000/api/health

# Response:
{
  "status": "healthy",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

### Log Management

**Log Locations:**
- Application logs: `./logs/app.log`
- Error logs: `./logs/error.log`  
- Console output: Development mode only

**Log Rotation:**
- Maximum file size: 5MB
- Keep 5 historical files
- Automatic cleanup of old logs

### Database Maintenance

```bash
# View current ticket statistics
curl http://localhost:4000/api/tickets/stats

# Database backup (PostgreSQL)
pg_dump -U bunq_user -h localhost bunq_tickets > backup_$(date +%Y%m%d).sql

# Database restore
psql -U bunq_user -h localhost bunq_tickets < backup_20250115.sql
```

## 🧪 Testing and Development

### Frontend Testing

```javascript
// Test ticket creation
const testTicket = {
  issueType: "Bug",
  priority: "High", 
  description: "Login page critical error - urgent fix needed",
  submitterName: "Test User",
  submitterEmail: "test@company.com"
};

// Should auto-assign to "dev" team and "Critical" priority
```

### Backend API Testing

```bash
# Create a test ticket
curl -X POST http://localhost:4000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "issueType": "Bug",
    "description": "Test issue for API validation",
    "submitterName": "API Test",
    "submitterEmail": "test@company.com"
  }'

# Get all tickets
curl http://localhost:4000/api/tickets

# Filter tickets by status
curl "http://localhost:4000/api/tickets?status=Open&priority=High"

# Update ticket status
curl -X PATCH http://localhost:4000/api/tickets/TKT-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "Resolved"}'
```

### Available Scripts

```bash
# Backend
npm start          # Start production server
npm run dev        # Development server with auto-reload
npm run migrate    # Run database migrations
npm test           # Run test suite
npm run lint       # Code linting
npm run format     # Code formatting

# Docker
npm run docker:build    # Build Docker image
npm run docker:run      # Run container
npm run docker:compose  # Start with Docker Compose
```

## 🤝 Team Integration

### Slack Notifications

The system automatically sends notifications for:
- **New ticket creation**: Includes all ticket details
- **Status changes**: Updates when tickets are resolved/closed
- **Priority escalation**: Alerts for critical issues

### Team Assignment

**Automatic Assignment Logic:**
```javascript
const teamAssignments = {
  "Bug": "dev",                    // Development team
  "Technical Issue": "dev",        // Development team  
  "Feature Request": "product",    // Product team
  "Performance Issue": "devops",   // DevOps team
  "Security Issue": "devops",      // DevOps team
  "Account Issue": "support",      // Support team
  "Other": "support"               // Default to support
};
```

**Team Members (Round-Robin Assignment):**
- **Development**: Alice Johnson, Bob Smith, Charlie Brown, Diana Prince
- **QA**: Eve Wilson, Frank Miller, Grace Lee  
- **DevOps**: Henry Ford, Iris Watson, Jack Ryan
- **Support**: Kate Stevens, Leo Torres, Mia Chang
- **Product**: Noah Davis, Olivia Martinez, Paul Anderson

## 🔧 Troubleshooting

### Common Issues

**Backend Won't Start:**
```bash
# Check if port is in use
lsof -i :4000

# Check PostgreSQL connection
psql -U postgres -h localhost -c "SELECT version();"

# Check environment variables
printenv | grep DB_
```

**Frontend Can't Connect to Backend:**
```bash
# Verify backend is running
curl http://localhost:4000/api/health

# Check CORS configuration
# Ensure frontend URL is in ALLOWED_ORIGINS
```

**Database Connection Issues:**
```bash
# PostgreSQL not running
brew services start postgresql        # macOS
sudo systemctl start postgresql      # Linux

# Wrong database credentials
# Check .env file database settings
```

**Slack Notifications Not Working:**
```bash
# Test webhook manually
curl -X POST YOUR_SLACK_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"text": "Test message"}'

# Check environment variables
echo $SLACK_WEBHOOK_URL
echo $SLACK_ENABLED
```

### Support Resources

- **Backend Documentation**: See `backend/README.md` for detailed API docs
- **Database Schema**: Check `backend/migrations/` for table definitions
- **Environment Setup**: Use `backend/.env.example` as template
- **Docker Setup**: Use `backend/docker-compose.yml` for containerized deployment

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏢 About bunq

Built with ❤️ for bunq's Process Engineering team. This dashboard represents our commitment to internal tooling excellence and developer experience.

**bunq** - The Bank of The Free 🌈

---

## Version History

### v1.0.0 (Current)
- ✅ Complete frontend with responsive design
- ✅ Enterprise-grade Node.js backend
- ✅ PostgreSQL database with migrations
- ✅ Slack integration with webhooks
- ✅ Auto-assignment and priority detection
- ✅ Comprehensive security measures
- ✅ Docker support and production deployment
- ✅ Full API documentation and testing guides

For technical support or contributions, please contact the Process Engineering team.
