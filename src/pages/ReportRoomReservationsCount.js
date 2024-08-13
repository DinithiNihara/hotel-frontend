import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useRoomReservationsContext } from "../hooks/useRoomReservationsContext";
import { Bar, Doughnut } from "react-chartjs-2";
import { format, parseISO } from "date-fns";
import "chart.js/auto";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../assets/logo.png";

const ReportRoomReservationsCount = () => {
  const { roomReservations, setRoomReservations } =
    useRoomReservationsContext();

  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);

  const [summary, setSummary] = useState({
    totalReservations: 0,
    totalRoom: 0,
  });
  const [chartData, setChartData] = useState({
    months: [],
    counts: [],
    rooms: [],
    roomTypes: {}, // Add roomTypes to chartData
  });
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    // Generate a list of years from 2000 to the current year
    const currentYear = new Date().getFullYear();
    const startYear = 2020; // can change this to any start year
    const yearsList = [];

    for (let year = startYear; year <= currentYear; year++) {
      yearsList.push(year);
    }

    setYears(yearsList);
  }, []);

  useEffect(() => {
    const fetchRoomReservations = async () => {
      const response = await fetch(`/api/reports/reservations/${reportYear}`);
      const json = await response.json();

      if (response.ok) {
        setRoomReservations(json);
        const { months, counts, rooms, roomTypes, summary } = calculateSummary(
          json,
          reportYear
        );
        setChartData({ months, counts, rooms, roomTypes });
        setSummary(summary);
      }
    };

    fetchRoomReservations();

    // Remove detailed chart
    setSelectedData(null);
  }, [setRoomReservations, reportYear]);

  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const calculateSummary = (reservations, year) => {
    const monthlyData = reservations.reduce((acc, reservation) => {
      const reservationDate = parseISO(reservation.checkIn.split("T")[0]);
      const reservationYear = reservationDate.getFullYear();
      if (reservationYear === parseInt(year)) {
        const month = format(reservationDate, "MMMM"); // Format as 'Month'
        if (!acc[month]) {
          acc[month] = { count: 0, room: 0, roomTypes: {} };
        }
        acc[month].count += 1;
        acc[month].room += reservation.rooms.length;
        reservation.rooms.forEach((room) => {
          if (!acc[month].roomTypes[room.type]) {
            acc[month].roomTypes[room.type] = 0;
          }
          acc[month].roomTypes[room.type] += 1;
        });
      }
      return acc;
    }, {});

    const months = Object.keys(monthlyData).sort((a, b) => {
      return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });
    const counts = months.map((month) => monthlyData[month].count);
    const rooms = months.map((month) => monthlyData[month].room);
    const roomTypes = months.reduce((acc, month) => {
      acc[month] = monthlyData[month].roomTypes;
      return acc;
    }, {});

    return {
      months,
      counts,
      rooms,
      roomTypes,
      summary: {
        totalReservations: counts.reduce((sum, count) => sum + count, 0),
        totalRoom: rooms.reduce((sum, room) => sum + room, 0),
      },
    };
  };

  // Generate chart data
  const reservationData = {
    labels: chartData.months,
    datasets: [
      {
        label: "Reservations",
        data: chartData.counts,
        backgroundColor: "rgba(250, 200, 192, 0.3)",
        borderColor: "rgba(250, 200, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      const month = chartData.months[index];
      const value = chartData.rooms[index];
      const roomTypes = chartData.roomTypes[month];
      setSelectedData({
        month,
        value,
        roomTypes,
        type: "Reservations",
      });
    }
  };

  const downloadChartAsPDF = () => {
    const input = document.getElementById("chartContainer");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 200;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add logo
      const logo = new Image();
      logo.src = Logo;
      logo.onload = () => {
        pdf.addImage(logo, "PNG", 20, 5, 20, 20); // position and size of the logo

        // Add heading
        pdf.setFontSize(20);
        pdf.text("Grandeur Luxury Hotel and Banquets", 45, 18); // position of the heading
        pdf.setFontSize(14);

        // Add chart
        pdf.addImage(imgData, "PNG", 5, 30, imgWidth, imgHeight);
        pdf.save("ReportRoomReservationsCount.pdf");
      };
    });
  };

  const reservationOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
          },
        },
      },
    },
    onClick: (event, elements) => handleBarClick(event, elements),
  };

  // Prepare Doughnut chart data
  const doughnutData = selectedData
    ? {
        labels: Object.keys(selectedData.roomTypes),
        datasets: [
          {
            data: Object.values(selectedData.roomTypes),
            backgroundColor: [
              "#D88373", // Light Brown
              "#FFA261", // Soft Orange
              "#E9D46A", // Warm Yellow
              "#2A9D8F", // Muted Teal
              "#8AB17D", // Sage Green
              "#E76F51", // Soft Red
            ],
          },
        ],
      }
    : null;

  return (
    <div className="mx-24">
      <Link to="/" className="w-1/4 flex">
        <div className="flex items-center pr-1">
          <FaChevronLeft />
        </div>
        <p>Dashboard</p>
      </Link>
      <div className="mt-5 grid grid-cols-3">
        <div className="grid col-span-2">
          <div id="chartContainer">
            <p className="py-4 text-2xl font-bold">
              Room Reservations Count Report - {reportYear}
            </p>

            <div className="summary">
              <p>Total Reservations: {summary.totalReservations}</p>
            </div>

            <div className="w-full h-full">
              <Bar data={reservationData} options={reservationOptions} />
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between items-center">
            <div>
              <label className="text-base pr-2">Year:</label>
              <select
                onChange={(e) => setReportYear(e.target.value)}
                value={reportYear}
                className="bg-gray-50 border text-gray-900 text-sm rounded-lg p-2"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={downloadChartAsPDF}
                className="px-4 py-2 bg-amber-600 text-white rounded"
              >
                Download as PDF
              </button>
            </div>
          </div>
          <div className="pt-10 px-5">
            {selectedData && (
              <div className="selected-data border p-2">
                <p className="text-gray-500">
                  Number of rooms reserved in {selectedData.month}:{" "}
                  {selectedData.value}
                </p>
                <div className="w-full h-full pt-2">
                  <p className="text-gray-500 text-sm italic">Room types:</p>
                  <Doughnut data={doughnutData} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportRoomReservationsCount;
