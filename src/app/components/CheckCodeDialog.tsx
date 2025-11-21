"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
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

  const handleClose = () => {
    setCode("");
    onClose();
  };

  const handleSubmit = () => {
    if (!code.trim()) return;
    onSubmit(code);
    setCode("");
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {mode === "in" ? "Check In" : "Check Out"} for {opTitle}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography variant="body2" color="text.secondary">
            Enter the {mode === "in" ? "check-in" : "check-out"} code provided
            by your supervisor to complete this action.
          </Typography>
          <TextField
            label="Code"
            size="small"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
          />
          {errorMessage && (
            <Typography variant="caption" color="error">
              {errorMessage}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
