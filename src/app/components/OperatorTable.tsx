"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { Op } from "../types";

type SortField = "name" | "opsCompleted" | "reliability";
type SortDirection = "asc" | "desc";

interface OperatorTableProps {
  op: Op;
}

export function OperatorTable({ op }: OperatorTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSortClick = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedOperators = useMemo(() => {
    const sorted = [...op.operators];
    sorted.sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.firstName.localeCompare(b.firstName);
      } else if (sortField === "opsCompleted") {
        comparison = a.opsCompleted - b.opsCompleted;
      } else {
        comparison = a.reliability - b.reliability;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
    return sorted;
  }, [op.operators, sortField, sortDirection]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              onClick={() => handleSortClick("name")}
              sx={{ cursor: "pointer" }}
            >
              Operator {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableCell>
            <TableCell
              onClick={() => handleSortClick("opsCompleted")}
              sx={{ cursor: "pointer" }}
            >
              Ops Completed {sortField === "opsCompleted" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableCell>
            <TableCell
              onClick={() => handleSortClick("reliability")}
              sx={{ cursor: "pointer" }}
            >
              Reliability {sortField === "reliability" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedOperators.map((operator) => (
            <TableRow key={operator.id}>
              <TableCell>
                {operator.firstName} {operator.lastName}
              </TableCell>
              <TableCell>{operator.opsCompleted}</TableCell>
              <TableCell>{Math.round(operator.reliability * 100)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

