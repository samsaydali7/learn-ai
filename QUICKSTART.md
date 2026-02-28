# Blog CMS - Quick Start Guide

## 🚀 Running with Docker Compose (Recommended)

### Prerequisites
- Docker and Docker Compose installed

### Steps

1. **Navigate to the project directory**:
   ```bash
   cd blog-cms
   ```

2. **Build and start both services**:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Download necessary images
   - Build the backend (NestJS) and frontend (Angular) containers
   - Start both services and establish network communication

3. **Wait for services to start** (typically 30-60 seconds):
   - Backend starts on port 3000
   - Frontend starts on port 4200

4. **Access the application**:
   - Open browser: http://localhost:4200
   - Login with credentials:
     - Username: `admin`
     - Password: `admin`

5. **Stop the services**:
   ```bash
   docker-compose down
   ```

---

## 🔧 Running Locally (Development)

### Prerequisites
- Node.js v18+ and npm

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

Backend will run on http://localhost:3000

### Frontend Setup (in another terminal)

```bash
cd frontend
npm install
npm start
```

Frontend will run on http://localhost:4200

---

## 📊 Dashboard Usage

### Login Page
- Enter default credentials (admin / admin)
- Click Login

### Dashboard - Blog Posts Tab
1. **View Posts**: See all your blog posts as cards
2. **Create Post**:
   - Click "+ New Post" button
   - Fill in title, content, select category, add image URL
   - Click "Create Post"
3. **Edit Post**: Click "Edit" on any post card
4. **Delete Post**: Click "Delete" on any post card

### Dashboard - Categories Tab
1. **View Categories**: See all categories with post count
2. **Create Category**:
   - Click "+ New Category" button
   - Enter name and description
   - Click "Create Category"
3. **Edit Category**: Click "Edit" on any category card
4. **Delete Category**: Click "Delete" on any category card

---

## 📁 Project Structure

```
blog-cms/
├── backend/           # NestJS application
│   ├── src/
│   │   ├── auth/     # Login/JWT authentication
│   │   ├── posts/    # Blog posts CRUD
│   │   ├── categories/ # Categories CRUD
│   │   └── main.ts   # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/          # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/     # Login and Dashboard
│   │   │   └── services/  # API calls
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml # Multi-container setup
└── README.md
```

---

## 🔗 API Endpoints

### Authentication
```
POST /auth/login
  Body: { username: string, password: string }
  Response: { success: boolean, data: { access_token: string, user: {...} } }
```

### Posts
```
GET    /posts              - Get all posts
POST   /posts              - Create post
GET    /posts/:id          - Get single post
PUT    /posts/:id          - Update post
DELETE /posts/:id          - Delete post
GET    /posts/category/:id - Get posts by category
```

### Categories
```
GET    /categories         - Get all categories  
POST   /categories         - Create category
GET    /categories/:id     - Get single category
PUT    /categories/:id     - Update category
DELETE /categories/:id     - Delete category
```

---

## 🆘 Troubleshooting

### Ports already in use
- Backend needs port 3000
- Frontend needs port 4200
- Change in docker-compose.yml if needed

### Backend not responding
```bash
docker-compose logs backend
```

### Frontend not loading
- Check browser console for errors
- Ensure backend is running (http://localhost:3000/health)

### Images not showing
- The app expects full URLs for images
- Example: `https://picsum.photos/400/300?random=1`

---

## 📝 Sample Test Data

After logging in with admin/admin:

1. **Create a Category**:
   - Name: "Technology"
   - Description: "All about tech news"

2. **Create Another Category**:
   - Name: "Travel"

3. **Create a Blog Post**:
   - Title: "Hello World"
   - Category: Technology
   - Image: https://picsum.photos/400/300?random=1
   - Content: "This is my first blog post!"

---

## 🎓 Next Steps

- Explore the dashboard features
- Try creating posts and categories
- Check the network tab in browser DevTools to see API calls
- Review the code in backend/src and frontend/src

Enjoy your Blog CMS! 🎉
