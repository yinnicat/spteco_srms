from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from routers.auth import get_current_user, require_roles
import models
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time, datetime
from decimal import Decimal

router = APIRouter(prefix="/attendance", tags=["Attendance"])

VALID_SEMESTERS = ["Semester 1", "Semester 2", "Inter-semester"]

def get_semester_and_year(session_date: date):
    month = session_date.month
    year = session_date.year
    if month >= 7:
        academic_year = f"{year}/{year + 1}"
        semester = "Semester 1"
    else:
        academic_year = f"{year - 1}/{year}"
        semester = "Semester 2"
    return semester, academic_year

def calculate_duration(start: time, end: time) -> float:
    start_dt = datetime.combine(date.today(), start)
    end_dt = datetime.combine(date.today(), end)
    diff = (end_dt - start_dt).seconds / 3600
    return round(diff, 2)

def calc_at_risk(hours_attended, total_hours, required_hours, threshold_hours):
    """
    At risk based on current attendance rate vs threshold rate.
    Compares proportion attended so far against proportion required.
    Not at risk if no sessions yet.
    """
    if total_hours <= 0 or required_hours <= 0:
        return False
    attended_pct = hours_attended / total_hours
    threshold_pct = threshold_hours / required_hours
    return attended_pct < threshold_pct

class SessionCreate(BaseModel):
    module_id: int
    date: date
    start_time: time
    end_time: time
    room: Optional[str] = None
    semester: Optional[str] = None

class AttendanceRecord(BaseModel):
    student_id: int
    status: str
    notes: Optional[str] = None

class BulkAttendance(BaseModel):
    records: List[AttendanceRecord]

def format_session(s):
    return {
        "id": s.id,
        "module_id": s.module_id,
        "module_name": s.module.module_name if s.module else None,
        "date": s.date,
        "start_time": s.start_time,
        "end_time": s.end_time,
        "duration_hours": float(s.duration_hours),
        "room": s.room,
        "semester": s.semester,
        "academic_year": s.academic_year,
        "marked_by": s.marked_by,
        "created_at": s.created_at,
        "attendance_count": len(s.attendance_records),
    }

# ─── Sessions ──────────────────────────────────────────────────────────────────

