-- ============================================================================
-- SELEBI-PHIKWE TECHNICAL COLLEGE (SPTECO)
-- STUDENT RECORDS MANAGEMENT SYSTEM (SRMS) - PRODUCTION MASTER SCHEMA
-- POSTGRESQL COMPATIBLE | VERSION 5.0 | JUNE 2026
-- ============================================================================

-- ============================================================================
-- CLEAN ENVIRONMENT RESET (Reverse Dependency Teardown Order)
-- ============================================================================
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
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
-- GLOBAL HELPER FUNCTIONS & PROCEDURES
-- ============================================================================

-- Automatically updates modification timestamps for audited records
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Modern Fail-Fast Immutability Guard for Ledger Integrity
CREATE OR REPLACE FUNCTION block_audit_alteration()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Immutability Violation: Audit log records cannot be modified or deleted.';
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- DATA SCHEMA DEFINITION (Correct Dependent Layering Order)
-- ============================================================================

-- 1. DEPARTMENTS TABLE
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. COURSES TABLE
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(50) NOT NULL UNIQUE, -- Format Example: 'AUT-01' (Automotive), 'CON-03' (Construction)
    course_name VARCHAR(255) NOT NULL,
    course_level INTEGER NULL,
    department_id INTEGER NULL REFERENCES departments(id) ON DELETE SET NULL,
    duration_yrs NUMERIC(3,1) NULL,
    programme_type VARCHAR(50) NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Structural Constraints
    CONSTRAINT chk_courses_duration_positive CHECK (duration_yrs > 0),
    CONSTRAINT chk_programme_type CHECK (programme_type IN ('Long Term', 'Short Term'))
);

-- 3. STUDENTS TABLE
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_no VARCHAR(50) NOT NULL UNIQUE, -- System Generated. Format Example: 'SPT2026-0001'
    first_name VARCHAR(100) NOT NULL,
    other_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NULL,
    dob DATE NULL,
    place_of_birth VARCHAR(150) NULL,
    nationality VARCHAR(100) NULL,
    omang VARCHAR(50) NULL, -- Kept non-unique at DB tier to safely handle messy historical data migrations
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
    
    -- Explicit Academic & Trade Prerequisite Screening Grid
    english_grade VARCHAR(5) NULL,
    maths_grade VARCHAR(5) NULL,
    science_grade VARCHAR(5) NULL,
    technology_grade VARCHAR(5) NULL,
    technical_maths_grade VARCHAR(5) NULL,
    technical_drawing_grade VARCHAR(5) NULL,
    practical_grade VARCHAR(5) NULL,
    associated_studies_grade VARCHAR(5) NULL,
    
    -- Ministry Intake Form Field Alignment
    other_subjects_summary TEXT NULL,
    relevant_experience TEXT NULL,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Domain Value Data Integrity Constraints
    CONSTRAINT chk_student_gender CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_student_status CHECK (status IN ('Active', 'Inactive', 'Graduated', 'Suspended', 'Withdrawn'))
);

CREATE TRIGGER update_students_modtime 
    BEFORE UPDATE ON students 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 4. NEXT OF KIN TABLE
CREATE TABLE next_of_kin (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    tel_no VARCHAR(50) NULL,
    cell_no VARCHAR(50) NULL,
    email VARCHAR(150) NULL
);

-- 5. STAFF TABLE
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    staff_no VARCHAR(50) NOT NULL UNIQUE, -- System Generated. Format Example: 'SPS-001'
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
    
    -- Domain Value Data Integrity Constraints
    CONSTRAINT chk_staff_gender CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_staff_status CHECK (status IN ('Active', 'Inactive'))
);

CREATE TRIGGER update_staff_modtime 
    BEFORE UPDATE ON staff 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 6. SYSTEM USERS TABLE (Security Authorization Layer)
CREATE TABLE system_users (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL UNIQUE REFERENCES staff(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, 
    role VARCHAR(50) NOT NULL, -- Enforces routing privileges: 'Admin', 'Lecturer', 'DB Admin'
    last_login TIMESTAMP NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Domain Access Safety Constraints
    CONSTRAINT chk_user_role CHECK (role IN ('Admin', 'Lecturer', 'DB Admin'))
);

-- Case-insensitive unique index on username
CREATE UNIQUE INDEX uq_username_lower ON system_users (LOWER(username));

-- 7. ENROLMENTS TABLE
CREATE TABLE enrolments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    enrolment_date DATE NOT NULL,
    completion_date DATE NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Domain Data Integrity, Completion Logic, and Timeline Constraints
    CONSTRAINT chk_enrolment_status CHECK (status IN ('Active', 'Completed', 'Withdrawn')),
    CONSTRAINT chk_enrolment_completion_logic CHECK (
        (status = 'Active' AND completion_date IS NULL) OR
        (status IN ('Completed', 'Withdrawn') AND completion_date IS NOT NULL)
    ),
    CONSTRAINT chk_enrolment_dates CHECK (
        completion_date IS NULL OR completion_date >= enrolment_date
    )
);

