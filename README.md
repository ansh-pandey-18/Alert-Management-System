# Intelligent Alert Escalation & Resolution System

## Overview

This project implements a rule-driven alert management system designed
to simulate real-world operational monitoring scenarios such as
overspeed events, compliance validation, and negative feedback tracking.

The system supports automatic escalation, scheduled auto-closure, and
provides a dashboard for monitoring alert behavior over time. All alert
transitions are recorded to maintain traceability and auditability.

The focus of this project is clarity of business logic, configurability,
and structured backend design.

------------------------------------------------------------------------

## Tech Stack

### Backend

-   Node.js (ES Modules)
-   Express
-   MongoDB (Mongoose)
-   Redis (for caching dashboard aggregates)
-   node-cron (scheduled auto-close processing)

### Frontend

-   React
-   Chart.js (trend visualization)
-   Axios

------------------------------------------------------------------------

## Core Features

### 1. Alert Creation

Alerts can be created with: - `sourceType` - `severity` - `driverId` -
`metadata`

New alerts start in `OPEN` state.

------------------------------------------------------------------------

### 2. Escalation Engine

Escalation rules are defined in `rules.json`.

An alert escalates when: - The number of alerts for the same `driverId`
and `sourceType` - Within a defined time window - Meets or exceeds the
configured threshold

When escalated: - Status becomes `ESCALATED` - Severity is upgraded to
`CRITICAL` - Transition is recorded in alert history

------------------------------------------------------------------------

### 3. Auto-Close Engine

A scheduled background job runs using `node-cron`.

Alerts auto-close based on: - Compliance condition (e.g.,
`document_valid = true`) - Expiry window (e.g., auto-close after
configured minutes)

All transitions are appended to alert history for auditability.

------------------------------------------------------------------------

### 4. Dashboard Capabilities

The dashboard provides:

-   Severity summary of active alerts
-   Top drivers by active alerts
-   Trend over time:
    -   Total alerts
    -   Escalations
    -   Auto-closures
-   Recent auto-closed alerts
-   Alert drill-down (history + metadata view)
-   Active rule configuration overview

------------------------------------------------------------------------

### 5. Caching Strategy

Redis is used to cache: - Severity summary - Top drivers

The system gracefully falls back to database queries if Redis is
unavailable.

------------------------------------------------------------------------

## Project Structure

    intelligent-alert-system
    │
    ├── src
    │   ├── config
    │   ├── controllers
    │   ├── services
    │   ├── models
    │   ├── jobs
    │   └── utils
    │
    ├── client
    │   ├── public
    │   └── src
    │
    └── README.md

Backend follows a service-layer architecture to separate request
handling from business logic.

------------------------------------------------------------------------

## Rule Configuration

Rules are defined in:

    src/config/rules.json

Example:

``` json
{
  "overspeed": {
    "escalate_if_count": 3,
    "window_mins": 60,
    "expire_after_mins": 1440
  }
}
```

This allows threshold tuning without modifying core logic.

------------------------------------------------------------------------

## How to Run

### Backend Setup

Create a `.env` file in root:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    REDIS_HOST=your_redis_host
    REDIS_PORT=your_redis_port
    REDIS_PASSWORD=your_redis_password

Install dependencies:

    npm install

Run backend:

    npm run dev

Backend runs at:

    http://localhost:5000

------------------------------------------------------------------------

### Frontend Setup

    cd client
    npm install
    npm start

Frontend runs at:

    http://localhost:3000

------------------------------------------------------------------------

## API Endpoints

-   `POST /api/v1/alerts`
-   `GET /api/v1/alerts/:alertId`
-   `PATCH /api/v1/alerts/:alertId/resolve`
-   `GET /api/v1/dashboard/summary`
-   `GET /api/v1/dashboard/top-drivers`
-   `GET /api/v1/dashboard/trends`
-   `GET /api/v1/dashboard/recent-auto-closed`
-   `GET /api/v1/dashboard/rules`

------------------------------------------------------------------------

## Design Considerations

-   Rule evaluation is decoupled from controllers.
-   State transitions are preserved for auditability.
-   Background processing is isolated from request lifecycle.
-   Dashboard endpoints use caching to reduce DB load.
-   Rule configuration is externalized for flexibility.

------------------------------------------------------------------------

## Possible Improvements

-   Add authentication and role-based access.
-   Add filtering and pagination for alerts.
-   Make cron schedule configurable via environment variable.
-   Improve UI filtering (daily/weekly toggle for trends).

------------------------------------------------------------------------

## Conclusion

This system demonstrates rule-based state management, background job
execution, caching strategies, and structured frontend visualization.

The emphasis is on maintainability, configurability, and clear
separation of functionalities.