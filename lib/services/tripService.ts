import { prisma } from "../prisma";
import {
  createTripSchema,
  updateTripSchema,
  createSectionSchema,
  createBatchSectionsSchema,
  updateSectionSchema,
  CreateTripInput,
  UpdateTripInput,
  CreateSectionInput,
  UpdateSectionInput,
  sectionTypeEnum,
} from "../validations/trip";
import { SectionType } from "@prisma/client";

// Mock helper to generate top place/activity suggestions based on destinationPlace for Screen 4
function getDestinationSuggestions(destinationPlace: string) {
  const place = destinationPlace.trim();
  return [
    {
      id: "sug_1",
      title: `Explore Central ${place}`,
      category: "SIGHTSEEING",
      description: `Must-see landmarks and historic walking tours around central ${place}.`,
      estimatedCost: 25,
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    },
    {
      id: "sug_2",
      title: `${place} Food & Culinary Experience`,
      category: "FOOD_TOUR",
      description: `Taste local food specialties and famous markets in ${place}.`,
      estimatedCost: 65,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    },
    {
      id: "sug_3",
      title: `Art & Museum Tour in ${place}`,
      category: "CULTURE",
      description: `Visit top museums, art galleries, and cultural centers.`,
      estimatedCost: 35,
      imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
    },
    {
      id: "sug_4",
      title: `${place} Day Trip & Scenic Adventure`,
      category: "ADVENTURE",
      description: `Scenic outdoor excursions and photo spots just outside ${place}.`,
      estimatedCost: 50,
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    },
    {
      id: "sug_5",
      title: `Evening Highlights & Skyline View`,
      category: "RELAXATION",
      description: `Panoramic rooftop views and night walks in ${place}.`,
      estimatedCost: 40,
      imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785",
    },
    {
      id: "sug_6",
      title: `Local Shopping & Artisan Markets`,
      category: "SHOPPING",
      description: `Shop for unique souvenirs and handicrafts in ${place}.`,
      estimatedCost: 0,
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    },
  ];
}

export class TripService {
  // 1. Create Trip (Screen 4)
  static async createTrip(userId: string, input: CreateTripInput) {
    const validatedData = createTripSchema.parse(input);

    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);

    if (endDate < startDate) {
      const error: any = new Error("End date cannot be earlier than start date");
      error.statusCode = 400;
      error.code = "INVALID_DATE_RANGE";
      throw error;
    }

    const trip = await prisma.trip.create({
      data: {
        userId,
        title: validatedData.title,
        destinationPlace: validatedData.destinationPlace,
        description: validatedData.description,
        startDate,
        endDate,
        totalBudget: validatedData.totalBudget || 0,
        currency: validatedData.currency || "USD",
        coverImage: validatedData.coverImage,
      },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    const suggestions = getDestinationSuggestions(validatedData.destinationPlace);

    return {
      trip,
      suggestions,
    };
  }

  // 2. List User Trips (Screen 6)
  static async getTrips(
    userId: string,
    options: {
      status?: "ongoing" | "upcoming" | "completed";
      search?: string;
      sortBy?: "startDate" | "title" | "totalBudget";
      page?: number;
      limit?: number;
    } = {}
  ) {
    const { status, search, sortBy = "startDate", page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    const now = new Date();

    const whereClause: any = { userId };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { destinationPlace: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "ongoing") {
      whereClause.startDate = { lte: now };
      whereClause.endDate = { gte: now };
    } else if (status === "upcoming") {
      whereClause.startDate = { gt: now };
    } else if (status === "completed") {
      whereClause.endDate = { lt: now };
    }

    const [trips, totalCount] = await Promise.all([
      prisma.trip.findMany({
        where: whereClause,
        orderBy: { [sortBy]: "asc" },
        skip,
        take: limit,
        include: {
          sections: true,
        },
      }),
      prisma.trip.count({ where: whereClause }),
    ]);

    const formattedTrips = trips.map((t) => {
      let tripStatus = "upcoming";
      if (t.startDate <= now && t.endDate >= now) {
        tripStatus = "ongoing";
      } else if (t.endDate < now) {
        tripStatus = "completed";
      }

      const totalSectionBudget = t.sections.reduce((acc, sec) => acc + sec.budget, 0);

      return {
        ...t,
        status: tripStatus,
        sectionsCount: t.sections.length,
        totalSectionBudget,
      };
    });

    return {
      trips: formattedTrips,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  // 3. Get Trip By ID
  static async getTripById(tripId: string, userId: string) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            activities: {
              orderBy: { orderIndex: "asc" },
            },
          },
        },
        expenses: true,
      },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const totalSectionBudget = trip.sections.reduce((acc, s) => acc + s.budget, 0);
    const totalExpenses = trip.expenses.reduce((acc, e) => acc + e.amount, 0);
    const totalEstimatedCost = totalSectionBudget + totalExpenses;

    return {
      ...trip,
      sectionsCount: trip.sections.length,
      totalSectionBudget,
      totalExpenses,
      totalEstimatedCost,
      remainingBudget: trip.totalBudget - totalEstimatedCost,
    };
  }

