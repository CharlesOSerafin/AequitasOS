# AequitasOS

AequitasOS is a secure full-stack athlete training and analytics platform designed for endurance athletes, rowers, runners, cyclists, and strength-focused users.

Built as a portfolio-grade software engineering and cybersecurity project, AequitasOS combines secure authentication, workout tracking, analytics, and cloud-ready infrastructure into a modern training ecosystem.

---

# Project Goals

AequitasOS was designed to demonstrate:

* Full-stack software engineering
* Secure authentication and authorization
* Backend API development
* PostgreSQL database architecture
* Modern frontend development with React/Next.js
* Cybersecurity best practices
* JWT authentication
* Dockerized infrastructure
* Analytics and performance visualization
* Real-world usability for athletes
* Production-style project organization

---

# Current Features

## Backend

* FastAPI REST API
* PostgreSQL database integration
* SQLAlchemy ORM models
* JWT authentication system
* Password hashing with Argon2
* Protected API routes
* Workout tracking endpoints
* Environment variable configuration
* CORS configuration

## Frontend

* Next.js frontend
* React + TypeScript
* Tailwind CSS styling
* Registration flow
* API integration layer
* Mobile-friendly UI foundation

## Security Features

* Argon2 password hashing
* JWT access tokens
* Protected endpoints
* Input validation with Pydantic
* Environment variable secret management
* CORS restrictions
* Secure authentication architecture

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic
* Uvicorn

## Database

* PostgreSQL

## DevOps / Infrastructure

* Docker
* Docker Compose
* GitHub

## Security

* JWT Authentication
* Argon2 Password Hashing
* OAuth2 Password Flow

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
├── .gitignore
└── README.md
```

---

# Planned Features

## Training Features

* Workout creation UI
* Rowing/running/cycling/lifting support
* Training load calculations
* Fatigue and recovery metrics
* Goal planning system
* Weekly training summaries
* Workout history

## Analytics

* Performance dashboards
* Training trend visualization
* Progress graphs
* Recovery analytics
* Volume tracking
* Intensity distribution analysis

## Security & Infrastructure

* Refresh token rotation
* Rate limiting
* Audit logging
* Role-based access control
* HTTPS deployment
* CI/CD pipeline
* Cloud deployment

## Future Integrations

* Garmin API integration
* Strava integration
* Concept2 rowing data sync
* Wearable device support

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
npm run dev
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

* Cybersecurity
* Full-stack engineering
* Data analytics
* Athlete performance tracking
* Modern software architecture

AequitasOS is intended to be both:

1. A genuinely useful daily training platform
2. A professional portfolio project demonstrating modern engineering practices

---

# Development Status

## Current Phase

Core Authentication & Full-Stack Foundation

### Completed

* Repository setup
* Backend architecture
* PostgreSQL integration
* JWT authentication
* User registration
* Protected API routes
* Frontend registration page
* Frontend/backend communication

### In Progress

* Frontend login flow
* Session management
* Workout UI
* Dashboard architecture

---

# License

This project is currently under active personal development.

