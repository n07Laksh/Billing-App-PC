import React from "react";
import { jsPDF } from "jspdf";
import Logo from "./tts-logo.png";
import A4 from "./a4.png";
import A5 from "./a5.png";
import TP from "./thermal-printer.png";

const generateA5PDF = (item, shop, gst, img, add) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [5.8, 8.3], // A5 size in inches (portrait)
  });

  doc.addImage(img ? img : Logo, "PNG", 0.5, 0.7, 0.7, 0.7);

  doc.setFontSize(17);
  doc.setFont("helvetica", "bold"); // Set font as bold
  const textes = `${add.shopName}`;
  const textWidths = 170; // Maximum width for the text
  const textLinese = getWrappedTextLines(textes, textWidths);
  doc.text(textLinese, 0.5, 1.7); // Example content

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Office Address", 0.5, 2.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  const text = `${add.address}`;
  const textWidth = 100; // Maximum width for the text

  const textLines = getWrappedTextLines(text, textWidth);
  doc.text(textLines, 0.5, 2.4);

  doc.text(`${add.contact}`, 0.5, 3);

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice", 3.8, 1);

  doc.setFontSize(12);
  doc.text(`${item.today}`, 3.8, 1.2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10)
  doc.text(`GSTIN - ${gst}`, 3.8, 1.5);

  doc.setFontSize(10);
  doc.text("to:", 3.8, 2.2);

  doc.text(`${item.clientName}`, 3.8, 2.4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const texts = `${item.clientAddress}`;

  const textLiness = getWrappedTextLines(texts, textWidth);
  doc.text(textLiness, 3.8, 2.6);

  doc.text(`${item.clientContact}`, 3.8, 3);

  // Table headers
  const headers = ["Item", "Price", "Qnt", "Disc", "GST", "Total"];
  const headerPositions = [0.6, 2.5, 3.2, 3.6, 4, 4.6];

  let startY = 3.5; // Initial Y position for the first row
  const lineHeight = 0.3; // Height of each row

  doc.setFillColor(0); // Transparent fill color
  doc.rect(0.5, startY - 0.17, 4.8, 0.24, "F");
  doc.setTextColor("#fff"); // Example: white color
  // Populate table headers
  headers.forEach((header, index) => {
    doc.text(header, headerPositions[index], startY);
  });
  doc.setTextColor("#000"); // Example: Black color

  // Populate table with data
  item.saleItem.forEach((item, index) => {
    const { name, salePrice, quantity, disc, gst, amount } = item;

    const yPos = startY + (index + 1) * lineHeight;

    doc.text(String(name), headerPositions[0], yPos);
    doc.text(String(salePrice), headerPositions[1], yPos);
    doc.text(String(quantity), headerPositions[2], yPos);
    doc.text(String(disc?disc+"%":"0%"), headerPositions[3], yPos);
    doc.text(String(gst?gst+"%":"0%"), headerPositions[4], yPos);
    doc.text(String(amount), headerPositions[5], yPos);
  });

  const tableBottomY = startY + (item.saleItem.length + 1) * lineHeight; // Calculate the bottom of the table

  // Example: Continue with other content below the table
  const nextSectionY = tableBottomY + 0.5; // Example: Start the next section below the table

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Total Qyt.", 1.7, nextSectionY);

  doc.text(`${totalCount(item.saleItem)}`, 2.5, nextSectionY);

  doc.setFont("helvetica", "bold");
  doc.text("Sub-total", 3.2, nextSectionY);

  doc.setFont("helvetica", "bold");
  doc.text(`${totalMoney(item.saleItem)}`, 4.4, nextSectionY);

  // Set background color behind the text
  const t = "Grand-total";
  const xPos = 3.2;
  const fontSize = 12;
  const backgroundColor = "#000"; // Example: Yellow color

  // Get text width and height
  const tex = doc.getTextWidth(text);

  // Draw a rectangle as background
  doc.setFillColor(backgroundColor);
  doc.rect(xPos - 0.07, nextSectionY + 0.06, tex + 0.02, 0.36, "F"); // Adjust rectangle size as needed

  // Set font size and color for the text
  doc.setFontSize(fontSize);
  doc.setTextColor("#fff"); // Example: Black color

  // Add the text on top of the rectangle
  doc.text(t, xPos, nextSectionY + 0.3);
  doc.text(`${totalMoney(item.saleItem)}`, 4.4, nextSectionY + 0.3);

  doc.setTextColor("#000");

  doc.setFont("", "bold");
  doc.text("Thank you for business with us!", 0.5, nextSectionY + 0.7);

  doc.save(`${item.clientName}.pdf`);
};

