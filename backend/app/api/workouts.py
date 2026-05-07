from typing import List

from fastapi import APIRouter, Depends, HTTPException, status # type: ignore
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
    ).order_by(Workout.created_at.desc()).all()

@router.put("/{workout_id}", response_model=WorkoutRead)
def update_workout(
    workout_id: int,
    workout_data: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if workout is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    workout.workout_type = workout_data.workout_type
    workout.duration_minutes = workout_data.duration_minutes
    workout.distance_meters = workout_data.distance_meters
    workout.intensity_rpe = workout_data.intensity_rpe
    workout.notes = workout_data.notes

    db.commit()
    db.refresh(workout)

    return workout

@router.delete("/{workout_id}")
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if workout is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    db.delete(workout)
    db.commit()

    return {"message": "Workout deleted"}