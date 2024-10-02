import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          "https://run.mocky.io/v3/0deee043-edd8-48d0-add7-9de0a602df0e"
        );
        const data = await response.json();
        setGridData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!gridData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            {gridData.columns.map((header, index) => (
              <TableHead
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
                onMouseEnter={() => setHoveredColumn(index)}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {gridData.rows.map((rowHeader, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell
                className="font-medium hover:bg-gray-100 cursor-pointer"
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {rowHeader}
              </TableCell>
              {gridData.data[rowIndex].map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className={`
                    ${hoveredRow === rowIndex ? "bg-gray-50" : ""}
                    ${hoveredColumn === cellIndex ? "bg-gray-50" : ""}
                  `}
                >
                  {cell !== null ? cell.toFixed(1) : "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Grid;
