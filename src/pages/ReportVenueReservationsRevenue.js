import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useRoomReservationsContext } from "../hooks/useRoomReservationsContext";
import { Bar } from "react-chartjs-2";
import { format, parseISO } from "date-fns";
import "chart.js/auto";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../assets/logo.png";

const ReportVenueReservationsRevenue = () => {
  const { roomReservations, setRoomReservations } =
    useRoomReservationsContext();

  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);

  const [summary, setSummary] = useState({
    totalReservations: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState({
    months: [],
    counts: [],
    revenues: [],
  });
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    // Generate a list of years from 2000 to the current year
    const currentYear = new Date().getFullYear();
    const startYear = 2020; // You can change this to any start year
    const yearsList = [];

    for (let year = startYear; year <= currentYear; year++) {
      yearsList.push(year);
    }

    setYears(yearsList);
  }, []);

  useEffect(() => {
    const fetchRoomReservations = async () => {
      const response = await fetch("/api/roomReservations");
      const json = await response.json();

      if (response.ok) {
        setRoomReservations({ type: "SET_ROOMRESERVATIONS", payload: json });
        const { months, counts, revenues, summary } = calculateSummary(
          json,
          reportYear
        );
        setChartData({ months, counts, revenues });
        setSummary(summary);
      }
    };

    fetchRoomReservations();
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
          acc[month] = { count: 0, revenue: 0 };
        }
        acc[month].count += 1;
        acc[month].revenue += reservation.total;
      }
      return acc;
    }, {});

    const months = Object.keys(monthlyData).sort((a, b) => {
      return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });
    const counts = months.map((month) => monthlyData[month].count);
    const revenues = months.map((month) => monthlyData[month].revenue);

    return {
      months,
      counts,
      revenues,
      summary: {
        totalReservations: counts.reduce((sum, count) => sum + count, 0),
        totalRevenue: revenues.reduce((sum, revenue) => sum + revenue, 0),
      },
    };
  };

  const revenueData = {
    labels: chartData.months,
    datasets: [
      {
        label: "Revenue (LKR)",
        data: chartData.revenues,
        backgroundColor: "rgba(100, 200, 300, 0.3)",
        borderColor: "rgba(100, 200, 300, 1)",
        borderWidth: 1,
      },
    ],
  };

  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const { datasetIndex, index } = elements[0];
      const month = chartData.months[index];
      const value = chartData.counts[index];
      setSelectedData({
        month,
        value,
        type: "Revenue",
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
        pdf.text("Grandeeza Luxury Hotel and Banquets", 45, 18); // position of the heading
        pdf.setFontSize(14);

        // Add chart
        pdf.addImage(imgData, "PNG", 5, 30, imgWidth, imgHeight);
        pdf.save("chart.pdf");
      };
    });
  };

  const revenueOptions = {
    onClick: (event, elements) => handleBarClick(event, elements),
  };

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
              Room Reservations Revenue Report - {reportYear}
            </p>
            <div className="summary">
              <p>Total Revenue: LKR {summary.totalRevenue}</p>
            </div>

            <div className="w-full h-full">
              <Bar data={revenueData} options={revenueOptions} />
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
                  {selectedData.type} for {selectedData.month}:{" "}
                  {selectedData.type === "Revenue" ? "LKR " : ""}
                  {selectedData.value}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportVenueReservationsRevenue;