@router.get("/sessions")
def get_sessions(
    module_id: Optional[int] = Query(None),
    semester: Optional[str] = Query(None),
    academic_year: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    query = db.query(models.Session)
    if module_id:
        query = query.filter(models.Session.module_id == module_id)
    if semester:
        query = query.filter(models.Session.semester == semester)
    if academic_year:
        query = query.filter(models.Session.academic_year == academic_year)
    return [format_session(s) for s in query.order_by(models.Session.date.desc()).all()]

@router.post("/sessions", status_code=status.HTTP_201_CREATED)
def create_session(
    data: SessionCreate,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    module = db.query(models.Module).filter(models.Module.id == data.module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    if data.end_time <= data.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    auto_semester, auto_academic_year = get_semester_and_year(data.date)
    final_semester = data.semester if data.semester else auto_semester
    if final_semester not in VALID_SEMESTERS:
        raise HTTPException(status_code=400, detail=f"Semester must be one of {VALID_SEMESTERS}")

    duration = calculate_duration(data.start_time, data.end_time)

    session = models.Session(
        module_id=data.module_id,
        date=data.date,
        start_time=data.start_time,
        end_time=data.end_time,
        duration_hours=duration,
        room=data.room,
        semester=final_semester,
        academic_year=auto_academic_year,
        marked_by=current_user.staff_id
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return format_session(session)

@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"message": "Session deleted."}

@router.get("/sessions/{session_id}/students")
def get_students_for_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    students = db.query(models.Student).join(
        models.Enrolment, models.Enrolment.student_id == models.Student.id
    ).filter(
        models.Enrolment.course_id == session.module.course_id,
        models.Enrolment.status == "Active"
    ).all()

    existing_attendance = db.query(models.Attendance).filter(
        models.Attendance.session_id == session_id
    ).all()
    attendance_map = {a.student_id: a.status for a in existing_attendance}

    return {
        "session_id": session_id,
        "module_name": session.module.module_name,
        "date": session.date,
        "semester": session.semester,
        "academic_year": session.academic_year,
        "already_marked": len(existing_attendance) > 0,
        "students": [
            {
                "student_id": s.id,
                "student_no": s.student_no,
                "student_name": f"{s.first_name} {s.last_name}",
                "current_status": attendance_map.get(s.id, "Absent"),
            } for s in students
        ]
    }

# ─── Attendance ────────────────────────────────────────────────────────────────

@router.post("/sessions/{session_id}/mark", status_code=status.HTTP_201_CREATED)
def mark_attendance(
    session_id: int,
    data: BulkAttendance,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    allowed_statuses = ["Present", "Absent", "Late", "Excused"]
    results = []
    for record in data.records:
        if record.status not in allowed_statuses:
            raise HTTPException(status_code=400, detail=f"Status must be one of {allowed_statuses}")
        existing = db.query(models.Attendance).filter(
            models.Attendance.session_id == session_id,
            models.Attendance.student_id == record.student_id
        ).first()
        if existing:
            existing.status = record.status
            existing.notes = record.notes
            existing.marked_by = current_user.staff_id
            results.append(existing)
        else:
            attendance = models.Attendance(
                session_id=session_id,
                student_id=record.student_id,
                status=record.status,
                notes=record.notes,
                marked_by=current_user.staff_id
            )
            db.add(attendance)
            results.append(attendance)
    db.commit()
    return {"message": f"Attendance marked for {len(results)} students"}

@router.get("/sessions/{session_id}/records")
def get_session_attendance(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return [
        {
            "id": a.id,
            "student_id": a.student_id,
            "student_name": f"{a.student.first_name} {a.student.last_name}",
            "student_no": a.student.student_no,
            "status": a.status,
            "notes": a.notes,
            "marked_by": a.marked_by,
            "marked_at": a.marked_at,
        } for a in session.attendance_records
    ]

# ─── Student Attendance Summary ────────────────────────────────────────────────

@router.get("/summary/{student_id}/module/{module_id}")
def get_attendance_summary(
    student_id: int,
    module_id: int,
    semester: Optional[str] = Query(None),
    academic_year: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    session_query = db.query(models.Session).filter(models.Session.module_id == module_id)
    if semester:
        session_query = session_query.filter(models.Session.semester == semester)
    if academic_year:
        session_query = session_query.filter(models.Session.academic_year == academic_year)
    sessions = session_query.all()
    session_ids = [s.id for s in sessions]
    total_hours = sum(float(s.duration_hours) for s in sessions)

    attended = db.query(models.Attendance).filter(
        models.Attendance.session_id.in_(session_ids),
        models.Attendance.student_id == student_id,
        models.Attendance.status.in_(["Present", "Late"])
    ).all()
    hours_attended = sum(
        float(next(s.duration_hours for s in sessions if s.id == a.session_id))
        for a in attended
    )

    required_hours = float(module.required_hours)
    threshold_hours = float(module.attendance_threshold)
    percentage = round((hours_attended / total_hours * 100), 1) if total_hours > 0 else 0

    return {
        "student_id": student_id,
        "student_name": f"{student.first_name} {student.last_name}",
        "student_no": student.student_no,
        "module_id": module_id,
        "module_name": module.module_name,
        "module_code": module.module_code,
        "semester": semester,
        "academic_year": academic_year,
        "total_sessions": len(sessions),
        "total_hours": total_hours,
        "hours_attended": hours_attended,
        "attendance_percentage": percentage,
        "required_hours": required_hours,
        "attendance_threshold": threshold_hours,
        "threshold_percentage": round(threshold_hours / required_hours * 100, 1) if required_hours > 0 else 80,
        "at_risk": calc_at_risk(hours_attended, total_hours, required_hours, threshold_hours),
    }

@router.get("/at-risk")
def get_at_risk_students(
    module_id: Optional[int] = Query(None),
    semester: Optional[str] = Query(None),
    academic_year: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin", "Lecturer"))
):
    modules_query = db.query(models.Module).filter(models.Module.is_active == True)
    if module_id:
        modules_query = modules_query.filter(models.Module.id == module_id)
    modules = modules_query.all()

    at_risk = []
    for module in modules:
        session_query = db.query(models.Session).filter(models.Session.module_id == module.id)
        if semester:
            session_query = session_query.filter(models.Session.semester == semester)
        if academic_year:
            session_query = session_query.filter(models.Session.academic_year == academic_year)
        sessions = session_query.all()
        if not sessions:
            continue

        session_ids = [s.id for s in sessions]
        total_hours = sum(float(s.duration_hours) for s in sessions)
        required_hours = float(module.required_hours)
        threshold_hours = float(module.attendance_threshold)

        students_in_module = db.query(models.Student).join(
            models.Enrolment, models.Enrolment.student_id == models.Student.id
        ).filter(
            models.Enrolment.course_id == module.course_id,
            models.Enrolment.status == "Active"
        ).all()

        for student in students_in_module:
            attended = db.query(models.Attendance).filter(
                models.Attendance.session_id.in_(session_ids),
                models.Attendance.student_id == student.id,
                models.Attendance.status.in_(["Present", "Late"])
            ).all()
            hours_attended = sum(
                float(next(s.duration_hours for s in sessions if s.id == a.session_id))
                for a in attended
            )
            if calc_at_risk(hours_attended, total_hours, required_hours, threshold_hours):
                percentage = round((hours_attended / total_hours * 100), 1) if total_hours > 0 else 0
                at_risk.append({
                    "student_id": student.id,
                    "student_name": f"{student.first_name} {student.last_name}",
                    "student_no": student.student_no,
                    "module_id": module.id,
                    "module_name": module.module_name,
                    "hours_attended": hours_attended,
                    "total_hours": total_hours,
                    "required_hours": required_hours,
                    "attendance_threshold": threshold_hours,
                    "threshold_percentage": round(threshold_hours / required_hours * 100, 1),
                    "attendance_percentage": percentage,
                })
    return at_risk