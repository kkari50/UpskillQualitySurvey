# [Project Name] API Design

## Overview

This document describes the API endpoints and data schemas for the application.

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://your-app.vercel.app/api`

## Authentication

All protected endpoints require a valid session cookie (managed by Supabase Auth).

## Endpoints

### Public Endpoints

#### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Protected Endpoints

#### `GET /api/[resource]`

Get all resources for the authenticated user.

**Headers:**
- Cookie: `sb-access-token=...` (automatic via Supabase SSR)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Resource Name",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### `POST /api/[resource]`

Create a new resource.

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Resource Name",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `500` - Server error

#### `PUT /api/[resource]/[id]`

Update a resource.

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Updated Name",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `DELETE /api/[resource]/[id]`

Delete a resource.

**Response:**
```json
{
  "success": true
}
```

## Validation Schemas (Zod)

```typescript
import { z } from 'zod';

export const createResourceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

export const updateResourceSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
```

## Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

For production, consider implementing rate limiting with Upstash:

- **Anonymous:** 100 requests/minute
- **Authenticated:** 1000 requests/minute
