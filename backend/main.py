from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.mock_vahan import get_mock_vehicle_data

app = FastAPI(title="ClearTitle API", version="1.0.0")

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/vehicle/{plate}")
async def get_vehicle_details(plate: str):
    """
    Fetches aggregated vehicle details from multiple simulated registries (VAHAN, IIB, NCRB, eChallan).
    """
    return await get_mock_vehicle_data(plate)
