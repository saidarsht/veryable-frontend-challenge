"use client";

import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

import type { Op } from "../types";
import { formatOpDate, formatTimeRange } from "@/utils/date";
import { OperatorTable } from "./OperatorTable";

interface OpCardProps {
  op: Op;
}

export function OpCard({ op }: OpCardProps) {
  const dateLabel = formatOpDate(op.opDate);
  const timeRange = formatTimeRange(op.startTime, op.endTime);
  const filledLabel = `${op.filledQuantity}/${op.operatorsNeeded}`;

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        border: "none",
        backgroundColor: "white",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 25px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack spacing={1}>
            <Typography variant="h5" sx={{ color: "primary.main" }}>
              {op.opTitle}
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                <strong>Public ID:</strong> {op.publicId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Operators Needed:</strong> {filledLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Date:</strong> {dateLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Time:</strong> {timeRange}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Est. Hours:</strong> {op.estTotalHours}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 1, borderColor: "neutral.seven" }} />

          <OperatorTable op={op} />
        </Stack>
      </CardContent>
    </Card>
  );
}
