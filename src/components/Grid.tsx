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

  const getCellColor = (value: number | null) => {
    if (value === null) return "bg-white";
    if (value === 0) return "bg-white";

    if (value > 0) {
      if (value <= 2) return "bg-green-100";
      if (value <= 4) return "bg-green-200";
      if (value <= 6) return "bg-green-300";
      if (value <= 8) return "bg-green-400";
      return "bg-green-500";
    }

    if (value < 0) {
      if (value >= -2) return "bg-red-100";
      if (value >= -4) return "bg-red-200";
      if (value >= -6) return "bg-red-300";
      if (value >= -8) return "bg-red-400";
      return "bg-red-500";
    }
    return "bg-white";
  };

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
    <div
      className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md animate-fadeIn"
      dir="rtl"
      style={{ fontFamily: "Vazirmatn, sans-serif" }}
    >
      <h3 className="text-center text-lg font-semibold mb-4">جدول داده‌ها</h3>
      <div className="overflow-x-auto">
        <Table
          className="min-w-full border-separate"
          style={{ borderSpacing: "0.5rem" }}
        >
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center bg-gray-100 rounded-lg">
                سال
              </TableHead>
              {gridData.columns.map((header, index) => (
                <TableHead
                  key={index}
                  className={`bg-gray-100 hover:bg-gray-200 cursor-pointer text-center rounded-lg ${
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
                  className="font-medium hover:bg-gray-100 cursor-pointer text-center p-4 rounded-lg"
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
                    className={`p-4 h-12 border text-center rounded-lg ${getCellColor(
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

      <hr className="my-6 border-gray-300" />

      <div className="overflow-x-auto">
        <Table
          className="min-w-full border-separate"
          style={{ borderSpacing: "0.5rem" }}
        >
          <TableBody>
            <TableRow className="bg-gray-100">
              <TableCell className="font-medium text-center p-4 rounded-lg">
                میانگین
              </TableCell>
              {averages.map((value, index) => (
                <TableCell
                  key={index}
                  className={`text-center p-4 rounded-lg ${getCellColor(
                    value
                  )}`}
                >
                  {value !== null ? `${value.toFixed(2)}` : ""}
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-gray-50">
              <TableCell className="font-medium text-center p-4 rounded-lg">
                انحراف معیار
              </TableCell>
              {stdDeviations.map((value, index) => (
                <TableCell
                  key={index}
                  className={`text-center p-4 rounded-lg ${getCellColor(
                    value
                  )}`}
                >
                  {value !== null ? `${value.toFixed(2)}` : ""}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Grid;
