import { createFileRoute } from "@tanstack/react-router";
import PDFDocument from "pdfkit";
import { getDb } from "@/lib/server/mongodb";
import { BUSINESS_INFO } from "@/lib/data/businessInfo";
import fontBase64 from "@/lib/server/fonts/Roboto-Variable.ttf.b64.txt?raw";

// Single variable font covering both Latin and Cyrillic glyphs. It has no
// embedded bold instance, so boldText() fakes weight by double-drawing with
// a slight offset instead of switching fonts.
// Base64-embedded (Vite ?raw import) instead of read from public/ at runtime:
// public/ is deployed as static CDN output and isn't present alongside the
// serverless function, and nitro's server-asset bundling proved unreliable
// between local and Vercel builds.
const fontData = Buffer.from(fontBase64, "base64");

function generateInvoicePdf(payment: {
  invoiceNumber?: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  planTitle: string | null;
  amount: number;
  currency: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // pdfkit's constructor always eagerly loads a font — `options.font` defaults
    // to 'Helvetica' when omitted — so it must be passed here, not set via
    // doc.font() afterward, or it crashes trying to lazy-require its bundled
    // standard-font data ("Cannot find module '#standard-fonts/Helvetica'"),
    // which doesn't survive being flattened into the serverless bundle.
    // @types/pdfkit only types this constructor option as `string`, even
    // though pdfkit itself accepts a Buffer; cast to satisfy tsc.
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      font: fontData as unknown as string,
    });

    const boldText = (
      text: string,
      x?: number,
      y?: number,
      options?: PDFKit.Mixins.TextOptions,
    ) => {
      doc.text(text, x, y, options);
      doc.text(text, (x ?? doc.x) + 0.4, y, options);
    };

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const issueDate = new Date(payment.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const amount = (payment.amount / 100).toFixed(2);

    doc.fontSize(22);
    boldText("INVOICE", 50, doc.y, { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(10);
    boldText(`Invoice number: ${payment.invoiceNumber ?? "—"}`, 50, doc.y);
    doc
      .fontSize(10)
      .text(`Date of issue: ${issueDate}`)
      .text(`Date due: ${issueDate}`);

    doc.moveDown(1.5);
    const colX = [50, 300];
    doc.fontSize(11);
    boldText("Seller", colX[0], doc.y);
    const sellerY = doc.y;
    boldText("Bill to", colX[1], sellerY);

    doc.fontSize(10);
    doc.text(BUSINESS_INFO.name, colX[0]);
    BUSINESS_INFO.addressLines.forEach((line) => doc.text(line, colX[0]));
    doc.text(BUSINESS_INFO.supportEmail, colX[0]);

    doc.text(payment.customerName || "—", colX[1], sellerY + 15);
    doc.text(payment.customerEmail || "—", colX[1]);

    doc.moveDown(2);
    doc.fontSize(13);
    boldText(`${payment.currency} ${amount} due on ${issueDate}`, 50, doc.y);

    doc.moveDown(1);
    const tableTop = doc.y;
    doc.fontSize(10);
    doc.text("Description", 50, tableTop);
    doc.text("Qty", 320, tableTop);
    doc.text("Unit price", 380, tableTop);
    doc.text("Amount", 470, tableTop);
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(545, tableTop + 15)
      .stroke();

    const rowY = tableTop + 25;
    doc.text(payment.planTitle || "Payment", 50, rowY);
    doc.text("1", 320, rowY);
    doc.text(`${payment.currency} ${amount}`, 380, rowY);
    doc.text(`${payment.currency} ${amount}`, 470, rowY);

    doc
      .moveTo(300, rowY + 20)
      .lineTo(545, rowY + 20)
      .stroke();
    doc.text("Subtotal", 380, rowY + 30);
    doc.text(`${payment.currency} ${amount}`, 470, rowY + 30);
    boldText("Total", 380, rowY + 45);
    boldText(`${payment.currency} ${amount}`, 470, rowY + 45);
    boldText("Paid", 380, rowY + 60);
    boldText(`${payment.currency} ${amount}`, 470, rowY + 60);

    doc.moveDown(4);
    doc.fontSize(9).text("Thank you for choosing TradingLab.mk!", 50, doc.y, {
      align: "center",
      width: 495,
    });

    doc.end();
  });
}

export const Route = createFileRoute("/api/payments/invoice")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const sessionId = new URL(request.url).searchParams.get(
            "session_id",
          );
          if (!sessionId) {
            return Response.json(
              { error: "Missing session_id" },
              { status: 400 },
            );
          }

          const db = await getDb();
          const payment = (await db
            .collection("payments")
            .findOne({ stripeSessionId: sessionId })) as Record<
            string,
            any
          > | null;
          if (!payment) {
            return Response.json(
              { error: "Payment not found" },
              { status: 404 },
            );
          }

          const pdfBuffer = await generateInvoicePdf({
            invoiceNumber: payment["invoiceNumber"],
            createdAt: payment["createdAt"],
            customerName: payment["customerName"],
            customerEmail: payment["customerEmail"],
            planTitle: payment["planTitle"],
            amount: payment["amount"],
            currency: payment["currency"],
          });

          return new Response(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="Invoice-${payment["invoiceNumber"] ?? sessionId}.pdf"`,
              "Cache-Control": "no-store",
            },
          });
        } catch (error) {
          console.error("Error generating invoice PDF:", error);
          const message =
            error instanceof Error ? error.message : "Unknown error";
          return Response.json(
            { error: "Failed to generate invoice", detail: message },
            { status: 500 },
          );
        }
      },
    },
  },
});
