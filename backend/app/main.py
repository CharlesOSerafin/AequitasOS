from fastapi import FastAPI # type: ignore
from sqlalchemy import text # type: ignore
from app.db.session import engine
from app.api.auth import router as auth_router
from app.api.workouts import router as workouts_router
from app.models.user import User
from app.security.dependencies import get_current_user

from fastapi import FastAPI, Depends # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from sqlalchemy import text # type: ignore

app = FastAPI(title="Aequitas API")

app.add_middleware(
    CORSMiddleware, # type: ignore
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(workouts_router)

@app.get("/")
def root():
    return {"message": "Aequitas API running"}

@app.get("/db-test")
def db_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database": "connected", "result": result.scalar()}

@app.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)): # type: ignore
    return {
        "email": current_user.email,
        "first_name": current_user.first_name,
    }