from typing import List

from fastapi import APIRouter, Depends, HTTPException, status # type: ignore
from sqlalchemy.orm import Session # type: ignore

from app.db.session import SessionLocal
from app.models.goal import Goal
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalRead
from app.security.dependencies import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=GoalRead)
def create_goal(
    goal_data: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = Goal(
        user_id=current_user.id,
        goal_type=goal_data.goal_type,
        title=goal_data.title,
        target_value=goal_data.target_value,
        current_value=goal_data.current_value,
        unit=goal_data.unit,
    )

    db.add(goal)
    db.commit()
    db.refresh(goal)

    return goal

@router.get("/", response_model=List[GoalRead])
def get_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).order_by(Goal.created_at.desc()).all()

@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()

    if goal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )

    db.delete(goal)
    db.commit()

    return {"message": "Goal deleted"}