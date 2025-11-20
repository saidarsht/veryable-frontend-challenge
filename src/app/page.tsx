"use client";

import { Box, Container, TextField, Typography } from "@mui/material";
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
      return matchesTitle || matchesPublicId;
    });
  }, [ops, searchQuery]);

  return (
    <Box>
      <Container>
        <Typography variant="h1">Ops Board</Typography>
        <TextField
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {filteredOps.map((op) => (
          <OpCard key={op.opId} op={op} />
        ))}
      </Container>
    </Box>
  );
}
