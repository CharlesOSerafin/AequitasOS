from typing import List

from fastapi import APIRouter, Depends # type: ignore
from sqlalchemy.orm import Session # type: ignore

from app.db.session import SessionLocal
from app.models.user import User
from app.models.workout import Workout
from app.schemas.workout import WorkoutCreate, WorkoutRead
from app.security.dependencies import get_current_user

router = APIRouter(prefix="/workouts", tags=["workouts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=WorkoutRead)
def create_workout(
    workout_data: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = Workout(
        user_id=current_user.id,
        workout_type=workout_data.workout_type,
        duration_minutes=workout_data.duration_minutes,
        distance_meters=workout_data.distance_meters,
        intensity_rpe=workout_data.intensity_rpe,
        notes=workout_data.notes,
    )

    db.add(workout)
    db.commit()
    db.refresh(workout)

    return workout

@router.get("/", response_model=List[WorkoutRead])
def get_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).all()