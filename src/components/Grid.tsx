import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "tailwindcss/tailwind.css";
import { cn } from "@/lib/utils";

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
          "https://run.mocky.io/v3/e2089162-08d7-4e9e-ac49-da1d749902fc"
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
    if (value === null || value === 0) return "bg-white";

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

  const averages = useMemo(() => {
    if (!gridData) return [];
    const avgValues = [];
    for (let colIndex = 0; colIndex < gridData.data[0].length; colIndex++) {
      const validValues = gridData.data
        .map((row) => row[colIndex])
        .filter((value) => value !== null) as number[];
      const avg =
        validValues.reduce((acc, curr) => acc + curr, 0) / validValues.length;
      avgValues.push(avg);
    }
    return avgValues;
  }, [gridData]);

  const stdDeviations = useMemo(() => {
    if (!gridData) return [];
    const stdDevValues = [];
    for (let colIndex = 0; colIndex < gridData.data[0].length; colIndex++) {
      const validValues = gridData.data
        .map((row) => row[colIndex])
        .filter((value) => value !== null) as number[];
      const avg =
        validValues.reduce((acc, curr) => acc + curr, 0) / validValues.length;
      const variance =
        validValues.reduce((acc, curr) => acc + (curr - avg) ** 2, 0) /
        validValues.length;
      const stdDev = Math.sqrt(variance);
      stdDevValues.push(stdDev);
    }
    return stdDevValues;
  }, [gridData]);

  const handleMouseEnterColumn = useCallback((index: number) => {
    setHoveredColumn(index);
    setHoveredRow(null);
  }, []);

  const handleMouseLeaveColumn = useCallback(() => {
    setHoveredColumn(null);
  }, []);

  const handleMouseEnterRow = useCallback((index: number) => {
    setHoveredRow(index);
    setHoveredColumn(null);
  }, []);

  const handleMouseLeaveRow = useCallback(() => {
    setHoveredRow(null);
  }, []);

  if (!gridData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={cn(
        "w-full max-w-6xl p-6 bg-white rounded-lg shadow-md animate-fadeIn"
      )}
      dir="rtl"
      style={{ fontFamily: "Vazirmatn, sans-serif" }}
    >
      <h3 className={cn("text-center text-lg font-semibold mb-4")}>
        جدول داده‌ها
      </h3>

      <div className={cn("overflow-x-auto")}>
        <Table
          className={cn("min-w-full border-separate")}
          style={{ borderSpacing: "0.5rem" }}
        >
          <TableHeader>
            <TableRow>
              <TableHead
                className={cn("w-[100px] text-center bg-gray-100 rounded-lg")}
              >
                سال
              </TableHead>
              {gridData.columns.map((header, index) => (
                <TableHead
                  key={index}
                  className={cn(
                    "bg-gray-100 hover:bg-gray-200 cursor-pointer text-center rounded-lg",
                    hoveredColumn === index
                      ? "bg-gray-200 opacity-100"
                      : "opacity-80"
                  )}
                  onMouseEnter={() => handleMouseEnterColumn(index)}
                  onMouseLeave={handleMouseLeaveColumn}
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
                className={cn(
                  hoveredRow === rowIndex
                    ? "bg-gray-200 opacity-100"
                    : "opacity-80"
                )}
              >
                <TableCell
                  className={cn(
                    "font-medium hover:bg-gray-100 cursor-pointer text-center p-4 rounded-lg"
                  )}
                  onMouseEnter={() => handleMouseEnterRow(rowIndex)}
                  onMouseLeave={handleMouseLeaveRow}
                >
                  {rowHeader}
                </TableCell>

                {gridData.data[rowIndex].map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className={cn(
                      "p-4 h-12 border text-center rounded-lg",
                      getCellColor(cell),
                      hoveredRow === rowIndex || hoveredColumn === cellIndex
                        ? "opacity-100"
                        : "opacity-50"
                    )}
                  >
                    {cell !== null ? `${cell}%` : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <hr className={cn("my-6 border-gray-300")} />

      <div className={cn("overflow-x-auto")}>
        <Table
          className={cn("min-w-full border-separate")}
          style={{ borderSpacing: "0.5rem" }}
        >
          <TableBody>
            <TableRow className={cn("bg-gray-100")}>
              <TableCell
                className={cn("font-medium text-center p-4 rounded-lg")}
              >
                میانگین
              </TableCell>
              {averages.map((value, index) => (
                <TableCell
                  key={index}
                  className={cn(
                    "text-center p-4 rounded-lg",
                    getCellColor(value)
                  )}
                >
                  {value !== null ? `${value.toFixed(2)}` : ""}
                </TableCell>
              ))}
            </TableRow>

            <TableRow className={cn("bg-gray-50")}>
              <TableCell
                className={cn("font-medium text-center p-4 rounded-lg")}
              >
                انحراف معیار
              </TableCell>
              {stdDeviations.map((value, index) => (
                <TableCell
                  key={index}
                  className={cn(
                    "text-center p-4 rounded-lg",
                    getCellColor(value)
                  )}
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
