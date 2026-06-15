from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from routers.auth import get_current_user, require_roles
import models
from typing import Optional

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    total_students = db.query(models.Student).count()
    active_students = db.query(models.Student).filter(models.Student.status == "Active").count()
    total_staff = db.query(models.Staff).count()
    total_courses = db.query(models.Course).filter(models.Course.is_active == True).count()
    active_enrolments = db.query(models.Enrolment).filter(models.Enrolment.status == "Active").count()
    uncollected_certificates = db.query(models.CertificateIssuance).filter(
        models.CertificateIssuance.collected == False
    ).count()
    sen_students = db.query(models.Student).filter(
        models.Student.sen == True,
        models.Student.status == "Active"
    ).count()
    ovc_students = db.query(models.Student).filter(
        models.Student.ovc == True,
        models.Student.status == "Active"
    ).count()
    recent_enrolments = db.query(models.Enrolment).order_by(
        models.Enrolment.created_at.desc()
    ).limit(5).all()
    return {
        "total_students": total_students,
        "active_students": active_students,
        "total_staff": total_staff,
        "total_courses": total_courses,
        "active_enrolments": active_enrolments,
        "uncollected_certificates": uncollected_certificates,
        "sen_students": sen_students,
        "ovc_students": ovc_students,
        "recent_enrolments": [
            {
                "id": e.id,
                "student_name": f"{e.student.first_name} {e.student.last_name}",
                "student_no": e.student.student_no,
                "course_name": e.course.course_name,
                "enrolment_date": e.enrolment_date,
                "status": e.status,
            } for e in recent_enrolments
        ]
    }

@router.get("/students-by-course")
def students_by_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    enrolments = db.query(models.Enrolment).filter(
        models.Enrolment.course_id == course_id,
        models.Enrolment.status == "Active"
    ).all()
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    return {
        "course_name": course.course_name if course else None,
        "course_code": course.course_code if course else None,
        "total": len(enrolments),
        "students": [
            {
                "student_id": e.student_id,
                "student_no": e.student.student_no,
                "student_name": f"{e.student.first_name} {e.student.last_name}",
                "enrolment_date": e.enrolment_date,
                "status": e.status,
            } for e in enrolments
        ]
    }

@router.get("/sen-students")
def get_sen_students(
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    students = db.query(models.Student).filter(
        models.Student.sen == True,
        models.Student.status == "Active"
    ).all()
    return {
        "total": len(students),
        "students": [
            {
                "student_id": s.id,
                "student_no": s.student_no,
                "student_name": f"{s.first_name} {s.last_name}",
                "disability": s.disability,
            } for s in students
        ]
    }

@router.get("/ovc-students")
def get_ovc_students(
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    students = db.query(models.Student).filter(
        models.Student.ovc == True,
        models.Student.status == "Active"
    ).all()
    return {
        "total": len(students),
        "students": [
            {
                "student_id": s.id,
                "student_no": s.student_no,
                "student_name": f"{s.first_name} {s.last_name}",
            } for s in students
        ]
    }

@router.get("/uncollected-certificates")
def get_uncollected_certificates(
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(require_roles("Admin", "DB Admin"))
):
    certs = db.query(models.CertificateIssuance).filter(
        models.CertificateIssuance.collected == False
    ).all()
    return {
        "total": len(certs),
        "certificates": [
            {
                "cert_id": c.id,
                "student_name": f"{c.enrolment.student.first_name} {c.enrolment.student.last_name}",
                "student_no": c.enrolment.student.student_no,
                "course_name": c.enrolment.course.course_name,
                "issue_date": c.issue_date,
            } for c in certs
        ]
    }

@router.get("/attendance-report")
def get_attendance_report(
    module_id: int,
    semester: Optional[str] = Query(None),
    academic_year: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        return {"error": "Module not found"}
    session_query = db.query(models.Session).filter(models.Session.module_id == module_id)
    if semester:
        session_query = session_query.filter(models.Session.semester == semester)
    if academic_year:
        session_query = session_query.filter(models.Session.academic_year == academic_year)
    sessions = session_query.all()
    session_ids = [s.id for s in sessions]
    total_hours = sum(float(s.duration_hours) for s in sessions)
    students = db.query(models.Student).join(
        models.Enrolment, models.Enrolment.student_id == models.Student.id
    ).filter(
        models.Enrolment.course_id == module.course_id,
        models.Enrolment.status == "Active"
    ).all()
    report = []
    for student in students:
        attended = db.query(models.Attendance).filter(
            models.Attendance.session_id.in_(session_ids),
            models.Attendance.student_id == student.id,
            models.Attendance.status.in_(["Present", "Late"])
        ).all()
        hours_attended = sum(
            float(next(s.duration_hours for s in sessions if s.id == a.session_id))
            for a in attended
        )
        percentage = round((hours_attended / total_hours * 100), 1) if total_hours > 0 else 0
        report.append({
            "student_id": student.id,
            "student_no": student.student_no,
            "student_name": f"{student.first_name} {student.last_name}",
            "hours_attended": hours_attended,
            "total_hours": total_hours,
            "attendance_percentage": percentage,
            "attendance_threshold": float(module.attendance_threshold),
            "at_risk": hours_attended < float(module.attendance_threshold),
        })
    return {
        "module_name": module.module_name,
        "module_code": module.module_code,
        "semester": semester,
        "academic_year": academic_year,
        "total_sessions": len(sessions),
        "total_hours": total_hours,
        "students": sorted(report, key=lambda x: x["attendance_percentage"])
    }