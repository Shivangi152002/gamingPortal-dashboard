import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://85.209.95.229:3000/api';

const UserManager = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { isRoot } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    if (isRoot) {
      fetchUsers();
    }
  }, [isRoot]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`);
      if (response.data.success) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      enqueueSnackbar('Failed to load users', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditMode(true);
      setCurrentUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: '', // Don't show password
        role: user.role
      });
    } else {
      setEditMode(false);
      setCurrentUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setCurrentUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user'
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.username || !formData.email) {
        enqueueSnackbar('Username and email are required', { variant: 'error' });
        return;
      }

      if (!editMode && !formData.password) {
        enqueueSnackbar('Password is required for new users', { variant: 'error' });
        return;
      }

      if (editMode) {
        // Update user
        const updateData = {
          username: formData.username,
          email: formData.email,
          role: formData.role
        };
        
        // Only include password if it was changed
        if (formData.password) {
          updateData.password = formData.password;
        }

        const response = await axios.put(`${API_BASE_URL}/users/${currentUser.id}`, updateData);
        if (response.data.success) {
          enqueueSnackbar('User updated successfully', { variant: 'success' });
          fetchUsers();
          handleCloseDialog();
        }
      } else {
        // Create new user
        const response = await axios.post(`${API_BASE_URL}/users`, formData);
        if (response.data.success) {
          enqueueSnackbar('User created successfully', { variant: 'success' });
          fetchUsers();
          handleCloseDialog();
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to save user', 
        { variant: 'error' }
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
      if (response.data.success) {
        enqueueSnackbar('User deleted successfully', { variant: 'success' });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
    }
  };

  if (!isRoot) {
    return (
      <Alert severity="warning">
        Only root user can access user management.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          👥 User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        As root user, you can add and manage users who can access this admin panel.
      </Alert>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Username</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email} hover>
                <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={user.role === 'root' ? 'error' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.isSystemUser ? (
                    <Chip label="System User" size="small" color="warning" />
                  ) : (
                    <Chip label="Active" size="small" color="success" />
                  )}
                </TableCell>
                <TableCell align="right">
                  {!user.isSystemUser && (
                    <>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                  {user.isSystemUser && (
                    <Typography variant="caption" color="text.secondary">
                      Edit in .env file
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
              required
              disabled={editMode} // Can't change email when editing
            />
            
            <TextField
              fullWidth
              label={editMode ? 'New Password (leave empty to keep current)' : 'Password'}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sx={{ mb: 2 }}
              required={!editMode}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            {editMode && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Leave password empty if you don't want to change it.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManager;
