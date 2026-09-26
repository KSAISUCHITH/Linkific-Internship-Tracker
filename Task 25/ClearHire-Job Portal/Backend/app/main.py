from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.candidates import router as candidates_router
from app.api.routes.companies import router as companies_router
from app.api.routes.jobs import router as jobs_router
from app.api.routes.applications import router as applications_router
from app.api.routes.interviews import router as interviews_router
from app.api.routes.notifications import router as notifications_router

from app.database.base import Base
from app.database.connection import engine

from app.models import (
    User,
    CandidateProfile,
    Company,
    Job,
    Application,
    ApplicationStatusHistory,
    Interview,
    Notification,
)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ClearHire API",
    description="Backend API for the ClearHire Job Portal",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(candidates_router)
app.include_router(companies_router)
app.include_router(jobs_router)
app.include_router(applications_router)
app.include_router(interviews_router)
app.include_router(notifications_router)


@app.get("/")
def root():
    return {
        "message": "ClearHire API is running",
    }