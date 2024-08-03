import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../assets/logo.png";

const RoomReservationInvoice = ({
  reservation,
  bookingNo,
  reservedGuest,
  reservedRooms,
}) => {
  const generatePdf = () => {
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = Logo;

    logo.onload = () => {
      // Add logo
      doc.addImage(logo, "PNG", 20, 5, 20, 20); // position and size of the logo
      
      // Invoice title
      doc.setFontSize(20);
      doc.text("Grandeeza Luxury Hotel and Banquets", 45, 18);
      doc.text("Invoice", 90, 30);

      // Company details
      doc.setFontSize(10);
      doc.text(
        `Guest: ${
          reservedGuest.title +
          " " +
          reservedGuest.firstName +
          " " +
          reservedGuest.lastName
        }`,
        20,
        40
      );
      doc.text(`Phone: ${reservedGuest.phone}`, 20, 45);
      doc.text(`Email: ${reservedGuest.email}`, 20, 50);
      doc.text(`Address: ${reservedGuest.address}`, 20, 55);

      // Guest details
      doc.text(`Booking No: ${bookingNo}`, 140, 40);
      doc.text(`Check-in: ${reservation.checkIn}`, 140, 45);
      doc.text(`Check-out: ${reservation.checkOut}`, 140, 50);

      // Add table
      const body = [
        [
          { content: "Rooms", styles: { fontStyle: "bold", halign: "left" } },
          { content: "", styles: { halign: "center" } },
        ],
        ...reservedRooms.map((room) => [
          `${room.roomNo} - ${room.type}`,
          room.cost,
        ]),
        ["", ""],
      ];

      if (reservation.extras.length > 0) {
        body.push(
          [
            {
              content: "Extras",
              styles: { fontStyle: "bold", halign: "left" },
            },
            { content: "", styles: { halign: "center" } },
          ],
          ...reservation.extras.map((extra) => [extra.name, extra.cost]),
          ["", ""],
          ["Total", reservation.total]
        );
      }

      doc.autoTable({
        theme: "plain",
        columnStyles: {
          0: { halign: "left" }, // First column (index 0) left align
          1: { halign: "center" }, // Second column (index 1) center align
        },
        margin: { top: 10, left: 18 },
        startY: 70,
        body,
      });

      // Footer
      doc.text("Thank you!", 20, doc.autoTable.previous.finalY + 20);

      // Save PDF
      doc.save(`${bookingNo}-ReservationInvoice.pdf`);
    };
  };

  return (
    <button
      onClick={generatePdf}
      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
    >
      Download Invoice
    </button>
  );
};

export default RoomReservationInvoice;
