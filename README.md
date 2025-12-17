# Incoming Data Webhook API

## Overview
This API receives incoming data via a webhook, validates the request, authenticates it using an App Secret Token, identifies the related account, and forwards the data to the configured destinations.

---

## API Endpoint

- **URL:** `/server/incoming_data`
- **Method:** `POST`
- **Content-Type:** `application/json`

---

## Authentication

Each request must include an App Secret Token in the request headers.


---

## Request Rules

### Valid Request Conditions
- HTTP method must be `POST`
- Request body must be in `JSON` format
- App Secret Token must be present and valid

### Invalid Request Handling

| Condition | Response |
|---------|----------|
| HTTP method is `GET` | `{ "message": "Invalid Data" }` |
| Request body is not JSON | `{ "message": "Invalid Data" }` |
| App Secret Token missing or invalid | `{ "message": "Un Authenticate" }` |

---



