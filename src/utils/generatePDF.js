import { PDFDocument } from "pdf-lib";

export const generatePDF = async (formData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText(`Form Data:\n\n${JSON.stringify(formData, null, 2)}`, {
    x: 50,
    y: 700,
    size: 12,
  });

  return new Blob([await pdfDoc.save()], { type: "application/pdf" });
};