const generateA4PDF = (item, shop, gst, img, add) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: "a4", // A4 size in portrait orientation
  });

  doc.addImage(img?img:Logo, "PNG", 1, 0.7, 0.7, 0.7);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold"); // Set font as bold
  doc.text(`${add.shopName}`, 1, 1.7); // Example content

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Office Address", 1, 2.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const text = `${add.address}`;
  const textWidth = 100; // Maximum width for the text

  const textLines = getWrappedTextLines(text, textWidth);
  doc.text(textLines, 1, 2.4);

  doc.text(`${add.contact}`, 1, 3);

  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice", 5.7, 1);

  doc.setFontSize(13);
  doc.text(`${item.today}`, 5.7, 1.3);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10)
  doc.text(`GSTIN - ${gst}`, 5.7, 1.6);

  doc.setFontSize(11);
  doc.text("to:", 5.7, 2.2);

  doc.setFontSize(11);
  doc.text(`${item.clientName}`, 5.7, 2.4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const texts = `${item.clientAddress}`;

  const textLiness = getWrappedTextLines(texts, textWidth);
  doc.text(textLiness, 5.7, 2.6);

  doc.text(`${item.clientContact}`, 5.7, 3);

  // Table headers
  const headers = ["Item", "Unit Price", "Qnt", "Disc%", "GST%", "Total"];
  const headerPositions = [1.2, 3.4, 4.3, 4.9, 5.5, 6.6];

  let startY = 3.6; // Initial Y position for the first row
  const lineHeight = 0.3; // Height of each row

  doc.setFillColor(0); // Transparent fill color
  doc.rect(1, startY - 0.18, 6.3, 0.25, "F");
  doc.setTextColor("#fff"); // Example: Black color
  // Populate table headers
  headers.forEach((header, index) => {
    doc.text(header, headerPositions[index], startY);
  });
  doc.setTextColor("#000"); // Example: Black color

  // Populate table with data
  item.saleItem.forEach((item, index) => {
    const { name, salePrice, quantity, disc, gst, amount } = item;

    const yPos = startY + (index + 1) * lineHeight;

    doc.text(String(name), headerPositions[0], yPos);
    doc.text(String(salePrice), headerPositions[1], yPos);
    doc.text(String(quantity), headerPositions[2], yPos);
    doc.text(String(disc?disc+"%":"0%"), headerPositions[3], yPos);
    doc.text(String(gst?gst+"%":"0%"), headerPositions[4], yPos);
    doc.text(String(amount), headerPositions[5], yPos);
  });

  const tableBottomY = startY + (item.saleItem.length + 1) * lineHeight; // Calculate the bottom of the table

  // Example: Continue with other content below the table
  const nextSectionY = tableBottomY + 1; // Example: Start the next section below the table

  doc.setFontSize(10.7);
  doc.setFont("helvetica", "bold");
  doc.text("Total Qyt.", 2.7, nextSectionY);

  doc.text(`${totalCount(item.saleItem)}`, 3.7, nextSectionY);

  doc.setFont("helvetica", "bold");
  doc.text("Sub-total", 5, nextSectionY);

  doc.setFont("helvetica", "bold");
  doc.text(`${totalMoney(item.saleItem)}`, 6.5, nextSectionY);

  // Set background color behind the text
  const t = "Grand-total";
  const xPos = 5;
  const fontSize = 13;
  const backgroundColor = "#000"; // Example: Yellow color

  // Get text width and height
  const tex = doc.getTextWidth(text);

  // Draw a rectangle as background
  doc.setFillColor(backgroundColor);
  doc.rect(xPos - 0.07, nextSectionY + 0.15, tex + 0.02, 0.36, "F"); // Adjust rectangle size as needed

  // Set font size and color for the text
  doc.setFontSize(fontSize);
  doc.setTextColor("#fff"); // Example: Black color

  // Add the text on top of the rectangle
  doc.text(t, xPos, nextSectionY + 0.4);
  doc.text(`${totalMoney(item.saleItem)}`, 6.5, nextSectionY + 0.4);

  doc.setTextColor("#000");

  doc.setFont("", "bold");
  doc.text("Thank you for business with us!", 1, nextSectionY + 1);

  doc.save(`${item.clientName}.pdf`);
};

const generateThermalPDF = () => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [2, 4], // Example thermal printer size in inches (portrait)
  });

  doc.text("Thermal Printer Size PDF Content", 0.1, 0.1); // Example content
  doc.save("thermal.pdf");
};

// Function to manually wrap text into lines based on specified width
const getWrappedTextLines = (text, maxWidth) => {
  const words = text.split(" ");
  let currentLine = "";
  const lines = [];

  words.forEach((word) => {
    const potentialLine = currentLine ? `${currentLine} ${word}` : word;
    const lineWidth = getStringWidth(potentialLine);

    if (lineWidth < maxWidth) {
      currentLine = potentialLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

// Function to estimate string width (you may need to implement this based on your environment)
const getStringWidth = (str) => {
  return str.length * 5;
};

const totalMoney = (data) => {
  if (data) {
    return data.reduce((sum, item) => {
      return sum + item.amount;
    }, 0);
  }
};

const totalCount = (data) => {
  if (data) {
    const totalQuantity = data.reduce((sum, item) => {
      return sum + (item.quantity || 0);
    }, 0);

    return totalQuantity.toString();
  }
  return "0";
};

const PDFGenerator = (props) => {
  const { saleData } = props;

  const shop = JSON.parse(localStorage.getItem("userData"));
  const img = localStorage.getItem(`profilePicture`);
  const GSTIN = localStorage.getItem(`GSTIN`);
  const add = JSON.parse(localStorage.getItem(`userAdd`));
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <p>Select & print invoice:</p>
      </div>
      <div className="d-flex gap-3">
        <span
          style={{ width: "20px", display: "inline-block" }}
          onClick={() => generateA5PDF(saleData, shop, GSTIN, img, add)}
        >
          <img style={{ width: "100%" }} src={A5} alt="" />
        </span>
        <span
          style={{ width: "20px", display: "inline-block" }}
          onClick={() => generateA4PDF(saleData, shop, GSTIN, img, add)}
        >
          <img style={{ width: "100%" }} src={A4} alt="" />
        </span>
        {/* <span
          style={{ width: "20px", display: "inline-block" }}
          onClick={() => generateThermalPDF(saleData, shop, GSTIN, img, add)}
        >
          <img style={{ width: "100%" }} src={TP} alt="" />
        </span> */}
      </div>
    </div>
  );
};

export default PDFGenerator;
