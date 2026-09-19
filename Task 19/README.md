# Task 18 – Dockerizing the BookNest FastAPI Backend

**Project:** BookNest – Book Library Management Application

## Task Objectives

Today's task focused on introducing containerization to the BookNest backend using Docker. The objectives were to:

- Understand Docker fundamentals: images, containers, and the Dockerfile workflow
- Containerize the existing BookNest FastAPI backend
- Successfully build and run the backend inside a Docker container
- Resolve PostgreSQL connectivity from within the container to the locally running database
- Verify the containerized API through Swagger/OpenAPI
- Conceptually research deployment platforms (without performing an actual deployment)
- Practice Kadane's Algorithm (Maximum Subarray) for DSA

---

## Introduction to Docker

Docker is a platform that packages an application together with everything it needs to run — code, dependencies, runtime, and configuration — into a single, portable unit called a **container**. This solves the common "it works on my machine" problem, since the container behaves the same way regardless of the host system it runs on.

Docker is used to make applications:

- **Portable** — the same image runs identically on any machine with Docker installed
- **Isolated** — dependencies for one project don't clash with another
- **Reproducible** — the environment is defined in code (the Dockerfile), not manual setup steps

---

## Docker Core Concepts

| Term | Meaning |
| :--- | :--- |
| **Dockerfile** | A text file containing step-by-step instructions for how to build an image |
| **Docker Image** | A packaged, read-only snapshot built from a Dockerfile — includes the code, dependencies, and runtime |
| **Docker Container** | A running instance of an image — the actual live process |

A useful analogy: the **Dockerfile is a recipe**, the **image is the packaged meal-kit** built from that recipe, and the **container is the meal being cooked and served** — a live, running instance of that image.

---

## Containers vs Virtual Machines

| Aspect | Virtual Machine | Docker Container |
| :--- | :--- | :--- |
| **OS** | Runs a full separate guest OS on a hypervisor | Shares the host machine's OS kernel |
| **Size** | Typically several GBs | Typically MBs |
| **Startup Time** | Minutes | Seconds |
| **Resource Usage** | Heavier — dedicated OS overhead per VM | Lightweight — only the app and its dependencies |
| **Isolation Level** | Full hardware-level isolation | Process-level isolation |

Because containers don't need to boot a full operating system, they are significantly faster to start and far more efficient in resource usage, which made Docker the practical choice for packaging the BookNest backend.

---

## Dockerizing the BookNest Backend

The existing BookNest backend already had a working structure (`main.py`, `crud.py`, `models.py`, `schemas.py`, `database.py`, `auth.py`, `dependencies.py`, etc.) connected to PostgreSQL via SQLAlemy. Today's work added a Docker layer on top of this existing structure — no backend logic was changed.

### Dockerfile Explanation

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Instruction-by-instruction breakdown:**

- **`FROM python:3.12-slim`** — Sets the base image. `python:3.12-slim` was chosen because it provides a minimal Debian-based image with Python pre-installed, keeping the final image size much smaller than the full `python:3.12` image while still including everything needed to run FastAPI.
- **`WORKDIR /app`** — Sets `/app` as the working directory inside the container. All subsequent instructions (`COPY`, `RUN`, `CMD`) execute relative to this path.
- **`COPY requirements.txt .`** — Copies only the requirements file into the container first, before the rest of the source code.
- **`RUN pip install --no-cache-dir -r requirements.txt`** — Installs all Python dependencies inside the image. `--no-cache-dir` avoids storing pip's download cache, keeping the image smaller.
- **`COPY . /app`** — Copies the rest of the application source code into the container.
- **`EXPOSE 8000`** — Documents that the container listens on port `8000`. This is informational for anyone reading the Dockerfile/image metadata; it does not by itself publish the port to the host.
- **`CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`** — Defines the default command run when the container starts: launching the FastAPI app via Uvicorn, bound to `0.0.0.0` so it accepts connections from outside the container, not just from `localhost` inside it.

