.PHONY: backend frontend db-up db-down install-backend install-frontend

backend:
	cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload

frontend:
	cd frontend && npm run dev -- --port 3001

db-up:
	docker compose up -d

db-down:
	docker compose down

install-backend:
	cd backend && source venv/bin/activate && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install