"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface CheckCodeDialogProps {
  open: boolean;
  mode: "in" | "out";
  opTitle: string;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export function CheckCodeDialog({
  open,
  mode,
  opTitle,
  onClose,
  onSubmit,
}: CheckCodeDialogProps) {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (!code.trim()) return;
    onSubmit(code);
    setCode("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === "in" ? "Check In" : "Check Out"} for {opTitle}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