**Why `requirements.txt` is copied before the rest of the application code:** Docker builds images in layers, and each instruction creates a cached layer. By copying `requirements.txt` and running `pip install` *before* copying the full application source, Docker can reuse the cached dependency-installation layer on subsequent builds as long as `requirements.txt` hasn't changed — even if application code changes frequently. This significantly speeds up rebuilds during development.



**Why these are excluded from the image:**

- **`venv/`** — A local Python virtual environment is host-specific and unnecessary; the container installs its own dependencies via `requirements.txt`.
- **`__pycache__/` and `*.pyc`** — Compiled Python bytecode is platform/version-specific and regenerated automatically; including it only adds dead weight.
- **`.env`** — Contains local secrets and environment-specific configuration. Baking secrets into an image is a security risk, since anyone with access to the image could extract them.
- **`.git/`** — Git history and metadata have no purpose inside a running container and can significantly bloat the image size.

Excluding these keeps the image smaller, faster to build, and avoids accidentally shipping secrets or host-specific files inside a portable artifact.

---

## Building the Docker Image

```bash
docker build -t fastapi .
```

This produced the image:
fastapi:latest


**What happens during `docker build`:**

Docker reads the Dockerfile top to bottom and executes each instruction, creating a new image layer for each one (base image, dependency installation, code copy, etc.). The result is a single, self-contained, read-only **image** named `fastapi:latest`. At this point nothing is running yet — the image is just a packaged blueprint sitting on disk.

**Dockerfile → Image distinction:** The Dockerfile is the *source instructions*; the image is the *compiled, buildable artifact* produced by running those instructions once through `docker build`. The Dockerfile can be edited and rebuilt any number of times to produce new image versions.

---

## Running the Docker Container

```bash
docker run -p 8080:8000 fastapi
```

This started a running **container** — a live instance of the `fastapi:latest` image.

**Port mapping explained (`8080:8000`):**

Host port 8080 → Container port 8000



The container's internal Uvicorn server listens on port `8000` (as set by `EXPOSE`/`CMD`), but that port is isolated inside the container's own network namespace by default. The `-p 8080:8000` flag tells Docker to forward traffic arriving at port `8080` on the host machine to port `8000` inside the container, making the API reachable at `http://localhost:8080` from the host.

---

## PostgreSQL Connectivity

The existing BookNest PostgreSQL database runs **locally on the Windows host**, on port `5433`. It was **not** containerized — it continues to run exactly as it did before, outside of Docker.

**The problem:** When the FastAPI container first started, it could not connect to the database using `localhost:5433`. This is because inside a Docker container, `localhost` refers to the container's own internal network namespace — not the Windows host machine. So the container was effectively trying to reach a PostgreSQL server running on itself, which doesn't exist there.

**The fix:** The container was run with a `DATABASE_URL` environment variable pointing to `host.docker.internal` instead of `localhost`, which is Docker Desktop's special DNS name that resolves to the host machine from inside a container.

### Architecture

Windows Host
│
├── PostgreSQL :5433
│
└── Docker
└── BookNest FastAPI Container :8000
│
└── host.docker.internal:5433
↓
PostgreSQL



**Why environment variables instead of hard-coding credentials:** Hard-coding a database URL and credentials directly into the Dockerfile would bake secrets permanently into the image itself, making them visible to anyone who inspects the image layers, and would require rebuilding the image every time the connection details changed (e.g. moving from local development to another environment). Passing `DATABASE_URL` as a runtime environment variable keeps the image generic and reusable, and keeps sensitive values out of version control and out of the image.

*(The actual database password used is not documented here for security reasons.)*

---

## Image vs Container

Using BookNest as the concrete example:

| | BookNest Example |
| :--- | :--- |
| **Dockerfile** | The set of instructions describing how to install FastAPI's dependencies and run Uvicorn |
| **Image** (`fastapi:latest`) | The packaged, built result of running those instructions once via `docker build` |
| **Container** | The actual running process — `docker run -p 8080:8000 fastapi` — with Uvicorn live and serving requests on port 8000 internally |

One image can be used to start multiple containers, and each container is an independent running instance that can be started, stopped, or removed without affecting the underlying image.

---

## Purpose and Benefits of Containerization

