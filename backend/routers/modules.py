from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
from routers.auth import get_current_user, require_roles
import models
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

router = APIRouter(prefix="/modules", tags=["Modules"])

class ModuleCreate(BaseModel):
    course_id: int
    module_code: str
    module_name: str
    required_hours: Decimal
    attendance_threshold: Decimal

class ModuleUpdate(BaseModel):
    module_code: Optional[str] = None
    module_name: Optional[str] = None
    required_hours: Optional[Decimal] = None
    attendance_threshold: Optional[Decimal] = None
    is_active: Optional[bool] = None

class ModuleAssignmentCreate(BaseModel):
    lecturer_id: int
    academic_year: str
    semester: Optional[str] = None

def format_module(m):
    active_assignment = next((a for a in m.assignments if a.is_active), None)
    return {
        "id": m.id,
        "course_id": m.course_id,
        "course_name": m.course.course_name if m.course else None,
        "course_code": m.course.course_code if m.course else None,
        "module_code": m.module_code,
        "module_name": m.module_name,
        "required_hours": float(m.required_hours),
        "attendance_threshold": float(m.attendance_threshold),
        "is_active": m.is_active,
        "created_at": m.created_at,
        "current_lecturer": {
            "id": active_assignment.lecturer.id,
            "name": f"{active_assignment.lecturer.first_name} {active_assignment.lecturer.last_name}",
            "academic_year": active_assignment.academic_year,
            "semester": active_assignment.semester,
        } if active_assignment else None,
        "assignment_history": [
            {
                "id": a.id,
                "lecturer_id": a.lecturer_id,
                "lecturer_name": f"{a.lecturer.first_name} {a.lecturer.last_name}",
                "academic_year": a.academic_year,
                "semester": a.semester,
                "is_active": a.is_active,
            } for a in m.assignments
        ]
    }

@router.get("/")
def get_modules(
    course_id: Optional[int] = Query(None),
    is_active: Optional[bool] = Query(None),
    lecturer_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    query = db.query(models.Module)

    if course_id:
        query = query.filter(models.Module.course_id == course_id)
    if is_active is not None:
        query = query.filter(models.Module.is_active == is_active)

    # If lecturer_id provided — filter by assignment
    # If current user is a Lecturer and no lecturer_id specified — auto-filter by their own staff_id
    effective_lecturer_id = lecturer_id
    if not effective_lecturer_id and current_user.role == "Lecturer":
        effective_lecturer_id = current_user.staff_id

    if effective_lecturer_id:
        query = query.join(
            models.ModuleAssignment,
            models.ModuleAssignment.module_id == models.Module.id
        ).filter(
            models.ModuleAssignment.lecturer_id == effective_lecturer_id,
            models.ModuleAssignment.is_active == True
        )

    return [format_module(m) for m in query.order_by(models.Module.module_name).all()]

@router.get("/{module_id}")
def get_module(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    m = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Module not found")
    return format_module(m)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_module(
    data: ModuleCreate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    course = db.query(models.Course).filter(models.Course.id == data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    existing = db.query(models.Module).filter(models.Module.module_code == data.module_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Module code already exists")
    if data.attendance_threshold > data.required_hours:
        raise HTTPException(status_code=400, detail="Attendance threshold cannot exceed required hours")
    module = models.Module(**data.dict())
    db.add(module)
    db.commit()
    db.refresh(module)
    return format_module(module)

@router.put("/{module_id}")
def update_module(
    module_id: int,
    data: ModuleUpdate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    m = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Module not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(m, key, value)
    db.commit()
    db.refresh(m)
    return format_module(m)

@router.post("/{module_id}/assign", status_code=status.HTTP_201_CREATED)
def assign_lecturer(
    module_id: int,
    data: ModuleAssignmentCreate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    lecturer = db.query(models.Staff).filter(models.Staff.id == data.lecturer_id).first()
    if not lecturer:
        raise HTTPException(status_code=404, detail="Lecturer not found")
    if not data.academic_year.isdigit() or len(data.academic_year) != 4:
        raise HTTPException(status_code=400, detail="Academic year must be a 4-digit year e.g. 2026")

    # Deactivate current active assignment
    current = db.query(models.ModuleAssignment).filter(
        models.ModuleAssignment.module_id == module_id,
        models.ModuleAssignment.is_active == True
    ).first()
    if current:
        current.is_active = False

    assignment = models.ModuleAssignment(
        module_id=module_id,
        lecturer_id=data.lecturer_id,
        academic_year=data.academic_year,
        semester=data.semester,
        is_active=True
    )
    db.add(assignment)
    db.commit()
    db.refresh(module)
    return format_module(module)

@router.post("/{module_id}/assign-additional", status_code=status.HTTP_201_CREATED)
def assign_additional_lecturer(
    module_id: int,
    data: ModuleAssignmentCreate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    """Add an additional lecturer to a module without replacing the current one.
    Use this for team teaching or substitutes."""
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    lecturer = db.query(models.Staff).filter(models.Staff.id == data.lecturer_id).first()
    if not lecturer:
        raise HTTPException(status_code=404, detail="Lecturer not found")

    # Check if already assigned
    existing = db.query(models.ModuleAssignment).filter(
        models.ModuleAssignment.module_id == module_id,
        models.ModuleAssignment.lecturer_id == data.lecturer_id,
        models.ModuleAssignment.is_active == True
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Lecturer already assigned to this module")

    assignment = models.ModuleAssignment(
        module_id=module_id,
        lecturer_id=data.lecturer_id,
        academic_year=data.academic_year,
        semester=data.semester,
        is_active=True
    )
    db.add(assignment)
    db.commit()
    db.refresh(module)
    return format_module(module)

@router.delete("/{module_id}/assign/{assignment_id}")
def remove_assignment(
    module_id: int,
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    """Deactivate a specific lecturer assignment — use this to remove a substitute."""
    assignment = db.query(models.ModuleAssignment).filter(
        models.ModuleAssignment.id == assignment_id,
        models.ModuleAssignment.module_id == module_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    assignment.is_active = False
    db.commit()
    return {"message": "Assignment removed"}

@router.get("/{module_id}/assignments")
def get_assignment_history(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return [
        {
            "id": a.id,
            "lecturer_id": a.lecturer_id,
            "lecturer_name": f"{a.lecturer.first_name} {a.lecturer.last_name}",
            "academic_year": a.academic_year,
            "semester": a.semester,
            "is_active": a.is_active,
            "created_at": a.created_at,
        } for a in module.assignments
    ]