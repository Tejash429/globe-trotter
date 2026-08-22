<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🌍 GlobeTrotter — Empowering Personalized Travel Planning

## 🌟 Overall Vision
The overarching vision for **GlobeTrotter** is to become a personalized, intelligent, and collaborative platform that transforms the way individuals plan and experience travel. The platform aims to empower users to dream, design, and organize trips with ease by offering an end-to-end travel planning tool that combines flexibility and interactivity. 

GlobeTrotter envisions a world where users can explore global destinations, visualize their journeys through structured itineraries, make cost-effective decisions, and share their travel plans within a community — making travel planning as exciting as the trip itself.

---

## 🎯 Mission
The mission is to build a user-centric, responsive application that simplifies the complexity of planning multi-city travel. The platform provides travelers with intuitive tools to:
- 📍 Add and manage travel stops and city durations.
- 🔍 Explore cities and activities of interest with cost & popularity meta-data.
- 💰 Estimate trip budgets automatically with category breakdowns.
- 📅 Visualize timelines and daily plans on interactive calendars.
- 🌐 Share trip plans publicly or with friends and clone itineraries.

---

## 🛠️ Complete Feature Specification (13 Core Screens)

### 1. 🔑 Login / Signup Screen
* **Description:** Entry point allowing users to create or access their account.
* **Purpose:** Authenticate users to manage personal travel plans securely.
* **Key Components:** Email & password fields, Login button, Signup link, "Forgot Password", client & server validation.

### 2. 📊 Dashboard / Home Screen
* **Description:** Central hub showing upcoming trips, popular cities, and quick actions.
* **Purpose:** Allows users to navigate to their trips and explore travel inspiration.
* **Key Components:** Personal welcome message, recent trip cards list, "Plan New Trip" CTA button, recommended destinations carousel/grid, budget highlights.

### 3. ✈️ Create Trip Screen
* **Description:** Form to initiate a new travel plan by providing core trip parameters.
* **Purpose:** Begins the process of creating a personalized travel plan.
* **Key Components:** Trip title, start & end dates, trip description, optional cover photo upload, save button.

### 4. 🧳 My Trips (Trip List) Screen
* **Description:** List view of all trips created by the user with summary metadata.
* **Purpose:** Easily access, manage, and filter existing, upcoming, or past trips.
* **Key Components:** Trip cards showing name, date range, destination city count, view/edit/delete quick actions, status tabs (Upcoming, Past, Draft).

### 5. 🗺️ Itinerary Builder Screen
* **Description:** Interactive interface to add cities, dates, and activities for each stop.
* **Purpose:** Construct the full day-wise multi-city trip plan.
* **Key Components:** "Add Stop" button, city selection, travel date ranges, assign activities to stops, drag-and-drop city stop reordering.

### 6. 👁️ Itinerary View Screen
* **Description:** Visual representation of the completed trip itinerary.
* **Purpose:** Review the full plan in a structured format (timeline or grouped by cities).
* **Key Components:** Day-wise layout, city headers, activity blocks with time and cost, view mode toggle (Calendar / List view).

### 7. 🏙️ City Search Screen
* **Description:** Search interface to find and add cities to a trip with contextual metadata.
* **Purpose:** Discover and include relevant cities in the itinerary.
* **Key Components:** Search bar, list of cities with country, cost index (Budget, Moderate, Luxury), popularity score, "Add to Trip" button, filters by country/region.

### 8. 🎭 Activity Search Screen
* **Description:** Browse and select things to do in each stop, categorized by interest or cost.
* **Purpose:** Enrich trips with experiences like sightseeing, food tours, or adventure activities.
* **Key Components:** Activity filters (category, cost, duration), add/remove buttons, quick view popup of descriptions and images.

### 9. 💰 Trip Budget & Cost Breakdown Screen
* **Description:** Summarized financial view showing estimated total cost and category breakdowns.
* **Purpose:** Helps travelers stay informed and within budget.
* **Key Components:** Cost breakdown by categories (transport, stay, activities, meals), pie/bar visual charts, average cost per day, alerts for overbudget days.

### 10. 📅 Trip Calendar / Timeline Screen
* **Description:** Calendar-based or vertical timeline view of the full itinerary.
* **Purpose:** Helps users visualize the journey flow and daily schedule.
* **Key Components:** Calendar grid / vertical timeline component, expandable day views, drag-to-reorder activities, quick editing options.

### 11. 🔗 Shared / Public Itinerary View Screen
* **Description:** Public page displaying a shareable version of an itinerary.
* **Purpose:** Allows others to view, get inspired, or copy the trip.
* **Key Components:** Public URL link, itinerary summary, "Copy Trip" clone button, social media sharing, read-only guest view.

### 12. 👤 User Profile / Settings Screen
* **Description:** User settings page to update profile information and preferences.
* **Purpose:** Enables users to control their profile data, preferences, and privacy.
* **Key Components:** Editable profile fields (name, photo, email), language preference selector, delete account option, saved/bookmarked destinations list.

### 13. 📈 Admin / Analytics Dashboard Screen
* **Description:** Admin-only interface to track platform usage, user trends, and trip data.
* **Purpose:** Helps in monitoring app adoption, popular cities, and user engagement.
* **Key Components:** Metric cards, charts of trips created, top cities & activities, user management tools.

---

## 🎨 Mockups & Design Reference
* **Excalidraw Design Wireframe:** [GlobeTrotter Excalidraw Mockups](https://link.excalidraw.com/l/65VNwvy7c4X/6CzbTgEeSr1)

---

## 🏗️ Technology Architecture

### Frontend
- **Framework:** Next.js (App Router), React 19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript 5

### Backend
- **Framework:** Express.js (v5)
- **Database & ORM:** PostgreSQL / SQLite via Prisma ORM
- **Authentication:** JWT (`jsonwebtoken`) & `bcrypt` password hashing
- **Validation:** `zod` schema validation
- **File Uploads:** `multer` multipart handling
- **API Spec & Contracts:** Detailed in `API_SCHEMA.md`
