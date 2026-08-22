# 🌍 GlobeTrotter Backend API Specification & Data Contracts

This document defines the complete backend REST API schema for **GlobeTrotter — Empowering Personalized Travel Planning**. Frontend developers can use this schema to construct API service layers, TypeScript interfaces, and mock data handlers.

---

## 🔑 1. Base URL & Authentication

* **Base URL:** `https://api.globetrotter.com/v1` (or `http://localhost:5000/api/v1`)
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
  "data": { ... },
  "message": "Operation completed successfully"
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
    "code": "UNAUTHORIZED | NOT_FOUND | VALIDATION_ERROR | OVER_BUDGET_WARNING | INTERNAL_SERVER_ERROR",
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
  avatarUrl?: string;
  language: string; // e.g., 'en', 'es', 'fr'
  role: 'USER' | 'ADMIN';
  createdAt: string; // ISO 8601
  updatedAt: string;
}
```

### `Trip`
```typescript
interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  coverImage?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  durationDays: number;
  totalBudget: number;
  currency: string; // e.g., 'USD', 'EUR'
  visibility: 'PRIVATE' | 'PUBLIC';
  shareToken?: string;
  destinationCount: number;
  createdAt: string;
  updatedAt: string;
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
  costIndex: 'BUDGET' | 'MODERATE' | 'LUXURY'; // 1-3 scale
  averageDailyCost: number;
  popularityScore: number; // 1-100
}
```

### `Stop` (City in Itinerary)
```typescript
interface Stop {
  id: string;
  tripId: string;
  cityId: string;
  city: City;
  arrivalDate: string; // YYYY-MM-DD
  departureDate: string; // YYYY-MM-DD
  orderIndex: number;
  activities: TripActivity[];
}
```

### `CatalogActivity`
```typescript
interface CatalogActivity {
  id: string;
  cityId: string;
  title: string;
  description: string;
  category: 'SIGHTSEEING' | 'FOOD_TOUR' | 'ADVENTURE' | 'CULTURE' | 'RELAXATION' | 'SHOPPING';
  estimatedCost: number;
  durationMinutes: number;
  imageUrl?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}
```

### `TripActivity`
```typescript
interface TripActivity {
  id: string;
  stopId: string;
  catalogActivityId?: string;
  title: string;
  category: string;
  scheduledDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm (24hr)
  durationMinutes: number;
  cost: number;
  notes?: string;
  orderIndex: number;
}
```

### `BudgetBreakdown`
```typescript
interface BudgetBreakdown {
  totalBudget: number;
  estimatedTotalCost: number;
  remainingBudget: number;
  currency: string;
  averageDailyCost: number;
  isOverBudget: boolean;
  categories: {
    transport: number;
    accommodation: number;
    activities: number;
    meals: number;
    miscellaneous: number;
  };
  dailySpending: Array<{
    date: string;
    city: string;
    totalCost: number;
    isOverDailyAverage: boolean;
  }>;
}
```

---

## 📡 4. Comprehensive API Endpoints

### 🟢 Auth Module (`/api/v1/auth`)

#### 1. `POST /api/v1/auth/signup`
Creates a new user account.
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "phoneNumber": "+1234567890",
    "country": "United States",
    "city": "New York",
    "additionalInfo": "Avid hiker and food enthusiast"
  }
  ```
* **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "usr_123",
        "name": "Jane Doe",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@example.com",
        "phoneNumber": "+1234567890",
        "country": "United States",
        "city": "New York",
        "additionalInfo": "Avid hiker and food enthusiast",
        "avatarUrl": null,
        "language": "en"
      },
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

#### 2. `POST /api/v1/auth/login`
Authenticates a user and returns JWT.
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
* **Response `200 OK`:** Same payload as signup.

#### 3. `POST /api/v1/auth/forgot-password`
Requests password reset email.
* **Request Body:** `{ "email": "jane@example.com" }`
* **Response `200 OK`:** `{ "success": true, "message": "Password reset link sent to your email." }`

---

### 👤 User & Profile Module (`/api/v1/users`)

