import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useRoomReservationsContext } from "../hooks/useRoomReservationsContext"; // Update this hook if needed
import { Bar, Doughnut } from "react-chartjs-2";
import { format, parseISO } from "date-fns";
import "chart.js/auto";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../assets/logo.png";

const ReportVenueReservationsCount = () => {
  const { roomReservations, setRoomReservations } =
    useRoomReservationsContext(); // Rename if needed

  // State for report year and list of years
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);

  // State for summary and chart data
  const [summary, setSummary] = useState({
    totalReservations: 0,
    totalVenue: 0, // Update this to totalVenue
  });
  const [chartData, setChartData] = useState({
    months: [],
    counts: [],
    venues: [],
    venueTypes: {}, // Add venueTypes to chartData
  });
  const [selectedData, setSelectedData] = useState(null);

  // Generate a list of years from 2000 to the current year
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2020; // can change this to any start year
    const yearsList = [];

    for (let year = startYear; year <= currentYear; year++) {
      yearsList.push(year);
    }

    setYears(yearsList);
  }, []);

  // Fetch venue reservations data when reportYear changes
  useEffect(() => {
    const fetchVenueReservations = async () => {
      const response = await fetch(
        `/api/reports/venueReservations/${reportYear}`
      );
      const json = await response.json();

      if (response.ok) {
        setRoomReservations(json); // Rename if needed
        const { months, counts, venues, venueTypes, summary } =
          calculateVenueSummary(json, reportYear);
        setChartData({ months, counts, venues, venueTypes });
        setSummary(summary);
      }
    };

    fetchVenueReservations();

    // Remove detailed chart
    setSelectedData(null);
  }, [setRoomReservations, reportYear]); // Rename if needed

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

  // Calculate summary and chart data from venue reservations
  const calculateVenueSummary = (reservations, year) => {
    const monthlyData = reservations.reduce((acc, reservation) => {
      const reservationDate = parseISO(reservation.checkIn.split("T")[0]);
      const reservationYear = reservationDate.getFullYear();
      if (reservationYear === parseInt(year)) {
        const month = format(reservationDate, "MMMM");
        if (!acc[month]) {
          acc[month] = { count: 0, venue: 0, venueTypes: {} };
        }
        acc[month].count += 1;
        acc[month].venue += reservation.venues.length;
        reservation.venues.forEach((venue) => {
          if (!acc[month].venueTypes[venue.type]) {
            acc[month].venueTypes[venue.type] = 0;
          }
          acc[month].venueTypes[venue.type] += 1;
        });
      }
      return acc;
    }, {});

    const months = Object.keys(monthlyData).sort((a, b) => {
      return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });
    const counts = months.map((month) => monthlyData[month].count);
    const venues = months.map((month) => monthlyData[month].venue);
    const venueTypes = months.reduce((acc, month) => {
      acc[month] = monthlyData[month].venueTypes;
      return acc;
    }, {});

    return {
      months,
      counts,
      venues,
      venueTypes,
      summary: {
        totalReservations: counts.reduce((sum, count) => sum + count, 0),
        totalVenue: venues.reduce((sum, venue) => sum + venue, 0),
      },
    };
  };

  // Generate chart data for venues
  const venueData = {
    labels: chartData.months,
    datasets: [
      {
        label: "Venues",
        data: chartData.counts,
        backgroundColor: "rgba(200, 200, 250, 0.3)",
        borderColor: "rgba(200, 200, 250, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Handle click on bar chart to display detailed data
  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      const month = chartData.months[index];
      const value = chartData.venues[index];
      const venueTypes = chartData.venueTypes[month];
      setSelectedData({
        month,
        value,
        venueTypes,
        type: "Venues",
      });
    }
  };

  // Download chart as PDF
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
        pdf.save("ReportVenueReservationsCount.pdf");
      };
    });
  };

  // Chart options
  const venueOptions = {
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

  // Prepare Doughnut chart data for venue types
  const doughnutData = selectedData
    ? {
        labels: Object.keys(selectedData.venueTypes),
        datasets: [
          {
            data: Object.values(selectedData.venueTypes),
            backgroundColor: [
              "#D88373",
              "#FFA261",
              "#E9D46A",
              "#2A9D8F",
              "#8AB17D",
              "#E76F51",
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
              Venue Reservations Count Report - {reportYear}
            </p>

            <div className="summary">
              <p>Total Reservations: {summary.totalReservations}</p>
            </div>

            <div className="w-full h-full">
              <Bar data={venueData} options={venueOptions} />
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
                <p className="text-lg font-semibold">
                  {selectedData.month} - {selectedData.type}
                </p>
                <p>Total: {selectedData.value}</p>
                {doughnutData && (
                  <Doughnut
                    data={doughnutData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              let label = context.label || "";
                              if (context.parsed !== null) {
                                label += `: ${context.raw}`;
                              }
                              return label;
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportVenueReservationsCount;
