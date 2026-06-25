from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from database import get_db
from routers.auth import get_current_user, require_roles
import models
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter(prefix="/enrolments", tags=["Enrolments"])

class EnrolmentCreate(BaseModel):
    student_id: int
    course_id: int
    enrolment_date: date
    completion_date: Optional[date] = None
    status: Optional[str] = "Active"

class EnrolmentUpdate(BaseModel):
    completion_date: Optional[date] = None
    status: Optional[str] = None

def format_enrolment(e):
    return {
        "id": e.id,
        "student_id": e.student_id,
        "student_name": f"{e.student.first_name} {e.student.last_name}" if e.student else None,
        "student_no": e.student.student_no if e.student else None,
        "course_id": e.course_id,
        "course_name": e.course.course_name if e.course else None,
        "course_code": e.course.course_code if e.course else None,
        "enrolment_date": e.enrolment_date,
        "completion_date": e.completion_date,
        "status": e.status,
        "created_at": e.created_at,
        "has_certificate": e.certificate is not None,
    }

def sync_student_status(student_id: int, db: Session):
    active_count = db.query(models.Enrolment).filter(
        models.Enrolment.student_id == student_id,
        models.Enrolment.status == "Active"
    ).count()
    if active_count > 0:
        return
    completed_count = db.query(models.Enrolment).filter(
        models.Enrolment.student_id == student_id,
        models.Enrolment.status == "Completed"
    ).count()
    withdrawn_count = db.query(models.Enrolment).filter(
        models.Enrolment.student_id == student_id,
        models.Enrolment.status == "Withdrawn"
    ).count()
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return
    if completed_count > 0:
        student.status = "Completed"
    elif withdrawn_count > 0:
        student.status = "Withdrawn"
    db.commit()

def auto_issue_certificate(enrolment_id: int, db: Session):
    existing = db.query(models.CertificateIssuance).filter(
        models.CertificateIssuance.enrolment_id == enrolment_id
    ).first()
    if existing:
        return
    cert = models.CertificateIssuance(
        enrolment_id=enrolment_id,
        issue_date=date.today(),
        collected=False,
    )
    db.add(cert)

@router.get("/")
def get_enrolments(
    student_id: Optional[int] = Query(None),
    course_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    query = db.query(models.Enrolment).join(
        models.Student, models.Student.id == models.Enrolment.student_id
    ).join(
        models.Course, models.Course.id == models.Enrolment.course_id
    )
    if student_id:
        query = query.filter(models.Enrolment.student_id == student_id)
    if course_id:
        query = query.filter(models.Enrolment.course_id == course_id)
    if status:
        query = query.filter(models.Enrolment.status == status)
    if search:
        query = query.filter(or_(
            models.Student.first_name.ilike(f"%{search}%"),
            models.Student.last_name.ilike(f"%{search}%"),
            models.Student.student_no.ilike(f"%{search}%"),
            models.Course.course_name.ilike(f"%{search}%"),
            models.Course.course_code.ilike(f"%{search}%"),
        ))
    total = query.count()
    enrolments = query.order_by(
        models.Enrolment.created_at.desc()
    ).offset((page - 1) * limit).limit(limit).all()
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "enrolments": [format_enrolment(e) for e in enrolments]
    }

@router.get("/{enrolment_id}")
def get_enrolment(
    enrolment_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    e = db.query(models.Enrolment).filter(models.Enrolment.id == enrolment_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Enrolment not found")
    return format_enrolment(e)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_enrolment(
    data: EnrolmentCreate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    student = db.query(models.Student).filter(models.Student.id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    course = db.query(models.Course).filter(models.Course.id == data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    existing = db.query(models.Enrolment).filter(
        models.Enrolment.student_id == data.student_id,
        models.Enrolment.course_id == data.course_id,
        models.Enrolment.status == "Active"
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student already has an active enrolment in this course")
    if student.status in ("Completed", "Withdrawn"):
        student.status = "Active"
    enrolment = models.Enrolment(**data.dict())
    db.add(enrolment)
    db.commit()
    db.refresh(enrolment)
    return format_enrolment(enrolment)

@router.put("/{enrolment_id}")
def update_enrolment(
    enrolment_id: int,
    data: EnrolmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    e = db.query(models.Enrolment).filter(models.Enrolment.id == enrolment_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Enrolment not found")
    allowed_statuses = ["Active", "Completed", "Withdrawn"]
    if data.status and data.status not in allowed_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {allowed_statuses}")
    student_id = e.student_id
    enrolment_id_ref = e.id
    for key, value in data.dict(exclude_unset=True).items():
        setattr(e, key, value)
    db.commit()
    db.refresh(e)
    if data.status in ("Completed", "Withdrawn"):
        sync_student_status(student_id, db)
    if data.status == "Completed":
        auto_issue_certificate(enrolment_id_ref, db)
        db.commit()
    return format_enrolment(e)