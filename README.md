# AequitasOS

AequitasOS is a secure full-stack athlete training and analytics platform designed for endurance athletes, rowers, runners, cyclists, and strength-focused users.

Built as a portfolio-grade software engineering and cybersecurity project, AequitasOS combines secure authentication, workout tracking, analytics, and cloud-ready infrastructure into a modern training ecosystem.

---

# Project Goals

AequitasOS was designed to demonstrate:

- Full-stack software engineering
- Secure authentication and authorization
- Backend API development
- PostgreSQL database architecture
- Modern frontend development with React/Next.js
- Cybersecurity best practices
- JWT authentication
- Dockerized infrastructure
- Analytics and performance visualization
- Real-world usability for athletes
- Production-style project organization

---

# Current Features

## Authentication & Security

- Secure user registration and login
- JWT-based authentication
- Protected API endpoints
- Argon2 password hashing
- OAuth2 password flow
- Environment-based secret configuration
- CORS protection

## Backend

- FastAPI REST API
- PostgreSQL database integration
- SQLAlchemy ORM models
- Workout CRUD architecture
- User-specific workout ownership
- Pydantic validation schemas
- Timestamped workout tracking

## Frontend

- Next.js App Router architecture
- React + TypeScript frontend
- Tailwind CSS UI
- Login and registration flows
- Protected dashboard routes
- Local JWT session persistence
- Responsive dashboard layout

## Analytics

- Workout history tracking
- Total distance calculations
- Training load calculations
- Average RPE analytics
- Training load visualization charts
- Workout type distribution charts

## Infrastructure

- Docker-ready architecture
- Environment configuration examples
- GitHub-integrated workflow
- Development Makefile

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts

## Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- Uvicorn

## Database

- PostgreSQL

## DevOps / Infrastructure

- Docker
- Docker Compose
- GitHub

## Security

- JWT Authentication
- Argon2 Password Hashing
- OAuth2 Password Flow

---

# Project Structure

```text
AequitasOS/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── security/
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── docker-compose.yml
├── Makefile
├── .env.example
└── README.md
```

---

# Planned Features

## Training Features

- Workout creation UI
- Rowing/running/cycling/lifting support
- Training load calculations
- Fatigue and recovery metrics
- Goal planning system
- Weekly training summaries
- Workout history
- PR detection

## Analytics

- Weekly volume trends
- Performance dashboards
- Progress graphs
- Recovery analytics
- Volume tracking
- Intensity distribution analysis
- Rolling averages
- Fatigue scoring
- Performance forecasting

## Security & Infrastructure

- Refresh token rotation
- Rate limiting
- Audit logging
- Role-based access control
- HTTPS deployment
- CI/CD pipeline
- Cloud deployment

## Future Integrations

- Garmin API integration
- Strava integration
- Concept2 rowing data sync
- Wearable device support

---

# Local Development Setup

## Clone Repository

```bash
git clone https://github.com/CharlesOSerafin/AequitasOS.git
cd AequitasOS
```

---

# Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run backend:

```bash
python -m uvicorn app.main:app --reload
```

Backend available at:

```text
http://127.0.0.1:8000
```

Swagger docs:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev -- --port 3001
```

Frontend available at:

```text
http://localhost:3001
```

---

# Authentication Flow

1. User registers account
2. Password securely hashed with Argon2
3. User logs in
4. FastAPI generates JWT token
5. Frontend stores token
6. Protected endpoints validate JWT
7. User accesses secure workout data

---

# Why This Project Exists

As a college athlete and computer science student focused on software security, I wanted to build a real-world application that combines:

- Cybersecurity
- Full-stack engineering
- Data analytics
- Athlete performance tracking
- Modern software architecture

AequitasOS is intended to be both:

1. A genuinely useful daily training platform
2. A professional portfolio project demonstrating modern engineering practices

---

# Engineering Focus

AequitasOS is intentionally designed as a production-style engineering project rather than a tutorial CRUD application.

Key engineering priorities include:

- Secure authentication architecture
- Scalable backend organization
- Clean API separation
- Typed frontend/backend communication
- Modern React state management
- Database normalization
- Analytics computation pipelines
- Visualization systems
- Infrastructure portability
- Real-world usability

The project emphasizes both:

- software engineering quality
- practical value for endurance athletes

---

# Development Status

## Current Phase

Analytics & Performance Platform Development

### Completed

- Repository architecture
- FastAPI backend
- PostgreSQL integration
- JWT authentication
- Secure registration/login
- Protected API routes
- Frontend authentication flow
- Workout logging system
- Workout history dashboard
- Analytics summary cards
- Training load calculations
- Interactive Recharts visualizations
- Workout type analytics
- Docker-ready configuration
- Professional development tooling

### In Progress

- Weekly volume analytics
- Rolling training metrics
- Advanced data visualization
- Recovery/fatigue calculations
- Dashboard refinement
- Mobile responsiveness

### Planned

- Garmin/Strava integration
- Cloud deployment
- CI/CD pipeline
- AI coaching insights
- Team/coach dashboards
- Athlete goal planning
- Recovery scoring engine
- Performance forecasting

---

# License

This project is currently under active personal development.