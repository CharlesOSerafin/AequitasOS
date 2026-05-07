from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class WorkoutCreate(BaseModel):
    workout_type: str
    duration_minutes: float
    distance_meters: Optional[float] = None
    intensity_rpe: Optional[float] = None
    notes: Optional[str] = None

class WorkoutRead(BaseModel):
    id: int
    workout_type: str
    duration_minutes: float
    distance_meters: Optional[float]
    intensity_rpe: Optional[float]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True