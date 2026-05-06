from fastapi import FastAPI # type: ignore

app = FastAPI(title="Aequitas API")

@app.get("/")
def root():
    return {"message": "Aequitas API running"}