import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/mongodb";

export const Route = createFileRoute("/api/admin/payments")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const db = await getDb();
          const payments = await db
            .collection("payments")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
          return Response.json(
            { payments },
            {
              status: 200,
              headers: { "Cache-Control": "no-store, max-age=0" },
            },
          );
        } catch (error) {
          console.error("Error fetching payments:", error);
          return Response.json(
            { error: "Failed to fetch payments" },
            { status: 500 },
          );
        }
      },
      DELETE: async ({ request }) => {
        try {
          const { id } = await request.json();
          if (!id) {
            return Response.json(
              { error: "Payment ID is required" },
              { status: 400 },
            );
          }
          const db = await getDb();
          const result = await db
            .collection("payments")
            .deleteOne({ _id: new ObjectId(id) });
          if (result.deletedCount === 0) {
            return Response.json(
              { error: "Payment not found" },
              { status: 404 },
            );
          }
          return Response.json(
            { success: true, message: "Уплатата е успешно избришана" },
            { status: 200 },
          );
        } catch (error) {
          console.error("Error deleting payment:", error);
          return Response.json(
            { error: "Failed to delete payment" },
            { status: 500 },
          );
        }
      },
    },
  },
});
