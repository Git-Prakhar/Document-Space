from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os


# ------ Initial setup: Create source_data directory if it doesn't exist ------
def initial_check():
    print("Performing initial check...")
    import os
    if not os.path.exists("source_data"):
        print("Creating source_data directory...")
        os.makedirs("source_data")

initial_check()
#---------------------------------------------------------------------------


# ------ Main FastAPI app setup ------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


"""
const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("type", type);
    formdata.append("chat_id", chatId);

formdata will be recieved from the frontend
"""
@app.post("/save-source")
async def save_source(file: UploadFile = File(...), chat_id: str = Form(...)):
    print(f"Received file: {file.filename} for chat_id: {chat_id}")
    try:
        if chat_id is None or chat_id.strip() == "":
            return JSONResponse(content={"message": "chat_id is required"}, status_code=500)
        
        if not os.path.exists(f"source_data/{chat_id}"):
            os.makedirs(f"source_data/{chat_id}")

        with open(f"source_data/{chat_id}/{file.filename}", "wb") as f:
            content = await file.read()
            f.write(content)
        return JSONResponse(content={"message": "File saved successfully"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"message": f"Error saving file: {str(e)}"}, status_code=500)