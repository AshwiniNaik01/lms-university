import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function StudentGrowthChart() {
  
const [series, setSeries] = useState<
  { name: string; data: number[] }[]
>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Simulate fetching student registration data from backend
  useEffect(() => {
    // Sample data from API
    const apiData = [
      { date: "2025-01", totalStudents: 50 },
      { date: "2025-02", totalStudents: 85 },
      { date: "2025-03", totalStudents: 110 },
      { date: "2025-04", totalStudents: 150 },
      { date: "2025-05", totalStudents: 200 },
      { date: "2025-06", totalStudents: 260 },
      { date: "2025-07", totalStudents: 310 },
    ];

    setCategories(apiData.map((item) => item.date));
    setSeries([
      {
        name: "Total Students",
        data: apiData.map((item) => item.totalStudents),
      },
    ]);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 310,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0,
      },
    },
    markers: {
      size: 4,
      colors: ["#ffffff"],
      strokeColors: "#465FFF",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    colors: ["#465FFF"],
    dataLabels: { enabled: false },
    grid: {
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      x: { format: "MMM yyyy" },
    },
    xaxis: {
      categories,
      labels: {
        style: { fontSize: "12px", colors: "#6B7280" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Students", style: { fontSize: "14px" } },
      labels: {
        style: { fontSize: "12px", colors: "#6B7280" },
      },
    },
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="studentGrowthChart" className="min-w-[1000px]">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}
