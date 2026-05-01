```md
# Job Queue System (BullMQ + Supabase)

## Overview

A backend system that allows users to:

- Register and login using JWT authentication
- Create background jobs
- Track job status and progress
- View their own jobs

Admins can:

- View all jobs in the system
- Inspect individual jobs

Technology stack:

- Node.js (Express)
- Supabase (PostgreSQL)
- BullMQ + Redis (queue + worker)
- JWT authentication

---

## Base URL

```

[http://localhost:3000/api/v1](http://localhost:3000/api/v1)

````

---

## Authentication

### POST /auth/register

Register a new user.

Request:

```json
{
  "name": "Jai",
  "email": "jai@example.com",
  "password": "123456"
}
````

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Jai",
    "email": "jai@example.com",
    "role": "USER"
  }
}
```

---

### POST /auth/login

Login user and receive access token.

Request:

```json
{
  "email": "jai@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Jai",
      "email": "jai@example.com",
      "role": "USER"
    },
    "accessToken": "JWT_TOKEN"
  }
}
```

---

## User Job APIs

### POST /jobs

Create a new job.

Headers:

```
Authorization: Bearer <JWT>
Content-Type: application/json
```

Request:

```json
{
  "job_type": "EMAIL",
  "payload": {
    "to": "test@example.com",
    "subject": "Hello"
  },
  "priority": 1
}
```

Flow:

```
Insert job in DB (PENDING)
→ Push job to BullMQ
→ Update DB (QUEUED)
→ Worker processes job
→ Update DB (PROCESSING → COMPLETED/FAILED)
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "QUEUED"
  }
}
```

---

### GET /jobs

Get jobs for the authenticated user.

Headers:

```
Authorization: Bearer <JWT>
```

Query parameters:

```
status = PENDING | QUEUED | PROCESSING | COMPLETED | FAILED
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "job_type": "EMAIL",
      "status": "COMPLETED",
      "progress": 100,
      "result": {},
      "created_at": "timestamp"
    }
  ]
}
```

---

## Admin APIs

### GET /admin/jobs

Get all jobs in the system.

Headers:

```
Authorization: Bearer <ADMIN_JWT>
```

Query parameters:

```
status
user_id
job_type
```

---

### GET /admin/jobs/:id

Get a specific job by ID.

Headers:

```
Authorization: Bearer <ADMIN_JWT>
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "job_type": "EMAIL",
    "status": "COMPLETED",
    "progress": 100,
    "result": {},
    "created_at": "timestamp"
  }
}
```

---

## Database Schema

### users

```sql
id UUID PRIMARY KEY
name TEXT
email TEXT UNIQUE
password_hash TEXT
role TEXT (USER | ADMIN)
created_at TIMESTAMP
```

---

### jobs

```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)

job_type TEXT
payload JSONB
result JSONB

status TEXT
progress INT

priority INT
attempts INT

bull_job_id TEXT

queued_at TIMESTAMP
started_at TIMESTAMP
completed_at TIMESTAMP
failed_at TIMESTAMP

processing_time_ms BIGINT

created_at TIMESTAMP
```

---

### job_attempts (planned)

```sql
id UUID
job_id UUID
attempt_number INT
status TEXT

started_at TIMESTAMP
completed_at TIMESTAMP
failed_at TIMESTAMP

error_message TEXT
error_stack TEXT
```

---

### job_events (planned)

```sql
id UUID
job_id UUID

event_type TEXT
message TEXT
metadata JSONB

created_at TIMESTAMP
```

---

## System Flow

```
Client → API → Supabase (job created)
                    ↓
                 BullMQ Queue (Redis)
                    ↓
                 Worker
                    ↓
           Updates Supabase (status, result)
```

---

## Job Lifecycle

```
PENDING
→ QUEUED
→ PROCESSING
→ COMPLETED or FAILED
```

---

## Implemented Features

```
- JWT authentication
- User registration and login
- Create job API
- Get user jobs API
- Admin: view all jobs
- Admin: view job by ID
- Supabase database integration
- BullMQ queue integration
- Worker processing
- Job status tracking
- Progress tracking
- Retry mechanism (BullMQ level)
- Priority support
```

---

## Not Implemented (Planned Features)

### Job Management

```
- Retry job API
- Cancel job API
- Scheduled jobs
- Repeatable jobs
```

### Observability

```
- job_events logging
- job_attempts logging
- detailed failure inspection
```

### User Features

```
- Get single job (user)
- Pagination
- Sorting
```

### Admin Features

```
- Retry any job
- Cancel any job
- Queue statistics
- User analytics
```

### Authentication

```
- Refresh tokens
- Logout endpoint
- Token rotation
```

### Real-Time

```
- WebSocket or SSE updates
- Live job progress updates
```

### DevOps

```
- Docker setup
- Deployment configuration
- Managed Redis setup
```

---

## Frontend Requirements

### User Dashboard

```
- Register / Login
- Create job
- View job list
- Filter by status
- View job details
```

### Admin Dashboard

```
- View all jobs
- Filter jobs
- View job details
- Monitor system
```

---

## Key Design Decisions

```
- PostgreSQL (Supabase) is the source of truth
- Redis (BullMQ) is used for background processing
- Job ID (UUID) is shared between DB and queue
- Worker is stateless
```

---

## Next Backend Priorities

```
1. job_events logging
2. job_attempts logging
3. Retry API
4. Cancel API
5. Get job by ID (user)
6. Pagination
```

```
```
