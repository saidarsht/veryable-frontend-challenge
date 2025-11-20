"use client";

import { Card, CardContent, Typography } from "@mui/material";
import type { Op } from "../types";
import { OperatorTable } from "./OperatorTable";

interface OpCardProps {
  op: Op;
}

export function OpCard({ op }: OpCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{op.opTitle}</Typography>
        <Typography variant="body2">Public ID: {op.publicId}</Typography>
        <Typography variant="body2">
          Operators: {op.filledQuantity}/{op.operatorsNeeded}
        </Typography>
        <OperatorTable op={op} />
      </CardContent>
    </Card>
  );
}

