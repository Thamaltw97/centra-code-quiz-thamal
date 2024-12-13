import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (formData) => {
  const element = document.getElementById("form-container");
  if (!element) {
    throw new Error("Form container not found");
  }

  const canvas = await html2canvas(element, {
    scale: 1,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 5;

  while (heightLeft > 0) {
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    if (heightLeft > 0) {
      pdf.addPage();
      position = 0; 
    }
  }

  return new Blob([pdf.output("blob")], { type: "application/pdf" });
};