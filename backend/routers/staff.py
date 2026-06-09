from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
from routers.auth import get_current_user, require_roles
import models
import bcrypt
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter(prefix="/staff", tags=["Staff"])

class StaffCreate(BaseModel):
    first_name: str
    last_name: str
    gender: Optional[str] = None
    dob: Optional[date] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    employment_date: Optional[date] = None
    department_id: Optional[int] = None
    status: Optional[str] = "Active"

class StaffUpdate(StaffCreate):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserAccountCreate(BaseModel):
    username: str
    password: str
    role: str

def generate_staff_no(db: Session):
    count = db.query(models.Staff).count() + 1
    return f"SPS-{count:03d}"

def format_staff(staff):
    return {
        "id": staff.id,
        "staff_no": staff.staff_no,
        "first_name": staff.first_name,
        "last_name": staff.last_name,
        "gender": staff.gender,
        "dob": staff.dob,
        "email": staff.email,
        "phone": staff.phone,
        "address": staff.address,
        "employment_date": staff.employment_date,
        "department_id": staff.department_id,
        "department": staff.department.name if staff.department else None,
        "status": staff.status,
        "has_account": staff.user_account is not None,
        "role": staff.user_account.role if staff.user_account else None,
    }

@router.get("/")
def get_staff(
    search: Optional[str] = Query(None),
    department_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    query = db.query(models.Staff)
    if search:
        query = query.filter(
            models.Staff.first_name.ilike(f"%{search}%") |
            models.Staff.last_name.ilike(f"%{search}%") |
            models.Staff.staff_no.ilike(f"%{search}%")
        )
    if department_id:
        query = query.filter(models.Staff.department_id == department_id)
    if status:
        query = query.filter(models.Staff.status == status)
    return [format_staff(s) for s in query.all()]

@router.get("/{staff_id}")
def get_staff_member(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return format_staff(staff)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_staff(
    data: StaffCreate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    staff = models.Staff(
        staff_no=generate_staff_no(db),
        **data.dict()
    )
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return format_staff(staff)

@router.put("/{staff_id}")
def update_staff(
    staff_id: int,
    data: StaffUpdate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(staff, key, value)
    db.commit()
    db.refresh(staff)
    return format_staff(staff)

@router.patch("/{staff_id}/status")
def update_staff_status(
    staff_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    staff.status = status
    db.commit()
    return {"message": f"Staff status updated to {status}"}

@router.post("/{staff_id}/account", status_code=status.HTTP_201_CREATED)
def create_user_account(
    staff_id: int,
    data: UserAccountCreate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("DB Admin"))
):
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    if staff.user_account:
        raise HTTPException(status_code=400, detail="Staff member already has an account")
    existing = db.query(models.SystemUser).filter(models.SystemUser.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    allowed_roles = ["Admin", "Lecturer", "DB Admin"]
    if data.role not in allowed_roles:
        raise HTTPException(status_code=400, detail=f"Role must be one of {allowed_roles}")
    password_hash = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = models.SystemUser(
        staff_id=staff_id,
        username=data.username,
        password_hash=password_hash,
        role=data.role,
        is_active=True
    )
    db.add(user)
    db.commit()
    return {"message": f"Account created for {staff.first_name} {staff.last_name}", "username": data.username, "role": data.role}