"use client";

import {
  Button,
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

import type { Op, Operator } from "../types";
import { useCheckIn } from "../checkInContext";
import { CheckCodeDialog } from "./CheckCodeDialog";

type SortField = "name" | "opsCompleted" | "reliability";
type SortDirection = "asc" | "desc";

interface OperatorTableProps {
  op: Op;
}

export function OperatorTable({ op }: OperatorTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"in" | "out">("in");
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [activeOperator, setActiveOperator] = useState<Operator | null>(null);

  const { state, checkIn, checkOut } = useCheckIn();

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
        // Sort by first name then last name if tied
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

  const getStatus = (operatorId: number) => {
    const opMap = state[op.opId];
    if (!opMap || !opMap[operatorId]) {
      return { in: false, out: false };
    }
    const status = opMap[operatorId];
    return {
      in: !!status.checkedInAt,
      out: !!status.checkedOutAt,
    };
  };

  const openDialog = (operator: Operator, mode: "in" | "out") => {
    setActiveOperator(operator);
    setDialogMode(mode);
    setDialogError(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setActiveOperator(null);
  };

  const handleSubmitCode = (code: string) => {
    if (!activeOperator) return;
    const { opId, checkInCode, checkOutCode } = op;

    const result =
      dialogMode === "in"
        ? checkIn(opId, activeOperator.id, code, checkInCode)
        : checkOut(opId, activeOperator.id, code, checkOutCode);

    if (!result.success) {
      setDialogError(result.error);
    } else {
      setDialogError(null);
      setDialogOpen(false);
      setActiveOperator(null);
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          mt: 2,
          borderRadius: 2,
          border: (theme) => `2px solid ${theme.palette.neutral.seven}`,
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
              <TableCell align="right" sx={{ color: "white", fontWeight: 600 }}>
                Status / Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedOperators.map((operator, index) => {
              const status = getStatus(operator.id);
              const fullName = `${operator.firstName} ${operator.lastName}`;
              const reliabilityPercent = Math.round(operator.reliability * 100);

              return (
                <TableRow
                  key={operator.id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "white" : "neutral.nine",
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
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      {status.in && !status.out && (
                        <Typography
                          variant="caption"
                          color="success.main"
                          sx={{
                            width: "100px",
                            textAlign: "center",
                            fontWeight: 600,
                          }}
                        >
                          Checked In
                        </Typography>
                      )}
                      {status.out && (
                        <Typography
                          variant="caption"
                          color="success.main"
                          sx={{
                            width: "100px",
                            textAlign: "center",
                            fontWeight: 600,
                          }}
                        >
                          Checked Out
                        </Typography>
                      )}
                      {!status.in && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => openDialog(operator, "in")}
                          sx={{ width: "100px" }}
                        >
                          Check In
                        </Button>
                      )}
                      {status.in && !status.out && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => openDialog(operator, "out")}
                          sx={{ width: "100px" }}
                        >
                          Check Out
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <CheckCodeDialog
        // Reset dialog on change of operator or mode
        key={`${activeOperator?.id}-${dialogMode}`}
        open={dialogOpen}
        mode={dialogMode}
        opTitle={op.opTitle}
        onClose={closeDialog}
        onSubmit={handleSubmitCode}
        errorMessage={dialogError}
      />
    </>
  );
}
