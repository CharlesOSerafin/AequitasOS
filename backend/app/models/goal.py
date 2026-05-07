from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey # type: ignore
from sqlalchemy.sql import func # type: ignore
from sqlalchemy.orm import relationship # type: ignore

from app.db.session import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    goal_type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)

    target_value = Column(Float, nullable=False)
    current_value = Column(Float, default=0)

    unit = Column(String(50), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")