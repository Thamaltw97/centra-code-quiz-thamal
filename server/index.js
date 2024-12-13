const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const path = require("path");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());

app.use(cors());

app.post("/api/send-email", upload.fields([
  { name: "pdfBlob", maxCount: 1 },
  { name: "attachments", maxCount: 10 }
]), async (req, res) => {
  try {

    const pdfBlob = req.files["pdfBlob"] ? req.files["pdfBlob"][0] : null;
    const attachments = req.files["attachments"] || [];

    if (!pdfBlob) {
      return res.status(400).json({ message: "Main PDF is required!" });
    }

    const { formData } = req.body;
    const parsedData = JSON.parse(formData);

    const mainPdfBytes = fs.readFileSync(pdfBlob.path);
    const mainPdf = await PDFDocument.load(mainPdfBytes);

    // Create a new PDF document for merging
    const mergedPdfDoc = await PDFDocument.create();

    // Copy pages from the main PDF into the merged document
    const [mainPdfPage] = await mergedPdfDoc.copyPages(mainPdf, mainPdf.getPageIndices());
    mergedPdfDoc.addPage(mainPdfPage);

    // Add the attachments (image or PDF) to the merged PDF
    for (const file of attachments) {
      const filePath = file.path;
      const fileBytes = fs.readFileSync(filePath);

      if (file.mimetype.startsWith("image")) {
        const image = await mergedPdfDoc.embedPng(fileBytes);

        const page = mergedPdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        
      } else if (file.mimetype === "application/pdf") {
        const attachmentPdf = await PDFDocument.load(fileBytes);

        const pages = await mergedPdfDoc.copyPages(attachmentPdf, attachmentPdf.getPageIndices());
        pages.forEach(page => mergedPdfDoc.addPage(page));
      }
    }

    const mergedPdfBytes = await mergedPdfDoc.save();

    const mergedPdfPath = path.join(__dirname, "uploads", "merged.pdf");
    fs.writeFileSync(mergedPdfPath, mergedPdfBytes);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "thamal1997@gmail.com", // Use the company email server email (I used my personal gmail)
        pass: "<fill>", // Use the company email server passkey/password
      },
    });

    const emailBody = `
        Work order details:

        - Customer Number: ${parsedData.customerNumber}
        - Work Order Number: ${parsedData.workOrderNum}
        - Customer Name: ${parsedData.customerName}
        - Customer Email: ${parsedData.customerEmail}
        - Phone Number: ${parsedData.phoneNumber}
        - Street Address: ${parsedData.streetAddress}
        - Province: ${parsedData.province}
        - City: ${parsedData.city}
        - Postal Code: ${parsedData.postalCode}
        - Branch: ${parsedData.branch}
        - Order Type: ${parsedData.orderType}
        - Home Depot Order: ${parsedData.homeDepotOrder}
        - Lead Source: ${parsedData.leadSource}
        - Estimator: ${parsedData.estimator}
        - Marketer: ${parsedData.marketer}
        - Remeasure Required: ${parsedData.remeasureRequired}
        - Delivery Zone: ${parsedData.deliveryZone}
        - Payment Type: ${parsedData.paymentType}
        - Sell Price: ${parsedData.sellPrice}
        - List Price: ${parsedData.listPrice}
        - Deposit Value: ${parsedData.depositValue}
        - Discount: ${parsedData.discount}
        - Commission: ${parsedData.commission}
        - Windows: ${parsedData.windows}
        - Patio Doors: ${parsedData.patioDoors}
        - Doors: ${parsedData.doors}
        - Sealed Units: ${parsedData.sealedUnits}
        - Others: ${parsedData.others}
        - Submitter Email: ${parsedData.submitterEmail}
        - Clean BC IQP Code: ${parsedData.cleanBcIqpCode}
        - Door Saved in Codel Program: ${parsedData.doorSavedInCodelProgram}
        - Future Opportunity: ${parsedData.futureOpportunity}
        - Alt Duration and Price Breakdown: ${parsedData.altDurationAndPriceBreakdown}

        Please refer to the attached file for any additional attachments.
        `;

    const mailOptions = {
        from: "thamal1997@gmail.com",
        to: ["mxu@centra.ca", "vkhatri@centra.ca", "aadversalo@centra.ca", "zluo@centra.ca"],
        bcc: ["thamaltw97@outlook.com"],
      subject: `W/O # ${parsedData.workOrderNum} - New Order Intake - Supply & Install`,
      text: emailBody,
      attachments: [
        {
          filename: "merged.pdf",
          path: mergedPdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    fs.unlinkSync(pdfBlob.path);
    attachments.forEach(file => fs.unlinkSync(file.path));
    fs.unlinkSync(mergedPdfPath);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email. Please try again." });
  }
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
