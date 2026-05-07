from typing import Optional
from datetime import datetime
from pydantic import BaseModel # type: ignore

class GoalCreate(BaseModel):
    goal_type: str
    title: str
    target_value: float
    current_value: Optional[float] = 0
    unit: str

class GoalRead(BaseModel):
    id: int
    goal_type: str
    title: str
    target_value: float
    current_value: float
    unit: str
    created_at: datetime

    class Config:
        from_attributes = True