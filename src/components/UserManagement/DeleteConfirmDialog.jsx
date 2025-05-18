import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const DeleteConfirmDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;