  // 4. Update Trip
  static async updateTrip(tripId: string, userId: string, input: UpdateTripInput) {
    const validatedData = updateTripSchema.parse(input);

    const existingTrip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!existingTrip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const updateData: any = { ...validatedData };
    if (validatedData.startDate) updateData.startDate = new Date(validatedData.startDate);
    if (validatedData.endDate) updateData.endDate = new Date(validatedData.endDate);

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
      include: { sections: true },
    });

    return updatedTrip;
  }

  // 5. Delete Trip
  static async deleteTrip(tripId: string, userId: string) {
    const existingTrip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!existingTrip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    await prisma.trip.delete({
      where: { id: tripId },
    });

    return { message: "Trip deleted successfully" };
  }

  // -------------------------------------------------------------
  // ITINERARY SECTIONS (Screen 5)
  // -------------------------------------------------------------

  // 6. Add Single Section to Trip (Screen 5)
  static async addSection(tripId: string, userId: string, input: CreateSectionInput) {
    const validatedData = createSectionSchema.parse(input);

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const section = await prisma.itinerarySection.create({
      data: {
        tripId,
        title: validatedData.title,
        type: validatedData.type as SectionType,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        budget: validatedData.budget || 0,
        orderIndex: validatedData.orderIndex || 1,
      },
    });

    return section;
  }

  // 7. Add Batch Sections to Trip (Screen 5 - Multiple Sections at once)
  static async addBatchSections(tripId: string, userId: string, inputs: CreateSectionInput[]) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const sectionsToCreate = inputs.map((input, idx) => {
      const validated = createSectionSchema.parse(input);
      return {
        tripId,
        title: validated.title,
        type: validated.type as SectionType,
        description: validated.description,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        budget: validated.budget || 0,
        orderIndex: validated.orderIndex || idx + 1,
      };
    });

    await prisma.itinerarySection.createMany({
      data: sectionsToCreate,
    });

    const createdSections = await prisma.itinerarySection.findMany({
      where: { tripId },
      orderBy: { orderIndex: "asc" },
    });

    return createdSections;
  }

  // 8. Get Sections for Trip
  static async getTripSections(tripId: string, userId: string) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            activities: {
              orderBy: { orderIndex: "asc" },
            },
          },
        },
      },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const totalSectionBudget = trip.sections.reduce((acc, s) => acc + s.budget, 0);

    return {
      tripId,
      tripTitle: trip.title,
      destinationPlace: trip.destinationPlace,
      totalTripBudget: trip.totalBudget,
      totalSectionBudget,
      remainingTripBudget: trip.totalBudget - totalSectionBudget,
      sections: trip.sections,
    };
  }

  // 9. Update Section
  static async updateSection(sectionId: string, tripId: string, userId: string, input: UpdateSectionInput) {
    const validatedData = updateSectionSchema.parse(input);

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const section = await prisma.itinerarySection.findFirst({
      where: { id: sectionId, tripId },
    });

    if (!section) {
      const error: any = new Error("Itinerary section not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const updateData: any = { ...validatedData };
    if (validatedData.startDate) updateData.startDate = new Date(validatedData.startDate);
    if (validatedData.endDate) updateData.endDate = new Date(validatedData.endDate);

    const updatedSection = await prisma.itinerarySection.update({
      where: { id: sectionId },
      data: updateData,
    });

    return updatedSection;
  }

  // 10. Delete Section
  static async deleteSection(sectionId: string, tripId: string, userId: string) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const section = await prisma.itinerarySection.findFirst({
      where: { id: sectionId, tripId },
    });

    if (!section) {
      const error: any = new Error("Itinerary section not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    await prisma.itinerarySection.delete({
      where: { id: sectionId },
    });

    return { message: "Itinerary section deleted successfully" };
  }

  // 11. Reorder Sections
  static async reorderSections(
    tripId: string,
    userId: string,
    sectionOrders: Array<{ sectionId: string; orderIndex: number }>
  ) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    await Promise.all(
      sectionOrders.map((item) =>
        prisma.itinerarySection.update({
          where: { id: item.sectionId },
          data: { orderIndex: item.orderIndex },
        })
      )
    );

    const reorderedSections = await prisma.itinerarySection.findMany({
      where: { tripId },
      orderBy: { orderIndex: "asc" },
      include: {
        activities: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    return reorderedSections;
  }

  // -------------------------------------------------------------
  // SECTION ACTIVITIES MODULE
  // -------------------------------------------------------------

  // 12. Add Activity to Section Stop
  static async addActivity(tripId: string, sectionId: string, userId: string, input: any) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const section = await prisma.itinerarySection.findFirst({
      where: { id: sectionId, tripId },
    });

    if (!section) {
      const error: any = new Error("Itinerary section stop not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const activity = await prisma.sectionActivity.create({
      data: {
        sectionId,
        title: input.title,
        category: input.category || "SIGHTSEEING",
        description: input.description,
        cost: input.cost || 0,
        time: input.time,
        openTripMapXid: input.openTripMapXid,
        orderIndex: input.orderIndex || 1,
      },
    });

    return activity;
  }

  // 13. Get Section with Activities
  static async getSectionWithActivities(tripId: string, sectionId: string, userId: string) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const section = await prisma.itinerarySection.findFirst({
      where: { id: sectionId, tripId },
      include: {
        activities: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!section) {
      const error: any = new Error("Itinerary section stop not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const totalActivityCost = section.activities.reduce((acc, act) => acc + act.cost, 0);

    return {
      ...section,
      tripTitle: trip.title,
      destinationPlace: trip.destinationPlace,
      totalActivityCost,
      remainingSectionBudget: section.budget - totalActivityCost,
    };
  }

  // 14. Update Activity
  static async updateActivity(tripId: string, sectionId: string, activityId: string, userId: string, input: any) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const activity = await prisma.sectionActivity.findFirst({
      where: { id: activityId, sectionId },
    });

    if (!activity) {
      const error: any = new Error("Section activity not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const updatedActivity = await prisma.sectionActivity.update({
      where: { id: activityId },
      data: input,
    });

    return updatedActivity;
  }

  // 15. Delete Activity
  static async deleteActivity(tripId: string, sectionId: string, activityId: string, userId: string) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      const error: any = new Error("Trip not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const activity = await prisma.sectionActivity.findFirst({
      where: { id: activityId, sectionId },
    });

    if (!activity) {
      const error: any = new Error("Section activity not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    await prisma.sectionActivity.delete({
      where: { id: activityId },
    });

    return { message: "Section activity deleted successfully" };
  }
}