#### 4. `GET /api/v1/users/profile`
Get current user's profile and saved preferences.
* **Auth Required:** Yes

#### 5. `PUT /api/v1/users/profile`
Update profile details.
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "name": "Jane Smith",
    "avatarUrl": "https://cdn.globetrotter.com/avatars/jane.jpg",
    "language": "es"
  }
  ```

#### 6. `DELETE /api/v1/users/profile`
Delete account and all associated trips.

#### 7. `GET /api/v1/users/saved-destinations`
Get bookmarked cities list.

#### 8. `POST /api/v1/users/saved-destinations`
Save or remove destination bookmark.
* **Request Body:** `{ "cityId": "city_789", "action": "SAVE" }` // or "REMOVE"

---

### 📊 Dashboard Module (`/api/v1/dashboard`)

#### 9. `GET /api/v1/dashboard`
Fetches personalized home screen data.
* **Auth Required:** Yes
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "name": "Jane"
      },
      "recentTrips": [
        {
          "id": "trip_001",
          "title": "Euro Summer 2026",
          "startDate": "2026-07-01",
          "endDate": "2026-07-15",
          "destinationCount": 3,
          "coverImage": "https://images.unsplash.com/photo-paris.jpg",
          "totalBudget": 3500,
          "estimatedCost": 3100
        }
      ],
      "recommendedDestinations": [
        {
          "id": "city_tokyo",
          "name": "Tokyo",
          "country": "Japan",
          "imageUrl": "https://images.unsplash.com/photo-tokyo.jpg",
          "costIndex": "MODERATE",
          "averageDailyCost": 180
        }
      ],
      "budgetHighlights": {
        "activeTripsCount": 2,
        "totalPlannedBudget": 6000,
        "totalEstimatedExpenses": 5400
      }
    }
  }
  ```

---

### ✈️ Trips Management Module (`/api/v1/trips`)

#### 10. `POST /api/v1/trips` (Create Trip Screen)
Initialize a new travel plan.
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "title": "Japanese Alpine Adventure",
    "description": "2-week trip exploring Tokyo, Kyoto, and Nagano.",
    "startDate": "2026-10-10",
    "endDate": "2026-10-24",
    "totalBudget": 4000,
    "currency": "USD",
    "coverImage": "https://images.unsplash.com/photo-fuji.jpg"
  }
  ```

#### 11. `GET /api/v1/trips` (My Trips Screen)
List user's trips with filters and pagination.
* **Query Params:** `status=upcoming|past|draft`, `search=keywords`, `page=1`, `limit=10`
* **Response `200 OK`:** Array of `Trip` objects.

#### 12. `GET /api/v1/trips/:tripId`
Get full details of a specific trip including stops, activities, and budget summary.

#### 13. `PUT /api/v1/trips/:tripId`
Update trip metadata (dates, title, budget, cover photo).

#### 14. `DELETE /api/v1/trips/:tripId`
Delete a trip and its stops.

#### 15. `POST /api/v1/trips/:tripId/clone`
Copy a public/shared trip into the current user's account.

---

### 🗺️ Itinerary Builder & Stops Module (`/api/v1/trips/:tripId/stops`)

#### 16. `POST /api/v1/trips/:tripId/stops`
Add a city stop to an itinerary.
* **Request Body:**
  ```json
  {
    "cityId": "city_kyoto",
    "arrivalDate": "2026-10-14",
    "departureDate": "2026-10-18",
    "orderIndex": 2
  }
  ```

#### 17. `PUT /api/v1/trips/:tripId/stops/:stopId`
Update stop dates or notes.

#### 18. `DELETE /api/v1/trips/:tripId/stops/:stopId`
Remove city stop from itinerary.

#### 19. `PUT /api/v1/trips/:tripId/stops/reorder`
Reorder multi-city stops sequence.
* **Request Body:**
  ```json
  {
    "stopOrder": [
      { "stopId": "stop_1", "orderIndex": 1 },
      { "stopId": "stop_2", "orderIndex": 2 }
    ]
  }
  ```

---

### 🎨 Stop Activities & Timeline Builder (`/api/v1/trips/:tripId/activities`)

#### 20. `POST /api/v1/trips/:tripId/stops/:stopId/activities`
Add an activity to a specific stop.
* **Request Body:**
  ```json
  {
    "catalogActivityId": "act_fushimi_inari",
    "title": "Fushimi Inari Shrine Hike",
    "category": "CULTURE",
    "scheduledDate": "2026-10-15",
    "startTime": "08:30",
    "durationMinutes": 180,
    "cost": 0,
    "notes": "Go early to avoid crowds!"
  }
  ```

#### 21. `PUT /api/v1/trips/:tripId/activities/:activityId`
Update scheduled activity details (time, cost, notes).

#### 22. `DELETE /api/v1/trips/:tripId/activities/:activityId`
Delete activity from stop.

#### 23. `PUT /api/v1/trips/:tripId/activities/reorder`
Reorder activities within a day / drag-to-reorder.
* **Request Body:**
  ```json
  {
    "activityOrder": [
      { "activityId": "act_101", "startTime": "09:00", "orderIndex": 1 },
      { "activityId": "act_102", "startTime": "11:30", "orderIndex": 2 }
    ]
  }
  ```

---

### 🏙️ Discovery Module — City & Activity Search (`/api/v1/cities`, `/api/v1/activities`)

#### 24. `GET /api/v1/cities` (City Search Screen)
Search global destinations with filters.
* **Query Params:** `q=Paris`, `country=France`, `costIndex=BUDGET|MODERATE|LUXURY`, `popular=true`, `page=1`, `limit=20`
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "city_paris",
        "name": "Paris",
        "country": "France",
        "region": "Europe",
        "description": "City of Light, famous for art, cuisine, and culture.",
        "imageUrl": "https://images.unsplash.com/photo-paris.jpg",
        "costIndex": "LUXURY",
        "averageDailyCost": 250,
        "popularityScore": 98
      }
    ]
  }
  ```

