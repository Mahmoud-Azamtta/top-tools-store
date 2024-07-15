import fs from "fs";
import PDFDocument from "pdfkit";

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  // Register the fonts
  doc.registerFont("Amiri", "fonts/Amiri-Regular.ttf");
  doc.registerFont("Helvetica", "fonts/Helvetica.ttf");

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function reverseWords(str) {
  if (typeof str !== "string") return "";
  return str.split(" ").reverse().join(" ");
}

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .font("Helvetica")
    .text("Top Tools Company", 110, 57)
    .fontSize(10)
    .text("Top-Tools", 200, 50, { align: "right" })
    .text("Tulkarm", 200, 65, { align: "right" })
    .text("Balaa town", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .font("Helvetica")
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(invoice.subtotal * 100),
      150,
      customerInformationTop + 30,
    )
    .font("Amiri")
    .text(reverseWords(invoice.shipping.name), 300, customerInformationTop)

    .text(
      reverseWords(invoice.shipping.address),
      300,
      customerInformationTop + 15,
    )
    .text(
      reverseWords(invoice.shipping.phone),
      300,
      customerInformationTop + 30,
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Name",
    "Quantity",
    "Unit Price",
    "Total",
  );
  generateHr(doc, invoiceTableTop + 20);

  doc.font("Amiri");
  invoice.items.forEach((item, index) => {
    const position = invoiceTableTop + (index + 1) * 30;
    generateTableRow(
      doc,
      position,
      reverseWords(item.name),
      item.quantity.toString(),
      formatCurrency(item.unitPrice * 100),
      formatCurrency(item.finalPrice * 100),
    );
    generateHr(doc, position + 20);
  });

  const subtotalPosition = invoiceTableTop + (invoice.items.length + 1) * 30;
  doc.font("Helvetica");
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    formatCurrency(invoice.subtotal * 100),
  );
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 },
    );
}

function generateTableRow(doc, y, item, description, unitCost, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(lineTotal, 460, y, { width: 90, align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return year + "/" + month + "/" + day;
}

export default createInvoice;

