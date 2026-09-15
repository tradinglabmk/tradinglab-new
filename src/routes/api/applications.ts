import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/mongodb";

export const Route = createFileRoute("/api/applications")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const {
            fullName,
            email,
            ageGroup,
            country,
            city,
            contactMethod,
            additionalContact,
            service,
            mentorshipData,
            groupCoachingData,
            tradingSignalsData,
          } = await request.json();

          if (
            !fullName?.trim() ||
            !email?.trim() ||
            !ageGroup?.trim() ||
            !country?.trim() ||
            !city?.trim() ||
            !contactMethod?.trim() ||
            !service?.trim()
          ) {
            return Response.json(
              { error: "Ве молиме пополнете ги задолжителните полиња" },
              { status: 400 },
            );
          }

          const db = await getDb();

          const newApplication = {
            fullName: fullName.trim(),
            email: email.trim(),
            ageGroup: ageGroup.trim(),
            country: country.trim(),
            city: city.trim(),
            contactMethod: contactMethod.trim(),
            additionalContact: additionalContact?.trim() || "",
            service: service.trim(),
            ...(mentorshipData ? { mentorshipData } : {}),
            ...(groupCoachingData ? { groupCoachingData } : {}),
            ...(tradingSignalsData ? { tradingSignalsData } : {}),
            createdAt: new Date().toISOString(),
          };

          const result = await db
            .collection("applications")
            .insertOne(newApplication);

          return Response.json(
            {
              success: true,
              message: "Апликацијата е успешно зачувана",
              applicationId: result.insertedId,
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("Error saving application:", error);
          return Response.json(
            { error: "Failed to save application" },
            { status: 500 },
          );
        }
      },
      GET: async () => {
        try {
          const db = await getDb();
          const applications = await db
            .collection("applications")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

          return Response.json({ applications }, { status: 200 });
        } catch (error) {
          console.error("Error fetching applications:", error);
          return Response.json(
            { error: "Failed to fetch applications" },
            { status: 500 },
          );
        }
      },
      DELETE: async ({ request }) => {
        try {
          const { id } = await request.json();

          if (!id) {
            return Response.json(
              { error: "Application ID is required" },
              { status: 400 },
            );
          }

          const db = await getDb();
          const result = await db
            .collection("applications")
            .deleteOne({ _id: new ObjectId(id) });

          if (result.deletedCount === 0) {
            return Response.json(
              { error: "Application not found" },
              { status: 404 },
            );
          }

          return Response.json(
            { success: true, message: "Апликацијата е успешно избришана" },
            { status: 200 },
          );
        } catch (error) {
          console.error("Error deleting application:", error);
          return Response.json(
            { error: "Failed to delete application" },
            { status: 500 },
          );
        }
      },
    },
  },
});
