"use client";

import {
  Box,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { Op } from "./types";
import { OpCard } from "./components/OpCard";

export default function Home() {
  const [ops, setOps] = useState<Op[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://frontend-challenge.veryableops.com/");
      const data = await res.json();
      setOps(data);
    } catch (err) {
      console.error("Failed to load operations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ops;

    return ops.filter((op) => {
      const matchesTitle = op.opTitle.toLowerCase().includes(query);
      const matchesPublicId = op.publicId.toLowerCase().includes(query);
      const matchesOperator = op.operators.some((operator) =>
        `${operator.firstName} ${operator.lastName}`
          .toLowerCase()
          .includes(query)
      );
      return matchesTitle || matchesPublicId || matchesOperator;
    });
  }, [ops, searchQuery]);

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        backgroundColor: theme.palette.primary.main,
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        py: 4,
      })}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack
            spacing={1.5}
            sx={{ mb: 1, alignItems: "center", textAlign: "center" }}
          >
            <Typography
              variant="h1"
              sx={{
                color: (theme) => theme.palette.common.white,
                fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Ops Board
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: (theme) => theme.palette.primary.light,
                fontSize: { xs: "1rem", sm: "1.125rem" },
                fontWeight: 400,
                opacity: 0.95,
              }}
            >
              Review today&apos;s Ops and manage operator check-ins.
            </Typography>
          </Stack>

          <TextField
            label="Search by Operator, Op Title, or Public ID"
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: 3,
            }}
          />

          {!loading &&
            filteredOps.map((op) => <OpCard key={op.opId} op={op} />)}
        </Stack>
      </Container>
    </Box>
  );
}
