from fastapi import FastAPI

app = FastAPI(
    title="ClearHire API",
    description="Job Portal System API Foundation",
    version="0.1.0",
)


@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to ClearHire - Job Portal System API",
        "version": "0.1.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }
