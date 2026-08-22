# 🌍 GlobeTrotter Backend API Specification & Data Contracts

This document defines the comprehensive backend REST API schema for **GlobeTrotter — Empowering Personalized Travel Planning**. Frontend developers can use this schema to construct API service layers, TypeScript interfaces, and mock data handlers.

---

## 🔑 1. Base URL & Authentication

* **Base URL:** `http://localhost:3000/api/v1` (or `https://api.globetrotter.com/v1` in production)
* **Content-Type:** `application/json`
* **Authentication Header:**
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```

---

## 📦 2. Standard Envelope & Error Response Format

### Success Response Envelope
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Paginated List Response Envelope
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 42,
    "totalPages": 5
  }
}
```

### Error Response Schema
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED | NOT_FOUND | VALIDATION_ERROR | EMAIL_ALREADY_EXISTS | INVALID_CREDENTIALS | INTERNAL_SERVER_ERROR",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "email",
        "issue": "Invalid email address format"
      }
    ]
  }
}
```

---

## 🗄️ 3. Core Data Models (TypeScript Interfaces)

### `User`
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  additionalInfo?: string;
  avatarUrl?: string | null;
  language: string; // e.g., 'en', 'es', 'fr'
  role: 'USER' | 'ADMIN';
  createdAt: string; // ISO 8601
  updatedAt?: string;
}
```

### `Trip`
```typescript
interface Trip {
  id: string;
  userId: string;
  title: string;
  destinationPlace: string; // e.g., 'Paris', 'Tokyo'
  description?: string;
  coverImage?: string;
  startDate: string; // ISO 8601 Date
  endDate: string; // ISO 8601 Date
  totalBudget: number;
  currency: string; // e.g., 'USD', 'EUR'
  visibility: 'PRIVATE' | 'PUBLIC';
  shareToken?: string;
  sections?: ItinerarySection[];
  sectionsCount?: number;
  totalSectionBudget?: number;
  totalExpenses?: number;
  totalEstimatedCost?: number;
  remainingBudget?: number;
  status?: 'upcoming' | 'ongoing' | 'completed';
  createdAt: string;
  updatedAt: string;
}
```

### `ItinerarySection` (Screen 5 Section Card)
```typescript
type SectionType = 'TRAVEL' | 'ACCOMMODATION' | 'ACTIVITY' | 'MISCELLANEOUS';

interface ItinerarySection {
  id: string;
  tripId: string;
  title: string; // e.g., 'Section 1: Air France Flight to Paris'
  type: SectionType;
  description?: string; // Information about this section
  startDate: string; // ISO 8601 Date
  endDate: string; // ISO 8601 Date
  budget: number; // Allocated section budget
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}
```

### `DestinationSuggestion` (Screen 4 Recommendations)
```typescript
interface DestinationSuggestion {
  id: string;
  title: string;
  category: 'SIGHTSEEING' | 'FOOD_TOUR' | 'CULTURE' | 'ADVENTURE' | 'RELAXATION' | 'SHOPPING';
  description: string;
  estimatedCost: number;
  imageUrl: string;
}
```

### `City`
```typescript
interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  imageUrl: string;
  costIndex: 'BUDGET' | 'MODERATE' | 'LUXURY';
  averageDailyCost: number;
  popularityScore: number; // 1-100
}
```

---

## 📡 4. Comprehensive API Endpoints

### 🟢 Auth Module (`/api/v1/auth`)

#### 1. `POST /api/v1/auth/signup` (Screen 1)
Creates a new user account.
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "firstName": "Alex",
    "lastName": "Rivera",
    "email": "alex.rivera@example.com",
    "password": "Password123!",
    "phoneNumber": "+15550199",
    "country": "United States",
    "city": "San Francisco",
    "additionalInfo": "Traveler testing GlobeTrotter"
  }
  ```
* **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "11f82d25-f9ff-4ee3-993e-0e0860ce013b",
        "name": "Alex Rivera",
        "firstName": "Alex",
        "lastName": "Rivera",
        "email": "alex.rivera@example.com",
        "phoneNumber": "+15550199",
        "country": "United States",
        "city": "San Francisco",
        "additionalInfo": "Traveler testing GlobeTrotter",
        "avatarUrl": null,
        "language": "en",
        "role": "USER",
        "createdAt": "2026-08-22T05:55:59.491Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### 2. `POST /api/v1/auth/login` (Screen 1)
Authenticates a user and returns JWT.
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "email": "alex.rivera@example.com",
    "password": "Password123!"
  }
  ```
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": { ... },
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

#### 3. `POST /api/v1/auth/forgot-password` (Screen 1)
Requests password reset.
* **Auth Required:** No
* **Request Body:** `{ "email": "alex.rivera@example.com" }`
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "message": "If an account with that email exists, password reset instructions have been sent."
    }
  }
  ```

---

### ✈️ Trips Management Module (`/api/v1/trips`)

#### 4. `POST /api/v1/trips` (Create Trip - Screen 3 & 4)
Initialize a new travel plan. Generates catalog suggestions based on destination.
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "title": "Autumn Escapade in Paris",
    "destinationPlace": "Paris",
    "startDate": "2026-10-01",
    "endDate": "2026-10-10",
    "totalBudget": 3000,
    "description": "Visiting Paris monuments and cafes",
    "currency": "USD"
  }
  ```
* **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Trip created successfully",
    "data": {
      "trip": {
        "id": "5ce00391-8d49-4e49-8862-773a0398583f",
        "userId": "11f82d25-f9ff-4ee3-993e-0e0860ce013b",
        "title": "Autumn Escapade in Paris",
        "destinationPlace": "Paris",
        "description": "Visiting Paris monuments and cafes",
        "coverImage": null,
        "startDate": "2026-10-01T00:00:00.000Z",
        "endDate": "2026-10-10T00:00:00.000Z",
        "totalBudget": 3000,
        "currency": "USD",
        "visibility": "PRIVATE",
        "shareToken": "...",
        "sections": [],
        "createdAt": "2026-08-22T05:56:00.000Z",
        "updatedAt": "2026-08-22T05:56:00.000Z"
      },
      "suggestions": [
        {
          "id": "sug_1",
          "title": "Explore Central Paris",
          "category": "SIGHTSEEING",
          "description": "Must-see landmarks and historic walking tours around central Paris.",
          "estimatedCost": 25,
          "imageUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
        }
      ]
    }
  }
  ```

#### 5. `GET /api/v1/trips` (My Trips Screen - Screen 4)
List user trips with status filtering and pagination.
* **Auth Required:** Yes
* **Query Params:**
  * `status`: `upcoming` | `ongoing` | `completed`
  * `search`: string keyword
  * `sortBy`: `startDate` | `title` | `totalBudget`
  * `page`: integer (default: 1)
  * `limit`: integer (default: 10)
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "5ce00391-8d49-4e49-8862-773a0398583f",
        "userId": "11f82d25-f9ff-4ee3-993e-0e0860ce013b",
        "title": "Autumn Escapade in Paris",
        "destinationPlace": "Paris",
        "description": "Visiting Paris monuments and cafes",
        "startDate": "2026-10-01T00:00:00.000Z",
        "endDate": "2026-10-10T00:00:00.000Z",
        "totalBudget": 3000,
        "currency": "USD",
        "visibility": "PRIVATE",
        "status": "upcoming",
        "sectionsCount": 3,
        "totalSectionBudget": 2500
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalCount": 1,
      "totalPages": 1
    }
  }
  ```

