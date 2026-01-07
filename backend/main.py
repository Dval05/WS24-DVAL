import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List

app = FastAPI()

origins = [
    "http://localhost:5173", 
    "http://localhost:4002", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/?appName=Cluster0"

client = AsyncIOMotorClient(MONGO_URI)
db = client.oop          
collection = db.Customers 

class Customer(BaseModel):
    id: int
    fullName: str
    email: str
    type: str
    discount: int
    totalSale: int

def customer_helper(doc) -> dict:
    return {
        "id": doc.get("id"),
        "fullName": doc.get("fullName"),
        "email": doc.get("email"),
        "type": doc.get("type"),
        "discount": doc.get("discount"),
        "totalSale": doc.get("totalSale"),
    }

@app.get("/api/customers", response_model=List[Customer])
async def get_customers():
    customers = []
    async for document in collection.find():
        customers.append(customer_helper(document))
    return customers

if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="static")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    return {"message": "Frontend not found"}