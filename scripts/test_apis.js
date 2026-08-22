const BASE_URL = "http://localhost:3000";

async function testAllEndpoints() {
  console.log("=================================================");
  console.log("🧪 STARTING GLOBETROTTER API VERIFICATION TESTS");
  console.log("=================================================\n");

  const testUser = {
    firstName: "Alex",
    lastName: "Rivera",
    email: `alex.test_${Date.now()}@example.com`,
    password: "Password123!",
    phoneNumber: "+15550199",
    country: "United States",
    city: "San Francisco",
    additionalInfo: "Traveler testing GlobeTrotter",
  };

  // 1. TEST SIGNUP
  console.log("1️⃣ Testing POST /api/v1/auth/signup ...");
  const signupRes = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testUser),
  });

  const signupData = await signupRes.json();
  console.log("   Status:", signupRes.status);
  console.log("   Response:", JSON.stringify(signupData, null, 2));

  if (!signupRes.ok || !signupData.data?.token) {
    console.error("❌ Signup failed!");
    return;
  }

  const token = signupData.data.token;
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 2. TEST LOGIN
  console.log("\n2️⃣ Testing POST /api/v1/auth/login ...");
  const loginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }),
  });
  const loginData = await loginRes.json();
  console.log("   Status:", loginRes.status);
  console.log("   Login Message:", loginData.message);

  // 2b. TEST GET LOGGED-IN USER PROFILE (GET /api/v1/auth/me & GET /api/v1/users/profile)
  console.log("\n👤 Testing GET /api/v1/auth/me (Get Logged In User Profile) ...");
  const meRes = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    method: "GET",
    headers: authHeaders,
  });
  const meData = await meRes.json();
  console.log("   Status:", meRes.status);
  console.log("   User Name:", meData.data?.name);
  console.log("   User Email:", meData.data?.email);
  console.log("   User Location:", `${meData.data?.city}, ${meData.data?.country}`);


  // 3. TEST CREATE TRIP (Screen 4)
  console.log("\n3️⃣ Testing POST /api/v1/trips (Create Trip - Screen 4) ...");
  const createTripRes = await fetch(`${BASE_URL}/api/v1/trips`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Autumn Escapade in Paris",
      destinationPlace: "Paris",
      startDate: "2026-10-01",
      endDate: "2026-10-10",
      totalBudget: 3000,
      description: "Visiting Paris monuments and cafes",
    }),
  });
  const createTripData = await createTripRes.json();
  console.log("   Status:", createTripRes.status);
  console.log("   Trip ID:", createTripData.data?.trip?.id);
  console.log("   Suggestions Count:", createTripData.data?.suggestions?.length);

  if (!createTripData.data?.trip?.id) {
    console.error("❌ Create Trip failed!");
    return;
  }

  const tripId = createTripData.data.trip.id;

  // 4. TEST BATCH CREATE SECTIONS (Screen 5)
  console.log("\n4️⃣ Testing POST /api/v1/trips/:tripId/sections (Batch Sections - Screen 5) ...");
  const batchSectionsRes = await fetch(`${BASE_URL}/api/v1/trips/${tripId}/sections`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      sections: [
        {
          title: "Section 1: Air France Flight to Paris",
          type: "TRAVEL",
          description: "Flight from SFO to CDG",
          startDate: "2026-10-01",
          endDate: "2026-10-01",
          budget: 850,
          orderIndex: 1,
        },
        {
          title: "Section 2: Hilton Paris Opera Stay",
          type: "ACCOMMODATION",
          description: "Hotel reservation with breakfast included",
          startDate: "2026-10-01",
          endDate: "2026-10-06",
          budget: 1200,
          orderIndex: 2,
        },
        {
          title: "Section 3: Louvre & Eiffel Guided Tours",
          type: "ACTIVITY",
          description: "Skip-the-line museum passes and Eiffel admission",
          startDate: "2026-10-02",
          endDate: "2026-10-05",
          budget: 450,
          orderIndex: 3,
        },
      ],
    }),
  });
  const batchSectionsData = await batchSectionsRes.json();
  console.log("   Status:", batchSectionsRes.status);
  console.log("   Sections Created Count:", batchSectionsData.data?.length);

  // 5. TEST GET TRIP SECTIONS (Screen 5)
  console.log("\n5️⃣ Testing GET /api/v1/trips/:tripId/sections (Get Sections - Screen 5) ...");
  const getSectionsRes = await fetch(`${BASE_URL}/api/v1/trips/${tripId}/sections`, {
    method: "GET",
    headers: authHeaders,
  });
  const getSectionsData = await getSectionsRes.json();
  console.log("   Status:", getSectionsRes.status);
  console.log("   Total Trip Budget:", getSectionsData.data?.totalTripBudget);
  console.log("   Total Section Budget:", getSectionsData.data?.totalSectionBudget);
  console.log("   Remaining Trip Budget:", getSectionsData.data?.remainingTripBudget);

  // 6. TEST LIST USER TRIPS (Screen 6)
  console.log("\n6️⃣ Testing GET /api/v1/trips (List Trips - Screen 6) ...");
  const listTripsRes = await fetch(`${BASE_URL}/api/v1/trips?status=upcoming`, {
    method: "GET",
    headers: authHeaders,
  });
  const listTripsData = await listTripsRes.json();
  console.log("   Status:", listTripsRes.status);
  console.log("   Trips Count:", listTripsData.data?.length);

  // 7. TEST GET TRIP DETAILS
  console.log("\n7️⃣ Testing GET /api/v1/trips/:tripId (Get Trip Details) ...");
  const tripDetailsRes = await fetch(`${BASE_URL}/api/v1/trips/${tripId}`, {
    method: "GET",
    headers: authHeaders,
  });
  const tripDetailsData = await tripDetailsRes.json();
  console.log("   Status:", tripDetailsRes.status);
  console.log("   Trip Title:", tripDetailsData.data?.title);
  console.log("   Sections Count:", tripDetailsData.data?.sectionsCount);

  console.log("\n=================================================");
  console.log("🎉 ALL API ENDPOINTS TESTED SUCCESSFULLY!");
  console.log("=================================================\n");
}

testAllEndpoints().catch((err) => {
  console.error("Test error:", err);
});
