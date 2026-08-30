import asyncio
import random
import hashlib
import re
from fastapi import HTTPException

# Common Indian car models for more realistic data
CAR_MODELS = [
    "Hyundai i20 Asta", "Maruti Swift VXI", "Honda City ZX", 
    "Tata Nexon XZA+", "Kia Seltos HTX", "Mahindra XUV700 AX7",
    "Toyota Innova Crysta", "Volkswagen Polo GT", "Skoda Slavia Style"
]

# State codes mapping
STATE_CODES = {
    "MH": "Maharashtra", "DL": "Delhi", "KA": "Karnataka", 
    "UP": "Uttar Pradesh", "GJ": "Gujarat", "TN": "Tamil Nadu",
    "TS": "Telangana", "HR": "Haryana", "WB": "West Bengal",
    "RJ": "Rajasthan"
}

def _validate_plate(plate: str):
    """Basic validation for Indian number plate formats"""
    # e.g., MH01AB1234 or DL10C4455
    pattern = re.compile(r"^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$")
    if not pattern.match(plate):
        raise HTTPException(status_code=400, detail="Invalid Indian Vehicle Registration Number format. Expected format: MH01AB1234")

async def _fetch_vahan(plate: str, rng: random.Random):
    await asyncio.sleep(rng.uniform(0.3, 0.6))
    
    state_code = plate[:2]
    rto_state = STATE_CODES.get(state_code, "Unknown State")
    
    return {
        "status": "SUCCESS",
        "source": "VAHAN_REGISTRY",
        "data": {
            "owner_name": f"{rng.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}**** {rng.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}*****",
            "registration_date": f"{rng.randint(2010, 2023)}-0{rng.randint(1,9)}-{rng.randint(10,28)}",
            "vehicle_class": "Motor Car (LMV)",
            "make_model": rng.choice(CAR_MODELS),
            "fuel_type": rng.choice(["PETROL", "DIESEL", "CNG", "ELECTRIC"]),
            "rto": f"{state_code}-{rng.randint(1, 40):02d}, {rto_state}",
            "fitness_upto": f"{rng.randint(2024, 2038)}-05-11",
            "puc_upto": f"2024-{rng.randint(10,12)}-{rng.randint(10,28)}" if rng.random() > 0.1 else "EXPIRED",
            "insurance_upto": f"2024-05-11",
            "hypothecation": rng.choice(["HDFC BANK LTD", "ICICI BANK LTD", "SBI AUTO LOANS", "KOTAK MAHINDRA PRIME"]) if rng.random() > 0.5 else "NONE"
        }
    }

async def _fetch_iib(plate: str, rng: random.Random):
    await asyncio.sleep(rng.uniform(0.4, 0.8))
    # 25% chance of having an accident history
    has_accident = rng.random() > 0.75
    if "MH01AB1234" in plate:
        has_accident = True 
    
    if has_accident:
        claim_type = rng.choice(["MAJOR_ACCIDENT", "FLOOD_DAMAGE", "FIRE_DAMAGE"])
        status = "TOTAL_LOSS_SALVAGE" if rng.random() > 0.7 or "MH01AB1234" in plate else "REPAIRED"
        amount = rng.randint(45000, 350000)
        
        return {
            "status": "WARNING",
            "source": "IIB_INSURANCE",
            "data": {
                "claims_history": [
                    {
                        "date": f"{rng.randint(2018, 2023)}-08-22", 
                        "type": claim_type, 
                        "amount": amount, 
                        "status": status
                    }
                ]
            }
        }
    return {"status": "CLEAR", "source": "IIB_INSURANCE", "data": {"claims_history": []}}

async def _fetch_ncrb(plate: str, rng: random.Random):
    await asyncio.sleep(rng.uniform(0.2, 0.5))
    # Extremely low chance of being stolen (2%), unless it's the test plate
    is_stolen = rng.random() > 0.98
    if "MH01AB1234" in plate:
        is_stolen = True
        
    if is_stolen:
        return {
            "status": "CRITICAL",
            "source": "NCRB_CRIME_RECORDS",
            "data": {
                "stolen_status": "ACTIVE_FIR",
                "fir_details": f"FIR/{rng.randint(2015, 2023)}/{plate[:2]}/{rng.randint(10,999)} - Vehicle reported stolen."
            }
        }
    return {"status": "CLEAR", "source": "NCRB_CRIME_RECORDS", "data": {"stolen_status": "NOT_REPORTED"}}

async def _fetch_echallan(plate: str, rng: random.Random):
    await asyncio.sleep(rng.uniform(0.3, 0.7))
    # Random challans (40% chance of having pending challans)
    has_challan = rng.random() > 0.6
    challan_count = rng.randint(1, 5) if has_challan else 0
    total_amount = (rng.randint(500, 2000) * challan_count) if has_challan else 0
    
    if "MH01AB1234" in plate:
        challan_count = 5
        total_amount = 12500

    return {
        "status": "SUCCESS" if challan_count == 0 else "WARNING",
        "source": "NIC_ECHALLAN",
        "data": {
            "pending_challans": challan_count,
            "total_pending_amount": total_amount
        }
    }

async def get_mock_vehicle_data(plate: str):
    """
    Simulates the 'Aggregation Protocol' hitting 4 different data sources concurrently.
    Now uses seeded randomness based on the plate number, so queries are idempotent.
    """
    plate = plate.upper().strip().replace(" ", "")
    
    # Validate plate format
    _validate_plate(plate)
    
    # Create a seeded random number generator based on the plate
    # This ensures that searching "DL4CAF4943" always returns the exact same mock data.
    seed = int(hashlib.md5(plate.encode()).hexdigest(), 16)
    rng = random.Random(seed)
    
    # Run all API calls concurrently
    vahan, iib, ncrb, echallan = await asyncio.gather(
        _fetch_vahan(plate, rng),
        _fetch_iib(plate, rng),
        _fetch_ncrb(plate, rng),
        _fetch_echallan(plate, rng)
    )

    # Determine overall risk score based on the aggregated data
    risk_score = 0
    if ncrb["status"] == "CRITICAL":
        risk_score += 100
    if iib["status"] == "WARNING":
        risk_score += 70
    if vahan["data"]["hypothecation"] != "NONE":
        risk_score += 30
    if echallan["data"]["pending_challans"] > 0:
        risk_score += (echallan["data"]["pending_challans"] * 5)
        
    risk_score = min(100, risk_score)
    
    # Calculate a simple grade
    if risk_score > 70:
        grade = "D (DO NOT BUY)"
    elif risk_score > 40:
        grade = "C (HIGH RISK)"
    elif risk_score > 20:
        grade = "B (MODERATE RISK)"
    else:
        grade = "A (CLEAN)"

    return {
        "plate": plate,
        "summary": {
            "risk_score": risk_score,
            "grade": grade,
        },
        "registry": vahan,
        "insurance": iib,
        "crime": ncrb,
        "traffic": echallan
    }
