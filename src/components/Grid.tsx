import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "tailwindcss/tailwind.css";

interface GridData {
  columns: string[];
  rows: string[];
  data: (number | null)[][];
}

const Grid: React.FC = () => {
  const [gridData, setGridData] = useState<GridData | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  // Fetching the JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://run.mocky.io/v3/b31cac6c-7d96-49ee-9080-4060ef3ec530"
        );
        const data = await response.json();
        setGridData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Determining background color based on the cell value
  const getCellColor = (value: number | null) => {
    if (value === null) return "bg-white";
    if (value === 0) return "bg-white";

    // positive values
    if (value > 0) {
      if (value <= 2) return "bg-green-100"; // Lighter green
      if (value <= 4) return "bg-green-200";
      if (value <= 6) return "bg-green-300";
      if (value <= 8) return "bg-green-400"; // Medium green
      return "bg-green-500"; // Darker green
    }

    // negative values
    if (value < 0) {
      if (value >= -2) return "bg-red-100"; // Lighter red
      if (value >= -4) return "bg-red-200";
      if (value >= -6) return "bg-red-300";
      if (value >= -8) return "bg-red-400"; // Medium red
      return "bg-red-500"; // Darker red
    }
    return "bg-white";
  };

  // Calculating the average for each column
  const calculateAverage = (data: (number | null)[][]) => {
    const averages = [];

    for (let colIndex = 0; colIndex < data[0].length; colIndex++) {
      const validValues = data
        .map((row) => row[colIndex])
        .filter((value) => value !== null) as number[];
      const avg =
        validValues.reduce((acc, curr) => acc + curr, 0) / validValues.length;
      averages.push(avg);
    }

    return averages;
  };

  // Calculating the standard deviation for each column
  const calculateStandardDeviation = (data: (number | null)[][]) => {
    const stdDeviations = [];

    for (let colIndex = 0; colIndex < data[0].length; colIndex++) {
      const validValues = data
        .map((row) => row[colIndex])
        .filter((value) => value !== null) as number[];
      const avg =
        validValues.reduce((acc, curr) => acc + curr, 0) / validValues.length;
      const variance =
        validValues.reduce((acc, curr) => acc + (curr - avg) ** 2, 0) /
        validValues.length;
      const stdDev = Math.sqrt(variance);
      stdDeviations.push(stdDev);
    }

    return stdDeviations;
  };

  if (!gridData) {
    return <div>Loading...</div>;
  }

  const averages = calculateAverage(gridData.data);
  const stdDeviations = calculateStandardDeviation(gridData.data);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div
        className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md animate-fadeIn"
        dir="rtl"
        style={{ fontFamily: "Vazirmatn, sans-serif" }}
      >
        <h3 className="text-center text-lg font-semibold mb-4">جدول داده‌ها</h3>
        <div className="overflow-x-auto">
          {/* Main Table */}
          <Table className="min-w-full border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">سال</TableHead>
                {gridData.columns.map((header, index) => (
                  <TableHead
                    key={index}
                    className={`hover:bg-gray-100 cursor-pointer text-center ${
                      hoveredColumn === index
                        ? "bg-gray-200 opacity-100"
                        : "opacity-80"
                    }`}
                    onMouseEnter={() => {
                      setHoveredColumn(index);
                      setHoveredRow(null);
                    }}
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {gridData.rows.map((rowHeader, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={`${
                    hoveredRow === rowIndex
                      ? "bg-gray-200 opacity-100"
                      : "opacity-80"
                  }`}
                >
                  <TableCell
                    className="font-medium hover:bg-gray-100 cursor-pointer text-center"
                    onMouseEnter={() => {
                      setHoveredRow(rowIndex);
                      setHoveredColumn(null);
                    }}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {rowHeader}
                  </TableCell>

                  {gridData.data[rowIndex].map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className={`p-2 h-12 border text-center ${getCellColor(
                        cell
                      )} ${
                        hoveredRow === rowIndex || hoveredColumn === cellIndex
                          ? "opacity-100"
                          : "opacity-50"
                      }`}
                    >
                      {cell !== null ? `${cell}%` : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300" />

        {/* Average and Standard Deviation Rows */}
        <div className="overflow-x-auto">
          <Table className="min-w-full border-collapse">
            <TableBody>
              {/* Average Row */}
              <TableRow className="bg-gray-100">
                <TableCell className="font-medium text-center">
                  میانگین
                </TableCell>
                {averages.map((value, index) => (
                  <TableCell
                    key={index}
                    className={`text-center ${getCellColor(value)}`}
                  >
                    {value !== null ? `${value.toFixed(2)}` : ""}
                  </TableCell>
                ))}
              </TableRow>

              {/* Standard Deviation Row */}
              <TableRow className="bg-gray-50">
                <TableCell className="font-medium text-center">
                  انحراف معیار
                </TableCell>
                {stdDeviations.map((value, index) => (
                  <TableCell
                    key={index}
                    className={`text-center ${getCellColor(value)}`}
                  >
                    {value !== null ? `${value.toFixed(2)}` : ""}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Grid;
