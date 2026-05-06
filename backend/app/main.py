from fastapi import FastAPI
from sqlalchemy import text
from app.db.session import engine
from app.api.auth import router as auth_router

app = FastAPI(title="Aequitas API")

app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Aequitas API running"}

@app.get("/db-test")
def db_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database": "connected", "result": result.scalar()}