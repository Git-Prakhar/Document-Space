from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/save-source")
async def save_source(file: UploadFile = File(...)):
    try:
        with open(f"source_data/{file.filename}", "wb") as f:
            content = await file.read()
            f.write(content)
        return JSONResponse(content={"message": "File saved successfully"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"message": f"Error saving file: {str(e)}"}, status_code=500)