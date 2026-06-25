from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
from routers.auth import get_current_user, require_roles
import models
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter(prefix="/certificates", tags=["Certificates"])

class CertificateCollect(BaseModel):
    collection_date: Optional[date] = None
    confirmed_by: Optional[int] = None
    notes: Optional[str] = None

def format_certificate(c):
    return {
        "id": c.id,
        "enrolment_id": c.enrolment_id,
        "student_name": f"{c.enrolment.student.first_name} {c.enrolment.student.last_name}" if c.enrolment and c.enrolment.student else None,
        "student_no": c.enrolment.student.student_no if c.enrolment and c.enrolment.student else None,
        "course_name": c.enrolment.course.course_name if c.enrolment and c.enrolment.course else None,
        "issue_date": c.issue_date,
        "collected": c.collected,
        "collection_date": c.collection_date,
        "confirmed_by": c.confirmed_by,
        "confirmed_by_name": f"{c.confirming_staff.first_name} {c.confirming_staff.last_name}" if c.confirming_staff else None,
        "notes": c.notes,
        "created_at": c.created_at,
    }

def auto_issue_certificate(enrolment_id: int, db: Session):
    """Auto-issue a certificate when an enrolment is marked Completed."""
    existing = db.query(models.CertificateIssuance).filter(
        models.CertificateIssuance.enrolment_id == enrolment_id
    ).first()
    if existing:
        return  # Already issued
    cert = models.CertificateIssuance(
        enrolment_id=enrolment_id,
        issue_date=date.today(),
        collected=False,
    )
    db.add(cert)
    # Don't commit here — caller handles the transaction

@router.get("/")
def get_certificates(
    collected: Optional[bool] = Query(None),
    student_id: Optional[int] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    query = db.query(models.CertificateIssuance)
    if collected is not None:
        query = query.filter(models.CertificateIssuance.collected == collected)
    if student_id:
        query = query.join(models.Enrolment).filter(models.Enrolment.student_id == student_id)
    total = query.count()
    certs = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "certificates": [format_certificate(c) for c in certs]
    }

@router.get("/uncollected")
def get_uncollected(
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    certs = db.query(models.CertificateIssuance).filter(
        models.CertificateIssuance.collected == False
    ).all()
    return [format_certificate(c) for c in certs]

@router.get("/{cert_id}")
def get_certificate(
    cert_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    c = db.query(models.CertificateIssuance).filter(models.CertificateIssuance.id == cert_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return format_certificate(c)

@router.patch("/{cert_id}/collect")
def mark_collected(
    cert_id: int,
    data: CertificateCollect,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    c = db.query(models.CertificateIssuance).filter(models.CertificateIssuance.id == cert_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Certificate not found")
    if c.collected:
        raise HTTPException(status_code=400, detail="Certificate already marked as collected")
    c.collected = True
    c.collection_date = data.collection_date or date.today()
    if data.confirmed_by:
        staff = db.query(models.Staff).filter(models.Staff.id == data.confirmed_by).first()
        if not staff:
            raise HTTPException(status_code=404, detail="Confirming staff member not found")
        c.confirmed_by = data.confirmed_by
    if data.notes:
        c.notes = data.notes
    db.commit()
    db.refresh(c)
    return format_certificate(c)

@router.patch("/{cert_id}/uncollect")
def mark_uncollected(
    cert_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    """Undo a collection mark in case of error."""
    c = db.query(models.CertificateIssuance).filter(models.CertificateIssuance.id == cert_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Certificate not found")
    c.collected = False
    c.collection_date = None
    c.confirmed_by = None
    db.commit()
    db.refresh(c)
    return format_certificate(c)