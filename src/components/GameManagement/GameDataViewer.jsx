import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Code as CodeIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const GameDataViewer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [editedJson, setEditedJson] = useState('');
  const [jsonError, setJsonError] = useState('');

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/games`);
      if (response.data.success) {
        setGameData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
      enqueueSnackbar('Failed to load game data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  const handleOpenJsonEditor = () => {
    setEditedJson(JSON.stringify(gameData, null, 2));
    setJsonError('');
    setJsonDialogOpen(true);
  };

  const handleSaveJson = async () => {
    try {
      // Validate JSON
      const parsedData = JSON.parse(editedJson);
      
      if (!parsedData.games || !Array.isArray(parsedData.games)) {
        setJsonError('Invalid format: must include "games" array');
        return;
      }

      // Save to backend
      const response = await axios.put(`${API_BASE_URL}/games/data/full-update`, parsedData);
      
      if (response.data.success) {
        setGameData(parsedData);
        setJsonDialogOpen(false);
        enqueueSnackbar('Game data updated successfully!', { variant: 'success' });
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        setJsonError('Invalid JSON syntax: ' + error.message);
      } else {
        console.error('Error saving game data:', error);
        enqueueSnackbar('Failed to save game data', { variant: 'error' });
      }
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/games/${gameId}`);
      if (response.data.success) {
        enqueueSnackbar('Game deleted successfully', { variant: 'success' });
        fetchGameData();
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      enqueueSnackbar('Failed to delete game', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          📊 Game Data Manager
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchGameData}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<CodeIcon />}
            onClick={handleOpenJsonEditor}
          >
            Edit JSON
          </Button>
        </Box>
      </Box>

      {/* Summary Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper elevation={2} sx={{ p: 2, flex: 1 }}>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            {gameData?.games?.length || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Games
          </Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, flex: 1 }}>
          <Typography variant="h4" color="secondary" sx={{ fontWeight: 700 }}>
            {new Set(gameData?.games?.map(g => g.category)).size || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Categories
          </Typography>
        </Paper>
      </Box>

      {/* Games Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Developer</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Files</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gameData?.games?.length > 0 ? (
              gameData.games.map((game) => (
                <TableRow key={game.id} hover>
                  <TableCell>
                    <Chip label={game.id} size="small" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{game.name}</TableCell>
                  <TableCell>{game.category}</TableCell>
                  <TableCell>{game.developer || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {game.thumbnail && <Chip label="Thumbnail" size="small" color="primary" variant="outlined" />}
                      {game.gif && <Chip label="GIF" size="small" color="secondary" variant="outlined" />}
                      {game.logo && <Chip label="Logo" size="small" color="success" variant="outlined" />}
                      {game.htmlFile && <Chip label="HTML" size="small" color="info" variant="outlined" />}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => handleDeleteGame(game.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No games found. Upload your first game!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* JSON Editor Dialog */}
      <Dialog 
        open={jsonDialogOpen} 
        onClose={() => setJsonDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit game-data.json
        </DialogTitle>
        <DialogContent>
          {jsonError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {jsonError}
            </Alert>
          )}
          <TextField
            fullWidth
            multiline
            rows={20}
            value={editedJson}
            onChange={(e) => setEditedJson(e.target.value)}
            variant="outlined"
            sx={{
              fontFamily: 'monospace',
              '& textarea': {
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJsonDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveJson}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GameDataViewer;