- **Consistent runtime environment** — the same Python version, OS libraries, and dependency versions every time, regardless of host machine
- **Portability** — the `fastapi:latest` image can be moved to any machine with Docker installed and run identically
- **Dependency isolation** — BookNest's Python dependencies are isolated from the host system's Python installation and other projects
- **Easier setup on another machine** — a new developer (or server) doesn't need to manually install Python, create a virtualenv, and install packages; `docker build` + `docker run` reproduces the environment automatically
- **Reproducible application environment** — the Dockerfile guarantees the same build steps are followed every time
- **Foundation for later deployment** — most modern hosting platforms expect a containerized application, so today's work lays the groundwork for a future deployment step

---

## Development vs Production

In the context of BookNest, development and production environments differ mainly in configuration rather than code:

- **Environment variables** — values like `DATABASE_URL` differ between a local Postgres instance and a production database
- **Database URLs** — local development pointed at `host.docker.internal:5433`; a production setup would point at a managed/remote database instead
- **Secret keys** (e.g. JWT signing keys) — should be different, strong, and never reused between environments
- **Debug/development settings** — features like auto-reload (`--reload` in Uvicorn) are useful in development but should be disabled in production for performance and security
- **Production configuration** — production deployments typically also add stricter CORS rules, logging, and process management
- **Never committing secrets to GitHub** — `.env` and any credential files are excluded via `.gitignore`/`.dockerignore` so they never end up in source control or inside a built image

---

## Deployment Workflow and Platform Research

BookNest was **not deployed** today. This section documents the deployment workflow that was studied conceptually, for future reference.

Conceptual workflow:

Application
↓
Dockerfile
↓
Docker Image
↓
Container
↓
Cloud/Server


The general idea is that once an application is containerized, that same image can, in principle, be pushed to a container registry and run on a cloud platform. Platforms researched as potential future options for hosting a containerized FastAPI backend include **Render, Railway, Koyeb, and Google Cloud Run**. These were reviewed only at a conceptual level — no account setup, image push, or deployment was actually carried out.

---

## React Production Build Process

The BookNest frontend is built with **React/Vite**. A production-optimized build can be generated using:

```bash
npm run build
```

This compiles and bundles the frontend into static assets suitable for production hosting. **Today's Docker work applied only to the FastAPI backend** — the React frontend was not containerized, and no frontend Dockerfile was created.

---

## DSA / Coding Practice – Kadane's Algorithm

**Problem:** Given an integer array, find the contiguous subarray with the largest sum.

```python
class Solution:
    def maxSubArray(self, nums):
        current_sum = nums[0]
        maximum_sum = nums[0]

        for i in range(1, len(nums)):
            current_sum = max(nums[i], current_sum + nums[i])
            maximum_sum = max(maximum_sum, current_sum)

        return maximum_sum
```

**Example:**

Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6


The maximum subarray is `[4, -1, 2, 1]`, which sums to `6`.

**Logic:** At every element, the algorithm decides whether to extend the existing running subarray (`current_sum + nums[i]`) or discard it and start a new subarray from the current element alone (`nums[i]`), keeping whichever is larger. The overall maximum seen so far is tracked separately in `maximum_sum`.

- **Time Complexity:** O(n) — a single pass through the array
- **Space Complexity:** O(1) — only two variables are maintained regardless of input size

---

## Practical Docker Workflow Used Today

Dockerfile
↓
docker build
↓
fastapi:latest image
↓
docker run
↓
BookNest FastAPI container
↓
localhost:8080


---

## Testing and Verification

The container was started and the terminal output confirmed a successful launch:

Uvicorn running on http://0.0.0.0:8000
Application startup complete


The application was accessed from the host machine through:

http://localhost:8080


Swagger/OpenAPI documentation was verified as accessible at:

http://localhost:8080/docs

**Request path from browser to application:**

localhost:8080
↓
Docker port mapping
↓
Container port 8000
↓
Uvicorn
↓
FastAPI application
↓
main.py → app

**Request path from browser to application:**

localhost:8080
↓
Docker port mapping
↓
Container port 8000
↓
Uvicorn
↓
FastAPI application
↓
main.py → app