#### 6. `GET /api/v1/trips/:tripId` (Itinerary View - Screen 6)
Get full trip details including section breakdowns and budget computations.
* **Auth Required:** Yes
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "id": "5ce00391-8d49-4e49-8862-773a0398583f",
      "title": "Autumn Escapade in Paris",
      "destinationPlace": "Paris",
      "description": "Visiting Paris monuments and cafes",
      "startDate": "2026-10-01T00:00:00.000Z",
      "endDate": "2026-10-10T00:00:00.000Z",
      "totalBudget": 3000,
      "currency": "USD",
      "visibility": "PRIVATE",
      "sections": [ ... ],
      "expenses": [],
      "sectionsCount": 3,
      "totalSectionBudget": 2500,
      "totalExpenses": 0,
      "totalEstimatedCost": 2500,
      "remainingBudget": 500
    }
  }
  ```

#### 7. `PUT /api/v1/trips/:tripId`
Update trip metadata (title, dates, budget, visibility).
* **Auth Required:** Yes
* **Request Body:** Partial `createTripSchema` fields.

#### 8. `DELETE /api/v1/trips/:tripId`
Delete a trip and all its associated itinerary sections.
* **Auth Required:** Yes
* **Response `200 OK`:** `{ "success": true, "message": "Trip deleted successfully" }`

---

### 🗺️ Itinerary Builder & Sections Module (`/api/v1/trips/:tripId/sections`)

#### 9. `POST /api/v1/trips/:tripId/sections` (Itinerary Builder - Screen 5)
Add single or batch itinerary sections to a trip.

* **Single Section Payload:**
  ```json
  {
    "title": "Hilton Paris Opera Stay",
    "type": "ACCOMMODATION",
    "description": "Hotel reservation with breakfast included",
    "startDate": "2026-10-01",
    "endDate": "2026-10-06",
    "budget": 1200,
    "orderIndex": 1
  }
  ```

* **Batch Sections Payload:**
  ```json
  {
    "sections": [
      {
        "title": "Section 1: Air France Flight to Paris",
        "type": "TRAVEL",
        "description": "Flight from SFO to CDG",
        "startDate": "2026-10-01",
        "endDate": "2026-10-01",
        "budget": 850,
        "orderIndex": 1
      },
      {
        "title": "Section 2: Hilton Paris Opera Stay",
        "type": "ACCOMMODATION",
        "description": "Hotel reservation with breakfast included",
        "startDate": "2026-10-01",
        "endDate": "2026-10-06",
        "budget": 1200,
        "orderIndex": 2
      },
      {
        "title": "Section 3: Louvre & Eiffel Guided Tours",
        "type": "ACTIVITY",
        "description": "Skip-the-line museum passes and Eiffel admission",
        "startDate": "2026-10-02",
        "endDate": "2026-10-05",
        "budget": 450,
        "orderIndex": 3
      }
    ]
  }
  ```
* **Response `201 Created`:** Array of created `ItinerarySection` items.

#### 10. `GET /api/v1/trips/:tripId/sections` (Get Sections - Screen 5)
Retrieves all sections for a trip alongside trip-level budget calculations.
* **Auth Required:** Yes
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "tripId": "5ce00391-8d49-4e49-8862-773a0398583f",
      "tripTitle": "Autumn Escapade in Paris",
      "destinationPlace": "Paris",
      "totalTripBudget": 3000,
      "totalSectionBudget": 2500,
      "remainingTripBudget": 500,
      "sections": [
        {
          "id": "sec_101",
          "tripId": "5ce00391-8d49-4e49-8862-773a0398583f",
          "title": "Section 1: Air France Flight to Paris",
          "type": "TRAVEL",
          "description": "Flight from SFO to CDG",
          "startDate": "2026-10-01T00:00:00.000Z",
          "endDate": "2026-10-01T00:00:00.000Z",
          "budget": 850,
          "orderIndex": 1
        }
      ]
    }
  }
  ```

---

## 📐 5. Database Prisma Schema (`schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum Role {
  USER
  ADMIN
}

enum Visibility {
  PRIVATE
  PUBLIC
}

enum CostIndex {
  BUDGET
  MODERATE
  LUXURY
}

enum ExpenseCategory {
  ACCOMMODATION
  TRANSPORT
  ACTIVITIES
  MEALS
  MISCELLANEOUS
}

enum SectionType {
  TRAVEL
  ACCOMMODATION
  ACTIVITY
  MISCELLANEOUS
}

model User {
  id                String             @id @default(uuid())
  email             String             @unique
  username          String?            @unique
  passwordHash      String
  name              String
  firstName         String?
  lastName          String?
  phoneNumber       String?
  city              String?
  country           String?
  additionalInfo    String?
  avatarUrl         String?
  language          String             @default("en")
  role              Role               @default(USER)
  trips             Trip[]
  savedDestinations SavedDestination[]
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
}

model Trip {
  id               String             @id @default(uuid())
  userId           String
  user             User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  title            String
  destinationPlace String
  description      String?
  coverImage       String?
  startDate        DateTime
  endDate          DateTime
  totalBudget      Float              @default(0)
  currency         String             @default("USD")
  visibility       Visibility         @default(PRIVATE)
  shareToken       String?            @unique @default(uuid())
  sections         ItinerarySection[]
  expenses         Expense[]
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
}

model ItinerarySection {
  id          String      @id @default(uuid())
  tripId      String
  trip        Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  title       String
  type        SectionType @default(ACTIVITY)
  description String?
  startDate   DateTime
  endDate     DateTime
  budget      Float       @default(0)
  orderIndex  Int         @default(1)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model City {
  id                String             @id @default(uuid())
  name              String
  country           String
  region            String
  description       String
  imageUrl          String
  costIndex         CostIndex          @default(MODERATE)
  averageDailyCost  Float
  popularityScore   Int                @default(50)
  catalogActivities CatalogActivity[]
  savedBy           SavedDestination[]
}

model CatalogActivity {
  id              String   @id @default(uuid())
  cityId          String
  city            City     @relation(fields: [cityId], references: [id], onDelete: Cascade)
  title           String
  description     String
  category        String
  estimatedCost   Float    @default(0)
  durationMinutes Int      @default(60)
  imageUrl        String?
  popularityScore Int      @default(50)
}

model Expense {
  id          String          @id @default(uuid())
  tripId      String
  trip        Trip            @relation(fields: [tripId], references: [id], onDelete: Cascade)
  category    ExpenseCategory
  description String
  amount      Float
  date        DateTime
  createdAt   DateTime        @default(now())
}

model SavedDestination {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  cityId    String
  city      City     @relation(fields: [cityId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, cityId])
}
```
