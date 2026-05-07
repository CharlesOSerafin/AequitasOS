from sqlalchemy import ( # type: ignore
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func # type: ignore
from sqlalchemy.orm import relationship # type: ignore

from app.db.session import Base

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    workout_type = Column(String(50), nullable=False)

    duration_minutes = Column(Float, nullable=False)

    distance_meters = Column(Float, nullable=True)

    intensity_rpe = Column(Float, nullable=True)

    notes = Column(String(1000), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("User")