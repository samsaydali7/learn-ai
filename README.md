# Blog CMS - Full Stack Application

A modern Blog Content Management System built with Angular frontend and NestJS backend, fully containerized with Docker.

## Features

- **Authentication**: User login system with JWT (default credentials: admin/admin)
- **Blog Posts Management**: Create, read, update, and delete blog posts with rich content
- **Categories**: Organize posts into categories
- **Dashboard**: Clean and intuitive admin dashboard
- **In-Memory Database**: All data stored in memory (perfect for development/testing)
- **Docker Support**: Complete Docker and Docker Compose setup for easy deployment

## Project Structure

```
.
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── posts/          # Blog posts module
│   │   ├── categories/     # Categories module
│   │   ├── app.module.ts   # Main application module
│   │   └── main.ts         # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/                # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/      # Login and Dashboard pages
│   │   │   ├── services/   # API and Auth services
│   │   │   ├── app.routes.ts
│   │   │   └── app.component.ts
│   │   ├── index.html
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Docker Compose configuration
└── README.md

```

## Prerequisites

- Docker and Docker Compose installed on your system
- OR Node.js (v18+) and npm for local development

## Quick Start with Docker

### 1. Clone or navigate to the project directory

```bash
cd /path/to/blog-cms
```

### 2. Build and run with Docker Compose

```bash
docker-compose up --build
```

This command will:
- Build the backend container
- Build the frontend container
- Start both services on their respective ports
- Establish network communication between them

### 3. Access the application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000

### 4. Login

Use the default admin credentials:
- **Username**: `admin`
- **Password**: `admin`

## Local Development (Without Docker)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start the backend
npm run start:dev
```

The backend will run on http://localhost:3000

### Frontend Setup (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend will run on http://localhost:4200

## API Endpoints

### Authentication
- `POST /auth/login` - Login with username/password
- `POST /auth/verify` - Verify JWT token

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get a specific post
- `POST /posts` - Create a new post
- `PUT /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post
- `GET /posts/category/:categoryId` - Get posts by category

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get a specific category
- `POST /categories` - Create a new category
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

## Dashboard Features

### Blog Posts Tab
- View all blog posts in a card layout
- Create new posts with title, content, main image, and category
- Edit existing posts
- Delete posts
- Filter by category
- Preview post images

### Categories Tab
- View all categories
- Create new categories with name and description
- Edit existing categories
- Delete categories
- See post count for each category

## Technologies Used

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **JWT** - JSON Web Tokens for authentication
- **Express** - Web framework (built-in with NestJS)

### Frontend
- **Angular 17** - Modern web framework
- **TypeScript** - Type-safe development
- **Standalone Components** - Latest Angular architecture
- **Reactive Forms** - Form handling

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Node.js Alpine** - Lightweight production images

## Data Storage

All data is **stored in memory** using TypeScript Maps:
- User data (default admin user)
- Blog posts
- Categories

This means data will reset when the application restarts. For production use, consider integrating a database like PostgreSQL or MongoDB.

## Environment Variables

### Backend (.env file in backend/)
```
JWT_SECRET=blog-cms-secret-key-2026
JWT_EXPIRATION=24h
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:4200
```

## Docker Compose Services

The `docker-compose.yml` includes:
- **Backend Service**: Runs NestJS on port 3000
- **Frontend Service**: Runs Angular on port 4200
- **Network**: Both services communicate via `blog-network`
- **Health Check**: Backend includes a health check endpoint

## Troubleshooting

### Backend won't start
- Ensure port 3000 is not in use
- Check Docker logs: `docker-compose logs backend`
- Make sure Node modules are installed in the container

### Frontend won't connect to backend
- Verify backend is running and healthy
- Check CORS settings in backend/src/main.ts
- Ensure firewall allows communication on port 3000

### Port already in use
- Change port mappings in docker-compose.yml
- Update frontend API URL if changed

## Future Enhancements

- Add real database (PostgreSQL, MongoDB)
- Implement file upload for images
- Add author management
- Add comments/reviews system
- Implement caching (Redis)
- Add email notifications
- Deploy to cloud platforms (AWS, GCP, Azure)
- Add automated testing
- Implement pagination and filtering
- Add search functionality

## License

MIT

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.
