"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://frontend-challenge.veryableops.com/");
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = (await res.json()) as Op[];
      setOps(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load operations."
      );
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
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
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
                lineHeight: 1.6,
                maxWidth: "600px",
                opacity: 0.95,
              }}
            >
              Review today&apos;s Ops and manage operator check-ins.
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
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
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: 3,
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderRadius: 3,
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(0, 0, 0, 0.6)",
                  "&.Mui-focused": {
                    color: "white",
                  },
                },
                "& .MuiInputLabel-shrink": {
                  transform: "translate(16px, -18px) scale(0.75)",
                  color: "white !important",
                  backgroundColor: "transparent",
                },
              }}
            />
            {error && (
              <Button
                variant="contained"
                onClick={fetchData}
                disabled={loading}
                sx={{
                  backgroundColor: "white",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                Retry
              </Button>
            )}
          </Stack>

          {loading && (
            <Stack
              sx={{ minHeight: "40vh" }}
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress sx={{ color: "white" }} />
            </Stack>
          )}

          {!loading && error && (
            <Alert
              severity="error"
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiAlert-icon": {
                  color: "error.main",
                },
              }}
            >
              Failed to load Ops: {error}
            </Alert>
          )}

          {!loading && !error && ops.length > 0 && filteredOps.length === 0 && (
            <Alert
              severity="info"
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiAlert-icon": {
                  color: "info.main",
                },
              }}
            >
              No results for &quot;{searchQuery}&quot;.
            </Alert>
          )}

          {!loading &&
            !error &&
            filteredOps.map((op) => <OpCard key={op.opId} op={op} />)}
        </Stack>
      </Container>
    </Box>
  );
}
