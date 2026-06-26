-- ============================================================================
-- SELEBI-PHIKWE TECHNICAL COLLEGE (SPTECO)
-- STUDENT RECORDS MANAGEMENT SYSTEM (SRMS) - PRODUCTION MASTER SCHEMA
-- POSTGRESQL COMPATIBLE | VERSION 8.0 | JUNE 2026
-- ============================================================================
-- Run this file on a fresh database to set up the full system.
-- Default login after setup: username=admin password=admin123
-- ============================================================================

-- ============================================================================
-- CLEAN ENVIRONMENT RESET
-- ============================================================================
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS module_assignments CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS certificate_issuance CASCADE;
DROP TABLE IF EXISTS enrolments CASCADE;
DROP TABLE IF EXISTS system_users CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS next_of_kin CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION block_audit_alteration()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Immutability Violation: Audit log records cannot be modified or deleted.';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLES
-- ============================================================================

-- 1. DEPARTMENTS
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. COURSES
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(50) NOT NULL UNIQUE,
    course_name VARCHAR(255) NOT NULL,
    course_level INTEGER NULL,
    department_id INTEGER NULL REFERENCES departments(id) ON DELETE SET NULL,
    duration_yrs NUMERIC(3,1) NULL,
    programme_type VARCHAR(50) NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_courses_duration_positive CHECK (duration_yrs > 0),
    CONSTRAINT chk_programme_type CHECK (programme_type IN ('Long Term', 'Short Term'))
);

-- 3. STUDENTS
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_no VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    other_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NULL,
    dob DATE NULL,
    place_of_birth VARCHAR(150) NULL,
    nationality VARCHAR(100) NULL,
    omang VARCHAR(50) NULL,
    passport VARCHAR(50) NULL,
    email VARCHAR(150) NULL,
    tel_no VARCHAR(50) NULL,
    cell_no VARCHAR(50) NULL,
    address TEXT NULL,
    admission_date DATE NULL,
    academic_qualifications TEXT NULL,
    prof_qualification VARCHAR(255) NULL,
    disability VARCHAR(255) NULL,
    sen BOOLEAN NOT NULL DEFAULT FALSE,
    ovc BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    english_grade VARCHAR(5) NULL,
    maths_grade VARCHAR(5) NULL,
    science_grade VARCHAR(5) NULL,
    technology_grade VARCHAR(5) NULL,
    technical_maths_grade VARCHAR(5) NULL,
    technical_drawing_grade VARCHAR(5) NULL,
    practical_grade VARCHAR(5) NULL,
    associated_studies_grade VARCHAR(5) NULL,
    other_subjects_summary TEXT NULL,
    relevant_experience TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_student_gender CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_student_status CHECK (status IN ('Active', 'Completed', 'Suspended', 'Withdrawn'))
);

CREATE TRIGGER update_students_modtime
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 4. NEXT OF KIN
CREATE TABLE next_of_kin (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    relation VARCHAR(50) NOT NULL,
    tel_no VARCHAR(50) NULL,
    cell_no VARCHAR(50) NULL,
    email VARCHAR(150) NULL
);

-- 5. STAFF
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    staff_no VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NULL,
    dob DATE NULL,
    email VARCHAR(150) NULL,
    phone VARCHAR(50) NULL,
    address TEXT NULL,
    employment_date DATE NULL,
    department_id INTEGER NULL REFERENCES departments(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_staff_gender CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_staff_status CHECK (status IN ('Active', 'Inactive'))
);

CREATE TRIGGER update_staff_modtime
    BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 6. SYSTEM USERS
CREATE TABLE system_users (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL UNIQUE REFERENCES staff(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_user_role CHECK (role IN ('Admin', 'Lecturer', 'DB Admin'))
);

CREATE UNIQUE INDEX uq_username_lower ON system_users (LOWER(username));

-- 7. ENROLMENTS
CREATE TABLE enrolments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    enrolment_date DATE NOT NULL,
    completion_date DATE NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_enrolment_status CHECK (status IN ('Active', 'Completed', 'Withdrawn')),
    CONSTRAINT chk_enrolment_completion_logic CHECK (
        (status = 'Active' AND completion_date IS NULL) OR
        (status IN ('Completed', 'Withdrawn') AND completion_date IS NOT NULL)
    ),
    CONSTRAINT chk_enrolment_dates CHECK (
        completion_date IS NULL OR completion_date >= enrolment_date
    )
);

CREATE UNIQUE INDEX uq_active_enrolment
ON enrolments(student_id, course_id)
WHERE status = 'Active';

CREATE TRIGGER update_enrolments_modtime
    BEFORE UPDATE ON enrolments
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 8. CERTIFICATE ISSUANCE
CREATE TABLE certificate_issuance (
    id SERIAL PRIMARY KEY,
    enrolment_id INTEGER NOT NULL UNIQUE REFERENCES enrolments(id) ON DELETE RESTRICT,
    issue_date DATE NOT NULL,
    collected BOOLEAN NOT NULL DEFAULT FALSE,
    collection_date DATE NULL,
    confirmed_by INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_certificate_collection_logic CHECK (
        (collected = FALSE AND collection_date IS NULL) OR
        (collected = TRUE AND collection_date IS NOT NULL)
    ),
    CONSTRAINT chk_certificate_dates CHECK (
        collection_date IS NULL OR collection_date >= issue_date
    )
);

