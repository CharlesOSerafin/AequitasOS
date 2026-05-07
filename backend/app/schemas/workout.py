from typing import Optional
from pydantic import BaseModel # type: ignore

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

    class Config:
        from_attributes = True