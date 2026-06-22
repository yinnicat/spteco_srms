from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
from routers.auth import get_current_user, require_roles
import models
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter(prefix="/students", tags=["Students"])

# ─── Schemas ───────────────────────────────────────────────────────────────────

class NextOfKinSchema(BaseModel):
    name: str
    surname: str
    relation: str
    tel_no: Optional[str] = None
    cell_no: Optional[str] = None
    email: Optional[str] = None

class StudentCreate(BaseModel):
    first_name: str
    other_name: Optional[str] = None
    last_name: str
    gender: Optional[str] = None
    dob: Optional[date] = None
    place_of_birth: Optional[str] = None
    nationality: Optional[str] = None
    omang: Optional[str] = None
    passport: Optional[str] = None
    email: Optional[str] = None
    tel_no: Optional[str] = None
    cell_no: Optional[str] = None
    address: Optional[str] = None
    admission_date: Optional[date] = None
    academic_qualifications: Optional[str] = None
    prof_qualification: Optional[str] = None
    disability: Optional[str] = None
    sen: Optional[bool] = False
    ovc: Optional[bool] = False
    english_grade: Optional[str] = None
    maths_grade: Optional[str] = None
    science_grade: Optional[str] = None
    technology_grade: Optional[str] = None
    technical_maths_grade: Optional[str] = None
    technical_drawing_grade: Optional[str] = None
    practical_grade: Optional[str] = None
    associated_studies_grade: Optional[str] = None
    other_subjects_summary: Optional[str] = None
    relevant_experience: Optional[str] = None
    next_of_kin: Optional[NextOfKinSchema] = None

class StudentUpdate(StudentCreate):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class StudentStatusUpdate(BaseModel):
    status: str

# ─── Helper ────────────────────────────────────────────────────────────────────

def generate_student_no(db: Session):
    from datetime import datetime
    year = datetime.now().year
    count = db.query(models.Student).count() + 1
    return f"SPT{year}-{count:04d}"

def format_student(student):
    nok = student.next_of_kin[0] if student.next_of_kin else None
    return {
        "id": student.id,
        "student_no": student.student_no,
        "first_name": student.first_name,
        "other_name": student.other_name,
        "last_name": student.last_name,
        "gender": student.gender,
        "dob": student.dob,
        "place_of_birth": student.place_of_birth,
        "nationality": student.nationality,
        "omang": student.omang,
        "passport": student.passport,
        "email": student.email,
        "tel_no": student.tel_no,
        "cell_no": student.cell_no,
        "address": student.address,
        "admission_date": student.admission_date,
        "academic_qualifications": student.academic_qualifications,
        "prof_qualification": student.prof_qualification,
        "disability": student.disability,
        "sen": student.sen,
        "ovc": student.ovc,
        "status": student.status,
        "english_grade": student.english_grade,
        "maths_grade": student.maths_grade,
        "science_grade": student.science_grade,
        "technology_grade": student.technology_grade,
        "technical_maths_grade": student.technical_maths_grade,
        "technical_drawing_grade": student.technical_drawing_grade,
        "practical_grade": student.practical_grade,
        "associated_studies_grade": student.associated_studies_grade,
        "other_subjects_summary": student.other_subjects_summary,
        "relevant_experience": student.relevant_experience,
        "created_at": student.created_at,
        "next_of_kin": {
            "name": nok.name,
            "surname": nok.surname,
            "relation": nok.relation,
            "tel_no": nok.tel_no,
            "cell_no": nok.cell_no,
            "email": nok.email,
        } if nok else None
    }

# ─── Routes ────────────────────────────────────────────────────────────────────

@router.get("/")
def get_students(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    sen: Optional[bool] = Query(None),
    ovc: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    query = db.query(models.Student)
    if search:
        query = query.filter(or_(
            models.Student.first_name.ilike(f"%{search}%"),
            models.Student.last_name.ilike(f"%{search}%"),
            models.Student.student_no.ilike(f"%{search}%"),
            models.Student.omang.ilike(f"%{search}%"),
        ))
    if status:
        query = query.filter(models.Student.status == status)
    if sen is not None:
        query = query.filter(models.Student.sen == sen)
    if ovc is not None:
        query = query.filter(models.Student.ovc == ovc)
    total = query.count()
    students = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "students": [format_student(s) for s in students]
    }

@router.get("/{student_id}")
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return format_student(student)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_student(
    data: StudentCreate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    student = models.Student(
        student_no=generate_student_no(db),
        **{k: v for k, v in data.dict(exclude={"next_of_kin"}).items()}
    )
    db.add(student)
    db.flush()
    if data.next_of_kin:
        nok = models.NextOfKin(student_id=student.id, **data.next_of_kin.dict())
        db.add(nok)
    db.commit()
    db.refresh(student)
    return format_student(student)

@router.put("/{student_id}")
def update_student(
    student_id: int,
    data: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in data.dict(exclude_unset=True, exclude={"next_of_kin"}).items():
        setattr(student, key, value)
    if data.next_of_kin:
        if student.next_of_kin:
            nok = student.next_of_kin[0]
            for key, value in data.next_of_kin.dict(exclude_unset=True).items():
                setattr(nok, key, value)
        else:
            nok = models.NextOfKin(student_id=student.id, **data.next_of_kin.dict())
            db.add(nok)
    db.commit()
    db.refresh(student)
    return format_student(student)

@router.patch("/{student_id}/status")
def update_student_status(
    student_id: int,
    data: StudentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    allowed = ["Active", "Inactive", "Graduated", "Suspended", "Withdrawn"]
    if data.status not in allowed:
        raise HTTPException(status_code=400, detail=f"Status must be one of {allowed}")
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.status = data.status
    db.commit()
    return {"message": f"Student status updated to {data.status}"}