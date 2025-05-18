import React, { useState } from 'react';
import { 
  DataGrid,
  GridToolbar
} from '@mui/x-data-grid';
import { 
  Box,
  Button,
  IconButton,
  Switch,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UserList = ({ users, onEdit, onDelete, onStatusChange }) => {
  const columns = [
    { field: 'fullName', headerName: 'Nombre Completo', flex: 1 },
    { field: 'email', headerName: 'Correo Electrónico', flex: 1 },
    { field: 'username', headerName: 'Usuario', flex: 1 },
    { field: 'role', headerName: 'Rol', flex: 1 },
    {
      field: 'status',
      headerName: 'Estado',
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.value === 'active'}
          onChange={() => onStatusChange(params.row.id)}
        />
      )
    },
    { field: 'lastLogin', headerName: 'Último Acceso', flex: 1 },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => onEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        components={{
          Toolbar: GridToolbar
        }}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default UserList;