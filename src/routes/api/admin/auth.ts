import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/auth")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { password } = await request.json();
        const adminPassword = process.env["ADMIN_PASSWORD"];

        if (!adminPassword) {
          return Response.json(
            { error: "Admin password not configured" },
            { status: 500 },
          );
        }

        if (password === adminPassword) {
          return Response.json({ success: true }, { status: 200 });
        }

        return Response.json({ error: "Unauthorized" }, { status: 401 });
      },
    },
  },
});
