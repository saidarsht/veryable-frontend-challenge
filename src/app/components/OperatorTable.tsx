"use client";

import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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
        const firstNameCompare = a.firstName
          .toLowerCase()
          .localeCompare(b.firstName.toLowerCase());
        if (firstNameCompare !== 0) {
          comparison = firstNameCompare;
        } else {
          comparison = a.lastName
            .toLowerCase()
            .localeCompare(b.lastName.toLowerCase());
        }
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
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        mt: 2,
        borderRadius: 2,
        border: (theme) => `2px solid ${theme.palette.divider}`,
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
            }}
          >
            <TableCell
              onClick={() => handleSortClick("name")}
              sx={{
                cursor: "pointer",
                userSelect: "none",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Operator{" "}
              {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableCell>
            <TableCell
              align="right"
              onClick={() => handleSortClick("opsCompleted")}
              sx={{
                cursor: "pointer",
                userSelect: "none",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Ops Completed{" "}
              {sortField === "opsCompleted" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableCell>
            <TableCell
              align="right"
              onClick={() => handleSortClick("reliability")}
              sx={{
                cursor: "pointer",
                userSelect: "none",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Reliability{" "}
              {sortField === "reliability" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>
              Endorsements
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedOperators.map((operator, index) => {
            const fullName = `${operator.firstName} ${operator.lastName}`;
            const reliabilityPercent = Math.round(operator.reliability * 100);

            return (
              <TableRow
                key={operator.id}
                hover
                sx={{
                  backgroundColor: index % 2 === 0 ? "white" : "action.hover",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {fullName}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {operator.opsCompleted}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {reliabilityPercent}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {operator.endorsements.map((endorsement) => (
                      <Chip
                        key={endorsement}
                        label={endorsement}
                        size="small"
                        sx={{
                          backgroundColor: "primary.light",
                          color: "primary.dark",
                          fontSize: "0.75rem",
                          height: "24px",
                        }}
                      />
                    ))}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
