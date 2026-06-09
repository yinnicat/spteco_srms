from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, students, departments, courses, staff, enrolments, certificates


app = FastAPI(
    title="SPTECO Student Records Management System",
    description="SRMS API for Selebi-Phikwe Technical College",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(students.router)
app.include_router(departments.router)
app.include_router(courses.router)
app.include_router(staff.router)
app.include_router(enrolments.router)
app.include_router(certificates.router)


@app.get("/")
def root():
    return {"message": "SPTECO SRMS API is running"}