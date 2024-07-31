import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import SoftButton from "./SoftButton";

const EventVenueReservationInvoice = ({
  reservation,
  bookingNo,
  reservedGuest,
  reservedVenues,
  reservedRooms,
}) => {
  const generatePdf = () => {
    const doc = new jsPDF();

    // Invoice title
    doc.setFontSize(20);
    doc.text("Invoice", 90, 20);

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
      35
    );
    doc.text(`Phone: ${reservedGuest.phone}`, 20, 40);
    doc.text(`Email: ${reservedGuest.email}`, 20, 45);
    doc.text(`Address: ${reservedGuest.address}`, 20, 50);

    // Guest details
    doc.text(`Booking No: ${bookingNo}`, 140, 35);
    doc.text(`Check-in: ${reservation.checkIn}`, 140, 40);
    doc.text(`Check-out: ${reservation.checkOut}`, 140, 45);

    // Add table
    const body = [
      [
        { content: "Venues", styles: { fontStyle: "bold", halign: "left" } },
        { content: "", styles: { halign: "center" } },
      ],
      ...reservedVenues.map((venue) => [
        `${venue.venueNo} - ${venue.type}`,
        venue.cost,
      ]),
      ["", ""],
    ];

    if (reservedRooms && reservedRooms.length > 0) {
      body.push(
        [
          { content: "Rooms", styles: { fontStyle: "bold", halign: "left" } },
          { content: "", styles: { halign: "center" } },
        ],
        ...reservedRooms.map((room) => [
          `${room.roomNo} - ${room.type}`,
          room.cost,
        ]),
        ["", ""]
      );
    }
    if (reservation.extras) {
      body.push(
        [
          { content: "Extras", styles: { fontStyle: "bold", halign: "left" } },
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
      startY: 65,
      body,
    });

    // Footer
    doc.text("Thank you!", 20, doc.autoTable.previous.finalY + 20);

    // Save PDF
    doc.save(`${bookingNo}-ReservationInvoice.pdf`);
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

export default EventVenueReservationInvoice;
