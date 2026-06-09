from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
from routers.auth import get_current_user, require_roles
import models
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

router = APIRouter(prefix="/courses", tags=["Courses"])

class CourseCreate(BaseModel):
    course_code: str
    course_name: str
    course_level: Optional[int] = None
    department_id: Optional[int] = None
    duration_yrs: Optional[Decimal] = None
    programme_type: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = True

class CourseUpdate(CourseCreate):
    course_code: Optional[str] = None
    course_name: Optional[str] = None

def format_course(course):
    return {
        "id": course.id,
        "course_code": course.course_code,
        "course_name": course.course_name,
        "course_level": course.course_level,
        "department_id": course.department_id,
        "department": course.department.name if course.department else None,
        "duration_yrs": float(course.duration_yrs) if course.duration_yrs else None,
        "programme_type": course.programme_type,
        "description": course.description,
        "is_active": course.is_active,
    }

@router.get("/")
def get_courses(
    search: Optional[str] = Query(None),
    department_id: Optional[int] = Query(None),
    programme_type: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    query = db.query(models.Course)
    if search:
        query = query.filter(
            models.Course.course_name.ilike(f"%{search}%") |
            models.Course.course_code.ilike(f"%{search}%")
        )
    if department_id:
        query = query.filter(models.Course.department_id == department_id)
    if programme_type:
        query = query.filter(models.Course.programme_type == programme_type)
    if is_active is not None:
        query = query.filter(models.Course.is_active == is_active)
    return [format_course(c) for c in query.all()]

@router.get("/{course_id}")
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return format_course(course)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    existing = db.query(models.Course).filter(models.Course.course_code == data.course_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Course code already exists")
    if data.department_id:
        dept = db.query(models.Department).filter(models.Department.id == data.department_id).first()
        if not dept:
            raise HTTPException(status_code=404, detail="Department not found")
    course = models.Course(**data.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return format_course(course)

@router.put("/{course_id}")
def update_course(
    course_id: int,
    data: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return format_course(course)