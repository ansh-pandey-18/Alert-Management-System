# Alert Lifecycle Manager

## Overview

This project implements a rule-driven alert lifecycle management system
that handles creation, escalation, resolution, and automated closure of
operational alerts.

The system is designed to simulate real-world operational monitoring
scenarios such as overspeed events, compliance validation, and negative
feedback tracking. It focuses on clear rule evaluation, lifecycle
tracking, background processing, and analytical visualization.

------------------------------------------------------------------------

## Tech Stack

### Backend

-   Node.js (ES Modules)
-   Express
-   MongoDB (Mongoose)
-   Redis (caching for dashboard aggregates)
-   node-cron (scheduled auto-close job)

### Frontend

-   React
-   Chart.js
-   Axios

------------------------------------------------------------------------

## Core Capabilities

### Alert Lifecycle Handling

Alerts move through the following states:

OPEN → ESCALATED → AUTO_CLOSED / RESOLVED

All state transitions are recorded in alert history for auditability.

### Escalation Engine

Escalation is triggered when: - Alerts of the same `driverId` and
`sourceType` - Within a configured time window - Reach the defined
threshold

Escalated alerts: - Change status to `ESCALATED` - Upgrade severity to
`CRITICAL` - Record transition history

### Auto-Close Engine

A scheduled background job evaluates alerts periodically.

Auto-close conditions: - Compliance rule (e.g.,
`document_valid = true`) - Expiry window (e.g., auto-close after
configured duration)

### Dashboard Features

-   Severity summary
-   Top drivers by active alerts
-   Trend over time (Total, Escalated, Auto-Closed)
-   Recent auto-closed alerts
-   Alert drill-down (history + metadata)
-   Active rule configuration overview

------------------------------------------------------------------------

## Architecture Overview

The backend follows a layered structure:

Controllers → Services → Models

-   Controllers manage request/response flow.
-   Services contain business logic (rule evaluation, escalation,
    auto-close).
-   Models define schema and lifecycle tracking.
-   Redis is used selectively for aggregation-heavy endpoints.

------------------------------------------------------------------------

## Caching Strategy

Redis caches: - Severity summary - Top drivers

Cache invalidation occurs whenever alert state changes.

This reduces MongoDB aggregation overhead while maintaining consistency.

------------------------------------------------------------------------

## Time Complexity Analysis

### Alert Creation

-   O(1) document insert
-   Escalation check: O(log n) due to indexed MongoDB query on driverId,
    sourceType, and createdAt

### Escalation Evaluation

-   Uses indexed count query within time window
-   Complexity: O(log n)

### Auto-Close Job

-   Iterates over active alerts
-   Complexity: O(m) where m = number of OPEN + ESCALATED alerts

### Dashboard Aggregations

-   MongoDB aggregation pipeline: O(n)
-   Optimized with Redis caching

------------------------------------------------------------------------

## Design Trade-offs

1.  Cron-Based Processing vs Event-Driven\
    Used cron for simplicity and clarity.\
    Trade-off: Slight delay between condition satisfaction and state
    transition.

2.  Redis Caching Scope\
    Cached only aggregation-heavy endpoints to simplify invalidation
    logic.

3.  JSON-Based Rule Configuration\
    Externalized rules for flexibility.\
    Trade-off: Requires consistent sourceType naming.

4.  Sequential Dashboard API Calls\
    Chosen for simplicity and readability.\
    Trade-off: Slight performance cost compared to Promise.all batching.

------------------------------------------------------------------------

## Scalability Considerations

For larger datasets, the following improvements could be applied:

-   Introduce message queues for event-driven processing
-   Add compound indexing for escalation queries
-   Batch auto-close processing
-   Paginate alert drill-down views
-   Implement authentication and role-based access control

------------------------------------------------------------------------

## How to Run

### Backend

Create `.env` in root:

PORT=5000\
MONGO_URI=your_mongodb_connection_string\
REDIS_HOST=your_redis_host\
REDIS_PORT=your_redis_port\
REDIS_PASSWORD=your_redis_password

Install dependencies:

npm install

Run:

npm run dev

------------------------------------------------------------------------

### Frontend

cd client\
npm install\
npm start

------------------------------------------------------------------------

## API Endpoints

POST /api/v1/alerts\
GET /api/v1/alerts/:alertId\
PATCH /api/v1/alerts/:alertId/resolve

GET /api/v1/dashboard/summary\
GET /api/v1/dashboard/top-drivers\
GET /api/v1/dashboard/trends\
GET /api/v1/dashboard/recent-auto-closed\
GET /api/v1/dashboard/rules

------------------------------------------------------------------------

## Conclusion

This system demonstrates rule-based lifecycle management, background job
execution, caching strategies, and structured dashboard visualization
with clear trade-offs and complexity considerations.