-- 9. MODULES
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    module_code VARCHAR(50) NOT NULL UNIQUE,
    module_name VARCHAR(255) NOT NULL,
    required_hours NUMERIC(5,2) NOT NULL,
    attendance_threshold NUMERIC(5,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_modules_hours_positive CHECK (required_hours > 0),
    CONSTRAINT chk_attendance_threshold_positive CHECK (attendance_threshold > 0),
    CONSTRAINT chk_threshold_lte_required CHECK (attendance_threshold <= required_hours)
);

CREATE TRIGGER update_modules_modtime
    BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 10. MODULE ASSIGNMENTS
CREATE TABLE module_assignments (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
    lecturer_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    academic_year VARCHAR(10) NOT NULL,
    semester VARCHAR(20) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_academic_year_format CHECK (academic_year ~ '^[0-9]{4}$')
);

-- 11. SESSIONS
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
    marked_by INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours NUMERIC(4,2) NOT NULL,
    room VARCHAR(50) NULL,
    semester VARCHAR(20) NULL,
    academic_year VARCHAR(10) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_session_time_order CHECK (end_time > start_time),
    CONSTRAINT chk_session_duration_positive CHECK (duration_hours > 0)
);

-- 12. ATTENDANCE
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    marked_by INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL,
    marked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,
    CONSTRAINT unique_session_student UNIQUE (session_id, student_id),
    CONSTRAINT chk_attendance_status CHECK (status IN ('Present', 'Absent', 'Late', 'Excused'))
);

-- 13. AUDIT LOG
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NULL REFERENCES system_users(id) ON DELETE SET NULL,
    action VARCHAR(20) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_audit_action CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))
);

CREATE TRIGGER enforce_audit_immutability
    BEFORE UPDATE OR DELETE ON audit_log
    FOR EACH ROW
    EXECUTE FUNCTION block_audit_alteration();

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_sessions_module ON sessions(module_id);
CREATE INDEX idx_enrolments_student ON enrolments(student_id);
CREATE INDEX idx_enrolments_course ON enrolments(course_id);
CREATE INDEX idx_students_student_no ON students(student_no);
CREATE INDEX idx_students_omang ON students(omang);
CREATE INDEX idx_certificate_enrolment ON certificate_issuance(enrolment_id);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_module_assignments_module ON module_assignments(module_id);
CREATE INDEX idx_module_assignments_lecturer ON module_assignments(lecturer_id);
CREATE INDEX idx_staff_department ON staff(department_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_staff_email ON staff(email);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Departments
INSERT INTO departments (name) VALUES
('Automobile'),
('Business'),
('Construction'),
('Clothing Design and Textile'),
('ICT and Key Skills'),
('Electrical'),
('Mechanical'),
('Painting and Decoration'),
('Bricklaying and Plastering'),
('Plumbing and Pipe Fitting'),
('Carpentry and Joinery');

-- Courses
INSERT INTO courses (course_code, course_name, course_level, duration_yrs, programme_type, department_id) VALUES
('AUT-N3', 'Automotive Engineering', 3, 1, 'Long Term', (SELECT id FROM departments WHERE name = 'Automobile')),
('AUT-N4', 'Automotive Engineering', 4, 1, 'Long Term', (SELECT id FROM departments WHERE name = 'Automobile')),
('ELE-N3', 'Electrical Installation and Maintenance', 3, 1, 'Long Term', (SELECT id FROM departments WHERE name = 'Electrical')),
('BRI-N3', 'Bricklaying and Plastering', 3, 1, 'Long Term', (SELECT id FROM departments WHERE name = 'Bricklaying and Plastering')),
('BRI-N4', 'Bricklaying and Plastering', 4, 1, 'Long Term', (SELECT id FROM departments WHERE name = 'Bricklaying and Plastering')),
('PAI-N3', 'Painting and Decoration', 3, 1, 'Long Term', (SELECT id FROM departments WHERE name = 'Painting and Decoration')),
('CDT-N3', 'Clothing Design and Technology', 3, 1, 'Long Term', (SELECT id FROM departments WHERE name = 'Clothing Design and Textile')),
('NCS', 'National Certificate in Secretarial Studies', NULL, 2, 'Long Term', (SELECT id FROM departments WHERE name = 'Business')),
('CABS', 'Certificate in Accounting and Business Studies', NULL, 2, 'Long Term', (SELECT id FROM departments WHERE name = 'Business'));

-- Default DB Admin account (password: admin123)
INSERT INTO staff (staff_no, first_name, last_name, status)
VALUES ('SPS-001', 'Admin', 'User', 'Active');

INSERT INTO system_users (staff_id, username, password_hash, role, is_active)
VALUES (
    (SELECT id FROM staff WHERE staff_no = 'SPS-001'),
    'admin',
    '$2b$12$dMfDIef3.IV6fxdxTCYTAO18TxtkKzI..B2xTUlPSmMM1nN29EYNy',
    'DB Admin',
    TRUE
);

-- ============================================================================
-- DONE
-- ============================================================================
-- Default login: username=admin | password=admin123
-- Next step: run migrate.py to import historical student data
-- ============================================================================