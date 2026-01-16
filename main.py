from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
import os, json, hashlib, secrets

app = FastAPI()
security = HTTPBasic()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def hash_pw(pw: str):
    return hashlib.sha256(pw.encode()).hexdigest()

def load_users():
    with open("users.json","r") as f:
        return json.load(f)

def auth(credentials: HTTPBasicCredentials = Depends(security)):
    users = load_users()
    user = users.get(credentials.username)
    if not user or not secrets.compare_digest(
        user["pw"], hash_pw(credentials.password)
    ):
        raise HTTPException(status_code=401)
    return credentials.username

@app.post("/upload-folder")
async def upload_folder(
    files: list[UploadFile] = File(...),
    username: str = Depends(auth)
):
    user_dir = os.path.join(UPLOAD_DIR, username)
    os.makedirs(user_dir, exist_ok=True)

    for file in files:
        path = os.path.join(user_dir, file.filename)
        with open(path, "wb") as f:
            f.write(await file.read())

    return {"status": "ok"}

@app.get("/files")
def list_files(username: str = Depends(auth)):
    user_dir = os.path.join(UPLOAD_DIR, username)
    if not os.path.exists(user_dir):
        return []
    return os.listdir(user_dir)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
