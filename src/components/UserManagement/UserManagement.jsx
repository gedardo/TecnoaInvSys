import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import UserList from './UserList';
import UserForm from './UserForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(true);

  // Aquí irían las llamadas a la API para obtener y manipular usuarios
  useEffect(() => {
    // Cargar usuarios
  }, []);

  const handleAddUser = () => {
    setIsNewUser(true);
    setSelectedUser(null);
    setOpenForm(true);
  };

  const handleEditUser = (user) => {
    setIsNewUser(false);
    setSelectedUser(user);
    setOpenForm(true);
  };

  const handleDeleteUser = (userId) => {
    setSelectedUser(userId);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (values) => {
    // Lógica para crear/actualizar usuario
  };

  const handleConfirmDelete = async () => {
    // Lógica para eliminar usuario
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Gestión de Usuarios</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUser}
        >
          Nuevo Usuario
        </Button>
      </Box>

      <UserList
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      <UserForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        initialValues={selectedUser}
        isNewUser={isNewUser}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default UserManagement;