from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json

app = FastAPI()

# CORS allow all origin:

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/get-initial-data")
def get_data():
    models_path = Path(__file__).parent / "data" / "MODELS.json"
    with open(models_path, "r") as f:
        models_data = json.load(f)

    return {"models": models_data["models"]}