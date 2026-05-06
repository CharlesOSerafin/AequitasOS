from fastapi import FastAPI

app = FastAPI(title="Aequitas API")

@app.get("/")
def root():
    return {"message": "Aequitas API running"}