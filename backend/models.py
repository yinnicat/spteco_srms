from sqlalchemy import Column, Integer, String, Boolean, Date, Numeric, Time, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    is_active = Column(Boolean, default=True)

class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True, index=True)
    staff_no = Column(String(50), nullable=False, unique=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    gender = Column(String(20))
    dob = Column(Date)
    email = Column(String(150))
    phone = Column(String(50))
    address = Column(Text)
    employment_date = Column(Date)
    department_id = Column(Integer, ForeignKey("departments.id"))
    status = Column(String(20), default="Active")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now())
    department = relationship("Department")
    user_account = relationship("SystemUser", back_populates="staff", uselist=False)

class SystemUser(Base):
    __tablename__ = "system_users"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=False, unique=True)
    username = Column(String(100), nullable=False, unique=True)
    password_hash = Column(Text, nullable=False)
    role = Column(String(50), nullable=False)
    last_login = Column(DateTime)
    is_active = Column(Boolean, default=True)
    staff = relationship("Staff", back_populates="user_account")

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    student_no = Column(String(50), nullable=False, unique=True)
    first_name = Column(String(100), nullable=False)
    other_name = Column(String(100))
    last_name = Column(String(100), nullable=False)
    gender = Column(String(20))
    dob = Column(Date)
    place_of_birth = Column(String(150))
    nationality = Column(String(100))
    omang = Column(String(50))
    passport = Column(String(50))
    email = Column(String(150))
    tel_no = Column(String(50))
    cell_no = Column(String(50))
    address = Column(Text)
    admission_date = Column(Date)
    academic_qualifications = Column(Text)
    prof_qualification = Column(String(255))
    disability = Column(String(255))
    sen = Column(Boolean, default=False)
    ovc = Column(Boolean, default=False)
    status = Column(String(20), default="Active")
    english_grade = Column(String(5))
    maths_grade = Column(String(5))
    science_grade = Column(String(5))
    technology_grade = Column(String(5))
    technical_maths_grade = Column(String(5))
    technical_drawing_grade = Column(String(5))
    practical_grade = Column(String(5))
    associated_studies_grade = Column(String(5))
    other_subjects_summary = Column(Text)
    relevant_experience = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now())
    next_of_kin = relationship("NextOfKin", back_populates="student")
    enrolments = relationship("Enrolment", back_populates="student")

class NextOfKin(Base):
    __tablename__ = "next_of_kin"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    relation = Column(String(50), nullable=False)
    tel_no = Column(String(50))
    cell_no = Column(String(50))
    email = Column(String(150))
    student = relationship("Student", back_populates="next_of_kin")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String(50), nullable=False, unique=True)
    course_name = Column(String(255), nullable=False)
    course_level = Column(Integer)
    department_id = Column(Integer, ForeignKey("departments.id"))
    duration_yrs = Column(Numeric(3, 1))
    programme_type = Column(String(50))
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    department = relationship("Department")
    enrolments = relationship("Enrolment", back_populates="course")

class Enrolment(Base):
    __tablename__ = "enrolments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    enrolment_date = Column(Date, nullable=False)
    completion_date = Column(Date)
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now())
    student = relationship("Student", back_populates="enrolments")
    course = relationship("Course", back_populates="enrolments")
    certificate = relationship("CertificateIssuance", back_populates="enrolment", uselist=False)

class CertificateIssuance(Base):
    __tablename__ = "certificate_issuance"
    id = Column(Integer, primary_key=True, index=True)
    enrolment_id = Column(Integer, ForeignKey("enrolments.id"), nullable=False, unique=True)
    issue_date = Column(Date, nullable=False)
    collected = Column(Boolean, default=False)
    collection_date = Column(Date)
    confirmed_by = Column(Integer, ForeignKey("staff.id"))
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    enrolment = relationship("Enrolment", back_populates="certificate")
    confirming_staff = relationship("Staff")

class Module(Base):
    __tablename__ = "modules"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    lecturer_id = Column(Integer, ForeignKey("staff.id"))
    module_code = Column(String(50), nullable=False, unique=True)
    module_name = Column(String(255), nullable=False)
    required_hours = Column(Numeric(5, 2), nullable=False)
    attendance_threshold = Column(Numeric(5, 2), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now())
    course = relationship("Course")
    lecturer = relationship("Staff")
    sessions = relationship("Session", back_populates="module")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    marked_by = Column(Integer, ForeignKey("staff.id"))
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    duration_hours = Column(Numeric(4, 2), nullable=False)
    room = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())
    module = relationship("Module", back_populates="sessions")
    attendance_records = relationship("Attendance", back_populates="session")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    marked_by = Column(Integer, ForeignKey("staff.id"))
    status = Column(String(20), nullable=False)
    marked_at = Column(DateTime, server_default=func.now())
    notes = Column(Text)
    session = relationship("Session", back_populates="attendance_records")
    student = relationship("Student")

class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("system_users.id"))
    action = Column(String(20), nullable=False)
    table_name = Column(String(100), nullable=False)
    record_id = Column(Integer)
    old_value = Column(Text)
    new_value = Column(Text)
    performed_at = Column(DateTime, server_default=func.now())