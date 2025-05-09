import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "../theme-provider";

const generateData = (num, ranges) => {
  return Array.from(
    { length: num },
    () => Math.floor(Math.random() * (ranges.max - ranges.min + 1)) + ranges.min
  );
};

const HeatMap = () => {
  const { theme } = useTheme();
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    const isDark = theme === "dark";

    const textColor = isDark ? "#f0fdfa" : "#1e293b"; // emerald-50 / slate-800
    const bgColor = isDark ? "hsl(172, 50%, 17%)" : "#f8fafc"; // your dark bg / slate-50
    const gridColor = isDark ? "#0f766e" : "#e2e8f0"; // teal-700 / slate-200
    const labelBg = isDark ? "#0f766e" : "#e0f2fe"; // teal-700 / sky-100

    const options = {
      chart: {
        height: 350,
        type: "heatmap",
        foreColor: textColor,
        background: bgColor,
        toolbar: {
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.4,
          radius: 4,
          useFillColorAsStroke: false,
          colorScale: {
            ranges: [
              { from: 0, to: 20, name: "Low", color: "#99f6e4" }, // teal-200
              { from: 21, to: 50, name: "Moderate", color: "#5eead4" }, // teal-400
              { from: 51, to: 80, name: "High", color: "#34d399" }, // emerald-400
              { from: 81, to: 100, name: "Extreme", color: "#f87171" }, // red-400
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: [isDark ? "#f0fdfa" : "#0f172a"], // emerald-50 / slate-900
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      stroke: {
        width: 1,
        colors: [gridColor],
      },
      title: {
        text: "Ambalay Maps – Request Heat Across Addis Ababa",
        align: "center",
        margin: 20,
        style: {
          color: textColor,
          fontSize: "18px",
          fontWeight: "bold",
          fontFamily: "inherit",
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
        labels: {
          style: {
            colors: Array(9).fill(textColor),
            fontSize: "12px",
          },
        },
        axisBorder: {
          show: true,
          color: gridColor,
        },
        axisTicks: {
          color: gridColor,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: Array(7).fill(textColor),
            fontSize: "12px",
          },
        },
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 3,
        position: "back",
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        style: {
          fontSize: "12px",
          fontFamily: "inherit",
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        labels: {
          colors: textColor,
        },
        markers: {
          width: 12,
          height: 12,
          radius: 4,
        },
      },
    };

    setChartOptions(options);
  }, [theme]);

  const series = [
    { name: "Bole", data: generateData(9, { min: 0, max: 100 }) },
    { name: "Piazza", data: generateData(9, { min: 0, max: 100 }) },
    { name: "Akaki", data: generateData(9, { min: 0, max: 100 }) },
    { name: "Lideta", data: generateData(9, { min: 0, max: 100 }) },
    { name: "Kolfe Keranio", data: generateData(9, { min: 0, max: 100 }) },
    { name: "Yeka", data: generateData(9, { min: 0, max: 100 }) },
    { name: "Addis Ketema", data: generateData(9, { min: 0, max: 100 }) },
  ];

  if (!chartOptions) return null;

  return (
    <div className="w-full p-4 rounded-xl border border-border bg-card shadow-lg">
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="heatmap"
        height={350}
      />
    </div>
  );
};

export default HeatMap;