CREATE TRIGGER update_enrolments_modtime 
    BEFORE UPDATE ON enrolments 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 8. CERTIFICATE ISSUANCE TABLE
CREATE TABLE certificate_issuance (
    id SERIAL PRIMARY KEY,
    enrolment_id INTEGER NOT NULL UNIQUE REFERENCES enrolments(id) ON DELETE RESTRICT,
    issue_date DATE NOT NULL,
    collected BOOLEAN NOT NULL DEFAULT FALSE,
    collection_date DATE NULL,
    confirmed_by INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Verification and Collection Timeline Constraints
    CONSTRAINT chk_certificate_collection_logic CHECK (
        (collected = FALSE AND collection_date IS NULL) OR
        (collected = TRUE AND collection_date IS NOT NULL)
    ),
    CONSTRAINT chk_certificate_dates CHECK (
        collection_date IS NULL OR collection_date >= issue_date
    )
);

-- 9. MODULES TABLE
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    lecturer_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
    module_code VARCHAR(50) NOT NULL UNIQUE, -- Format Example: 'AM-01' (Engine Maintenance)
    module_name VARCHAR(255) NOT NULL,
    required_hours NUMERIC(5,2) NOT NULL,
    attendance_threshold NUMERIC(5,2) NOT NULL, -- Min hours student must attend before flagged at-risk. Set during creation. Default = 80% of required_hours.
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Sanity Constraint
    CONSTRAINT chk_modules_hours_positive CHECK (required_hours > 0),
    CONSTRAINT chk_attendance_threshold_positive CHECK (attendance_threshold > 0),
    CONSTRAINT chk_threshold_lte_required CHECK (attendance_threshold <= required_hours)
);

CREATE TRIGGER update_modules_modtime 
    BEFORE UPDATE ON modules 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 10. SESSIONS TABLE (Attendance Ledger Event Logs)
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
    marked_by INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours NUMERIC(4,2) NOT NULL, -- Precise validation left to application logic
    room VARCHAR(50) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Timeline Integrity Constraints
    CONSTRAINT chk_session_time_order CHECK (end_time > start_time),
    CONSTRAINT chk_session_duration_positive CHECK (duration_hours > 0)
);

-- 11. ATTENDANCE TABLE
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    marked_by INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL, -- Values: Present, Absent, Late, Excused
    marked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,
    
    -- Constraints & Allowed State Values
    CONSTRAINT unique_session_student UNIQUE (session_id, student_id),
    CONSTRAINT chk_attendance_status CHECK (status IN ('Present', 'Absent', 'Late', 'Excused'))
);

-- 12. IMMUTABLE AUDIT LOG TABLE
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

-- Fail-Fast Enforcement Guard Binded to Audit Log Ledger
CREATE TRIGGER enforce_audit_immutability
    BEFORE UPDATE OR DELETE ON audit_log
    FOR EACH ROW
    EXECUTE FUNCTION block_audit_alteration();


-- ============================================================================
-- OPTIMIZATION PARTIAL INDEXES & NETWORK PERFORMANCE ACCELERATORS
-- ============================================================================

-- Partial Unique Index: Prevents simultaneous active enrollments in the same course
CREATE UNIQUE INDEX uq_active_enrolment 
ON enrolments(student_id, course_id) 
WHERE status = 'Active';

-- High-Frequency Join and Scan Query Performance Accelerators
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_sessions_module ON sessions(module_id);
CREATE INDEX idx_enrolments_student ON enrolments(student_id);
CREATE INDEX idx_enrolments_course ON enrolments(course_id);
CREATE INDEX idx_students_student_no ON students(student_no);
CREATE INDEX idx_students_omang ON students(omang);
CREATE INDEX idx_certificate_enrolment ON certificate_issuance(enrolment_id);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_modules_lecturer ON modules(lecturer_id);
CREATE INDEX idx_staff_department ON staff(department_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_staff_email ON staff(email);