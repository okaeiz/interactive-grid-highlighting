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

  const getCellColor = useCallback((value: number | null) => {
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
  }, []);

  const averages = useMemo(() => {
    if (!gridData) return [];
    const avgValues = [];
    for (let colIndex = 0; colIndex < gridData.data[0].length; colIndex++) {
      const validValues = gridData.data
        .map((row) => row[colIndex])
        .filter((value) => value !== null) as number[];
      const avg =
        validValues.reduce((acc, curr) => acc + curr, 0) / validValues.length;
      avgValues.push(parseFloat(avg.toFixed(2)));
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
      stdDevValues.push(parseFloat(stdDev.toFixed(2)));
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

  const convertToFarsiDigits = (number: number): string => {
    return number
      .toString()
      .replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)]);
  };

  const formatPercentage = (value: number): string => {
    const formattedValue = convertToFarsiDigits(Math.abs(value));
    return value < 0 ? `%${formattedValue}-` : `%${formattedValue}`;
  };

  if (!gridData) {
    return (
      <div dir="rtl" style={{ fontFamily: "Vazirmatn, sans-serif" }}>
        چند لحظه صبر کنید...
      </div>
    );
  }

  const isHighlighted = hoveredRow !== null || hoveredColumn !== null;

  return (
    <div dir="rtl" style={{ fontFamily: "Vazirmatn, sans-serif" }}>
      <div
        className={cn(
          "w-full max-w-6xl p-6 bg-white rounded-lg shadow-md animate-fadeIn"
        )}
      >
        <div className={cn("overflow-x-hidden mb-6")}>
          <Table
            className={cn("w-full")}
            style={{
              borderCollapse: "separate",
              borderSpacing: "0.5rem",
              tableLayout: "fixed",
            }}
          >
            <TableHeader>
              <TableRow>
                <TableHead
                  className={cn(
                    "text-center bg-gray-100 rounded-lg p-4",
                    isHighlighted
                      ? hoveredRow !== null
                        ? "bg-white"
                        : "hover:bg-blue-300"
                      : "opacity-70"
                  )}
                  style={{ width: "10%" }}
                >
                  سال
                </TableHead>
                {gridData.columns.map((header, index) => (
                  <TableHead
                    key={index}
                    className={cn(
                      "bg-gray-100 cursor-pointer text-center rounded-lg p-4",
                      isHighlighted
                        ? hoveredColumn === index
                          ? "bg-blue-300"
                          : "bg-white"
                        : "opacity-70"
                    )}
                    style={{ width: `${90 / gridData.columns.length}%` }}
                    onMouseEnter={() => handleMouseEnterColumn(index)}
                    onMouseLeave={handleMouseLeaveColumn}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <div className="mb-4"></div>

            <TableBody>
              {gridData.rows.map((rowHeader, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={cn(
                    hoveredRow === rowIndex
                      ? "bg-blue-200"
                      : hoveredColumn !== null
                      ? "bg-white"
                      : "opacity-70"
                  )}
                >
                  <TableCell
                    className={cn(
                      "font-medium cursor-pointer text-center p-4 rounded-lg",
                      hoveredRow === rowIndex
                        ? "bg-blue-300"
                        : hoveredColumn === null && hoveredRow === null
                        ? "hover:bg-blue-200"
                        : ""
                    )}
                    style={{ width: "10%" }}
                    onMouseEnter={() => handleMouseEnterRow(rowIndex)}
                    onMouseLeave={handleMouseLeaveRow}
                  >
                    {convertToFarsiDigits(parseInt(rowHeader))}
                  </TableCell>
                  {gridData.data[rowIndex].map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className={cn(
                        "text-center p-4 rounded-lg",
                        getCellColor(cell),
                        hoveredRow === rowIndex || hoveredColumn === cellIndex
                          ? "opacity-100"
                          : isHighlighted
                          ? "bg-white"
                          : "opacity-70"
                      )}
                      style={{ width: `${90 / gridData.columns.length}%` }}
                    >
                      {cell !== null ? (
                        <span dir="rtl" style={{ display: "inline-block" }}>
                          {formatPercentage(cell)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <hr className="my-6 border-gray-300" />

        <div className={cn("overflow-x-hidden mt-4")}>
          <Table
            className={cn("w-full")}
            style={{
              borderCollapse: "separate",
              borderSpacing: "0.5rem",
              tableLayout: "fixed",
            }}
          >
            <TableBody>
              <TableRow className={cn("bg-gray-100 mb-4")}>
                <TableCell
                  className={cn("font-medium text-center p-4 rounded-lg")}
                  style={{ width: "10%" }}
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
                    style={{ width: `${90 / gridData.columns.length}%` }}
                  >
                    {value !== null ? (
                      <span dir="rtl" style={{ display: "inline-block" }}>
                        {formatPercentage(value)}
                      </span>
                    ) : (
                      ""
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className={cn("h-4")}></TableRow>
              <TableRow className={cn("bg-gray-50 mt-4")}>
                <TableCell
                  className={cn("font-medium text-center p-4 rounded-lg")}
                  style={{ width: "10%" }}
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
                    style={{ width: `${90 / gridData.columns.length}%` }}
                  >
                    {value !== null ? (
                      <span dir="rtl" style={{ display: "inline-block" }}>
                        {formatPercentage(value)}
                      </span>
                    ) : (
                      ""
                    )}
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