#### 25. `GET /api/v1/cities/:cityId`
Get single city details and top recommended activities.

#### 26. `GET /api/v1/activities` (Activity Search Screen)
Search activities catalog.
* **Query Params:** `cityId=city_paris`, `category=FOOD_TOUR`, `maxCost=100`, `maxDuration=120`

---

### 💰 Budget & Cost Breakdown Module (`/api/v1/trips/:tripId/budget`)

#### 27. `GET /api/v1/trips/:tripId/budget` (Trip Budget Screen)
Get financial summary and automated breakdown.
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "totalBudget": 3000,
      "estimatedTotalCost": 2850,
      "remainingBudget": 150,
      "currency": "USD",
      "averageDailyCost": 190,
      "isOverBudget": false,
      "categories": {
        "transport": 800,
        "accommodation": 1200,
        "activities": 450,
        "meals": 400,
        "miscellaneous": 0
      },
      "dailySpending": [
        {
          "date": "2026-10-10",
          "city": "Tokyo",
          "totalCost": 220,
          "isOverDailyAverage": true
        }
      ],
      "alerts": [
        {
          "date": "2026-10-10",
          "type": "OVER_DAILY_AVERAGE",
          "message": "Spending on 2026-10-10 exceeds daily average target of $190 by $30."
        }
      ]
    }
  }
  ```

#### 28. `POST /api/v1/trips/:tripId/expenses`
Add custom fixed expense item (e.g. Flight tickets, Hotel reservation).
* **Request Body:**
  ```json
  {
    "category": "TRANSPORT", // "ACCOMMODATION" | "TRANSPORT" | "MEALS" | "MISC"
    "description": "Flight from JFK to NRT",
    "amount": 750,
    "date": "2026-10-10"
  }
  ```

---

### 📅 Timeline & Calendar View Module (`/api/v1/trips/:tripId/timeline`)

#### 29. `GET /api/v1/trips/:tripId/timeline` (Trip Calendar Screen)
Returns day-by-day structured itinerary flow optimized for visual timeline or calendar view.
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "tripId": "trip_001",
      "days": [
        {
          "date": "2026-10-10",
          "dayNumber": 1,
          "stopId": "stop_tokyo",
          "cityName": "Tokyo",
          "activities": [
            {
              "id": "act_1",
              "title": "Arrive at Narita & Express Train",
              "category": "TRANSPORT",
              "startTime": "14:00",
              "durationMinutes": 120,
              "cost": 30
            }
          ]
        }
      ]
    }
  }
  ```

