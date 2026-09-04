
# 🌍 GeoJobs Italy - Engineering Job Platform

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-24.0-2496ed.svg)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**GeoJobs Italy** is a sophisticated job platform specifically designed for the Italian engineering and geospatial industry. It connects talented engineers, GIS professionals, and geospatial experts with leading companies across Italy.

## ✨ Features

### For Job Seekers
- 🔍 **Smart Job Search** - Search by keywords, location, or category
- 📂 **Job Categories** - Browse jobs across multiple engineering disciplines
- 💼 **Apply & Save** - Apply to jobs and save favorites for later
- 📊 **Career Resources** - Access salary guides and career resources
- 🎯 **Skill Matching** - Find jobs that match your skills

### For Employers
- 📝 **Post Jobs** - Create detailed job postings with categories
- 👥 **Company Profile** - Showcase your company to potential candidates
- 📈 **Analytics Dashboard** - Track job views and applications
- 🏷️ **Category Management** - Post jobs in multiple categories

### Platform Features
- 🗺️ **Geospatial Theme** - Satellite imagery and Earth observation inspired design
- 🔐 **User Authentication** - Secure login and registration with JWT
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🚀 **Fast & Scalable** - Built with FastAPI and React for performance

## 🎯 Job Categories

| Category | Roles |
|----------|-------|
| **GIS & Geospatial** | GIS Developer, Remote Sensing Specialist, GIS Analyst, Geospatial Data Engineer |
| **Civil Engineering** | Structural Engineer, Civil Engineer, Construction Manager |
| **Mechanical Engineering** | Mechanical Design Engineer, Manufacturing Engineer, Automotive Engineer |
| **Electrical Engineering** | Power Systems Engineer, Control Systems Engineer, Electronics Engineer |
| **Software Engineering** | Full Stack Developer, Data Engineer, Software Developer |
| **Aerospace Engineering** | Aerospace Systems Engineer, Space Systems Engineer |
| **Chemical Engineering** | Process Engineer, Environmental Engineer |
| **Robotics & Automation** | Robotics Engineer, Automation Engineer |

## 🏗️ Architecture

### Tech Stack

#### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with PostGIS extension
- **ORM**: SQLAlchemy
- **Authentication**: JWT with passlib
- **Containerization**: Docker & Docker Compose

#### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios

#### Infrastructure
- **Database**: PostgreSQL 15 with PostGIS
- **Cache**: Redis
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Hosting**: Docker, Vercel, or Render.com

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zafariabbas68/geojobs-italy.git
   cd geojobs-italy
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the backend with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

5. **Build and serve the frontend**
   ```bash
   npm run build
   npm install -g serve
   serve -s build --single --cors
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🧪 Testing

### Manual Testing

1. **Register a new account**
   - Click "Register" and fill in the form
   - Use a unique email address

2. **Login**
   - Click "Login" and enter your credentials

3. **Browse Jobs**
   - View all jobs on the homepage
   - Click "View Details" for more information

4. **Apply & Save**
   - Click "Apply" to apply for a job
   - Click "Save Job" to save it for later

5. **Post a Job**
   - Click "Post a Job" (top right)
   - Fill in the form with job details

### API Testing

```bash
# Health check
curl http://localhost:8000/api/health

# Get all jobs
curl http://localhost:8000/api/v1/jobs | python -m json.tool

# Get jobs by category
curl "http://localhost:8000/api/v1/jobs?category=GIS%20%26%20Geospatial" | python -m json.tool

# Register a new user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@geojobs.it",
    "password": "test12345",
    "first_name": "Test",
    "last_name": "User",
    "role": "candidate"
  }' | python -m json.tool

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@geojobs.it&password=test12345" | python -m json.tool
```

## 📊 Database Schema

### Key Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts and authentication |
| `companies` | Company profiles |
| `jobs` | Job listings with categories |
| `applications` | Job applications |
| `candidates` | Candidate profiles |
| `saved_jobs` | Saved jobs by candidates |

### Sample Data

The platform comes with 17+ sample jobs including:
- GIS Developer (ESRI Italy, Milan)
- Remote Sensing Specialist (CGR S.p.A., Parma)
- GIS Analyst (e-GEOS, Rome)
- Earth Observation Scientist (Planetek Italia, Bari)
- Geospatial Data Engineer (Hexagon Italy, Turin)
- Surveying Engineer (Topcon Positioning Italy, Milan)
- GIS Solutions Engineer (Stonex S.r.l., Paderno Dugnano)

## 🐳 Docker Development

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker logs geojobs-backend
docker logs geojobs-postgres
docker logs geojobs-redis
```

### Rebuild Backend
```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

## 🚀 Deployment

### Deploy to Vercel (Frontend)

```bash
cd frontend
npm run build
vercel --prod
```

### Deploy Backend to Render.com

1. Push code to GitHub
2. Connect repository to Render.com
3. Set environment variables
4. Deploy

### Deploy with Docker

```bash
# Build frontend Docker image
cd frontend
docker build -t geojobs-frontend .

# Run frontend container
docker run -d -p 3000:3000 --name geojobs-frontend geojobs-frontend
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/geojobs

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Apify API (for job scraping)
APIFY_API_TOKEN=your_apify_token

# Frontend URL
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

## 📁 Project Structure

```
geojobs-italy/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # API endpoints
│   │   ├── core/            # Config, security, database
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Backend container
│   └── scripts/             # Utility scripts
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   └── App.tsx          # Main application
│   ├── package.json         # Node dependencies
│   └── Dockerfile           # Frontend container
├── database/
│   └── init.sql             # Database initialization
├── docker-compose.yml       # Multi-container setup
└── README.md                # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ghulam Abbas Zafari**
- GitHub: [@zafariabbas68](https://github.com/zafariabbas68)
- LinkedIn: [Ghulam Abbas Zafari](https://linkedin.com/in/ghulam-abbas-zafari)

## 🙏 Acknowledgments

- Politecnico di Milano - Geoinformatics Engineering program
- The geospatial community in Italy
- All contributors and users of this platform

## 🗺️ Italy's Geospatial Industry

The platform serves Italy's growing geospatial and engineering sector, connecting talent with opportunities in:

- GIS and Mapping
- Remote Sensing and Earth Observation
- Surveying and Geodesy
- Geoinformatics and Data Science
- Civil, Mechanical, and Electrical Engineering
- Aerospace and Robotics

---

**⭐ If you find this project useful, please star it on GitHub!**

Made with ❤️ for the geospatial and engineering community in Italy 🇮🇹
