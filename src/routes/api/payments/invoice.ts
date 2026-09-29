import { createFileRoute } from "@tanstack/react-router";
import { useStorage } from "nitro/storage";
import { readFile } from "node:fs/promises";
import path from "node:path";
import PDFDocument from "pdfkit";
import { getDb } from "@/lib/server/mongodb";
import { BUSINESS_INFO } from "@/lib/data/businessInfo";

// Single variable font covering both Latin and Cyrillic glyphs. It has no
// embedded bold instance, so boldText() fakes weight by double-drawing with
// a slight offset instead of switching fonts.
// Loaded through nitro's server-asset storage (see vite.config.ts), which is
// how the built serverless function gets the bytes: public/ is deployed as
// static CDN output and isn't present alongside the function at runtime.
// The plain `vite dev` server never runs nitro's build, so that mount is
// empty locally — fall back to reading straight from public/ in that case.
let fontDataPromise: Promise<Buffer> | null = null;
function loadFontData(): Promise<Buffer> {
  if (!fontDataPromise) {
    fontDataPromise = useStorage("assets/fonts")
      .getItemRaw("Roboto-Variable.ttf")
      .then((raw) => {
        if (raw) return Buffer.isBuffer(raw) ? raw : Buffer.from(raw as ArrayBuffer);
        return readFile(
          path.join(process.cwd(), "public/fonts/Roboto-Variable.ttf"),
        );
      });
  }
  return fontDataPromise;
}

async function generateInvoicePdf(payment: {
  invoiceNumber?: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  planTitle: string | null;
  amount: number;
  currency: string;
}): Promise<Buffer> {
  const fontData = await loadFontData();

  return new Promise((resolve, reject) => {
    // Omit `font` from the constructor (its type only allows a string path) and
    // register our embedded font bytes immediately after instead, before pdfkit
    // ever falls back to its built-in Helvetica, which crashes on serverless
    // Node deployments (lazy-requires a data file that isn't bundled:
    // "Cannot find module '#standard-fonts/Helvetica'").
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.font(fontData);

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