---

### 🔗 Public Sharing & Social Module (`/api/v1/public/trips`, `/api/v1/trips/:tripId/share`)

#### 30. `PUT /api/v1/trips/:tripId/share`
Toggle public visibility and get unique share URL.
* **Request Body:** `{ "visibility": "PUBLIC" }`
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "visibility": "PUBLIC",
      "shareUrl": "https://globetrotter.app/shared/t_98374hkj293"
    }
  }
  ```

#### 31. `GET /api/v1/public/trips/:shareToken` (Shared Itinerary Screen)
Fetch read-only public trip details for non-authenticated or guest users.

---

### 🛡️ Admin & Analytics Module (`/api/v1/admin`)

#### 32. `GET /api/v1/admin/analytics`
Admin dashboard summary metrics.
* **Auth Required:** Yes (Role: ADMIN)
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 1250,
      "totalTripsCreated": 3420,
      "topCities": [
        { "cityName": "Paris", "tripCount": 420 },
        { "cityName": "Tokyo", "tripCount": 390 }
      ],
      "topCategories": [
        { "category": "CULTURE", "count": 1200 },
        { "category": "FOOD_TOUR", "count": 980 }
      ]
    }
  }
  ```

---

### 📸 File & Media Upload Module (`/api/v1/upload`)

#### 33. `POST /api/v1/upload`
Upload trip cover photo or user profile avatar.
* **Auth Required:** Yes
* **Content-Type:** `multipart/form-data`
* **Form Field:** `file` (image file binary)
* **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "fileUrl": "https://cdn.globetrotter.com/uploads/cover_98234.jpg",
      "fileName": "cover_98234.jpg",
      "mimeType": "image/jpeg",
      "sizeBytes": 482100
    }
  }
  ```

---

## 📐 5. Recommended Prisma Schema (`schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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

model User {
  id                String             @id @default(uuid())
  email             String             @unique
  passwordHash      String
  name              String
  avatarUrl         String?
  language          String             @default("en")
  role              Role               @default(USER)
  trips             Trip[]
  savedDestinations SavedDestination[]
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
}

model Trip {
  id               String       @id @default(uuid())
  userId           String
  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  title            String
  description      String?
  coverImage       String?
  startDate        DateTime
  endDate          DateTime
  totalBudget      Float        @default(0)
  currency         String       @default("USD")
  visibility       Visibility   @default(PRIVATE)
  shareToken       String?      @unique @default(uuid())
  stops            Stop[]
  expenses         Expense[]
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
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
  stops             Stop[]
  catalogActivities CatalogActivity[]
  savedBy           SavedDestination[]
}

model Stop {
  id            String         @id @default(uuid())
  tripId        String
  trip          Trip           @relation(fields: [tripId], references: [id], onDelete: Cascade)
  cityId        String
  city          City           @relation(fields: [cityId], references: [id])
  arrivalDate   DateTime
  departureDate DateTime
  orderIndex    Int
  activities    TripActivity[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model CatalogActivity {
  id              String         @id @default(uuid())
  cityId          String
  city            City           @relation(fields: [cityId], references: [id], onDelete: Cascade)
  title           String
  description     String
  category        String
  estimatedCost   Float          @default(0)
  durationMinutes Int            @default(60)
  imageUrl        String?
  tripActivities  TripActivity[]
}

model TripActivity {
  id                String           @id @default(uuid())
  stopId            String
  stop              Stop             @relation(fields: [stopId], references: [id], onDelete: Cascade)
  catalogActivityId String?
  catalogActivity   CatalogActivity? @relation(fields: [catalogActivityId], references: [id])
  title             String
  category          String
  scheduledDate     DateTime
  startTime         String?
  durationMinutes   Int              @default(60)
  cost              Float            @default(0)
  notes             String?
  orderIndex        Int
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
