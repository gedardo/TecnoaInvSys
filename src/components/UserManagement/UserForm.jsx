import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  firstName: Yup.string().required('El nombre es requerido'),
  lastName: Yup.string().required('El apellido es requerido'),
  email: Yup.string().email('Correo electrónico inválido').required('El correo es requerido'),
  username: Yup.string().required('El nombre de usuario es requerido'),
  password: Yup.string().when('isNewUser', {
    is: true,
    then: Yup.string()
      .required('La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .matches(/[0-9]/, 'Debe contener al menos un número')
  }),
  role: Yup.string().required('El rol es requerido'),
});

const UserForm = ({ open, onClose, onSubmit, initialValues, isNewUser }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      role: '',
      status: true,
      contactNumber: '',
      department: ''
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isNewUser ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="firstName"
                label="Nombre"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="lastName"
                label="Apellido"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            {/* Campos adicionales similares para email, username, etc. */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="administrator">Administrador</MenuItem>
                  <MenuItem value="manager">Gerente</MenuItem>
                  <MenuItem value="standard">Usuario Estándar</MenuItem>
                  <MenuItem value="readonly">Usuario de Solo Lectura</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {isNewUser ? 'Crear' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;