"use client";

import {
  Alert,
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
  errorMessage?: string | null;
}

export function CheckCodeDialog({
  open,
  mode,
  opTitle,
  onClose,
  onSubmit,
  errorMessage,
}: CheckCodeDialogProps) {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (!code.trim()) return;
    onSubmit(code);
    setCode("");
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {mode === "in" ? "Check In" : "Check Out"} for {opTitle}
      </DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <TextField
          label="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
          fullWidth
          error={!!errorMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
