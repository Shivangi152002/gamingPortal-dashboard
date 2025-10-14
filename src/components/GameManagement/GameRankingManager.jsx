/**
 * Game Ranking Manager Component
 * 
 * Provides comprehensive ranking management for admins
 * Includes manual rank setting, status toggles, and bulk operations
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  Pagination,
  Grid,
  Avatar,
  InputAdornment,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from '../../utils/axios';
import { config } from '../../config';

const GameRankingManager = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rank');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [gamesPerPage] = useState(10);
  const [editingGame, setEditingGame] = useState(null);
  const [editRank, setEditRank] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        config.api.getFullUrl(`${config.api.endpoints.ranking.allGames}?activeOnly=false&sortBy=${sortBy}&sortOrder=${sortOrder}`),
        { timeout: config.api.timeout }
      );

      if (response.data.success) {
        setGames(response.data.data.games);
        enqueueSnackbar(`Loaded ${response.data.data.games.length} games`, { variant: 'success' });
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Failed to load games');
      enqueueSnackbar('Failed to load games', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [sortBy, sortOrder]);

  useEffect(() => {
    let filtered = games;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(game => {
        if (statusFilter === 'active') return game.isActive !== false;
        if (statusFilter === 'inactive') return game.isActive === false;
        return true;
      });
    }

    setFilteredGames(filtered);
    setPage(1); // Reset to first page when filters change
  }, [games, searchQuery, statusFilter]);

  const handleEditRank = (game) => {
    setSelectedGame(game);
    setEditRank(game.rank?.toString() || '');
    setEditDialogOpen(true);
  };

  const handleSaveRank = async () => {
    try {
      const newRank = parseInt(editRank);
      if (isNaN(newRank) || newRank < 1) {
        enqueueSnackbar('Please enter a valid rank (1 or higher)', { variant: 'error' });
        return;
      }

      const response = await axios.put(
        config.api.getFullUrl(config.api.endpoints.ranking.setRank),
        {
          gameId: selectedGame.id,
          rank: newRank
        },
        { timeout: config.api.timeout }
      );

      if (response.data.success) {
        enqueueSnackbar('Game rank updated successfully', { variant: 'success' });
        setEditDialogOpen(false);
        fetchGames(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating rank:', error);
      enqueueSnackbar('Failed to update rank', { variant: 'error' });
    }
  };

  const handleToggleStatus = async (game) => {
    try {
      const newStatus = game.isActive === false;
      const response = await axios.put(
        config.api.getFullUrl(config.api.endpoints.ranking.gameStatus),
        {
          gameId: game.id,
          isActive: newStatus
        },
        { timeout: config.api.timeout }
      );

      if (response.data.success) {
        enqueueSnackbar(`Game ${newStatus ? 'activated' : 'deactivated'} successfully`, { variant: 'success' });
        fetchGames(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating status:', error);
      enqueueSnackbar('Failed to update status', { variant: 'error' });
    }
  };

  const handleRecalculateRankings = async () => {
    try {
      const response = await axios.post(
        config.api.getFullUrl(config.api.endpoints.ranking.recalculate),
        {},
        { timeout: config.api.timeout }
      );

      if (response.data.success) {
        enqueueSnackbar('All rankings recalculated successfully', { variant: 'success' });
        fetchGames(); // Refresh the list
      }
    } catch (error) {
      console.error('Error recalculating rankings:', error);
      enqueueSnackbar('Failed to recalculate rankings', { variant: 'error' });
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />;
      case 2:
        return <StarIcon sx={{ color: '#C0C0C0', fontSize: 20 }} />;
      case 3:
        return <StarIcon sx={{ color: '#CD7F32', fontSize: 20 }} />;
      default:
        return <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>#{rank}</Typography>;
    }
  };

  const formatPlayCount = (count) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getPlayCountColor = (playCount) => {
    if (playCount >= 100) return 'success';
    if (playCount >= 50) return 'warning';
    if (playCount >= 10) return 'info';
    return 'default';
  };

  // Pagination
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const startIndex = (page - 1) * gamesPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + gamesPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading games...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={fetchGames}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="primary" />
          Game Ranking Manager
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchGames}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={handleRecalculateRankings}
            color="warning"
          >
            Recalculate All Rankings
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Games</MenuItem>
                  <MenuItem value="active">Active Only</MenuItem>
                  <MenuItem value="inactive">Inactive Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="rank">Rank</MenuItem>
                  <MenuItem value="playCount">Play Count</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="lastPlayed">Last Played</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredGames.length} of {games.length} games
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Games Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Game</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Plays</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Last Played</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedGames.map((game) => (
                  <TableRow 
                    key={game.id}
                    sx={{ 
                      '&:hover': { backgroundColor: 'action.hover' },
                      opacity: game.isActive === false ? 0.6 : 1
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRankIcon(game.rank)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={game.thumb_url ? `${config.aws.cloudFrontUrl}${game.thumb_url}` : undefined}
                          sx={{ width: 40, height: 40 }}
                        >
                          {game.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {game.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {game.description || 'No description available'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={game.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PlayIcon color="primary" sx={{ fontSize: 16 }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: getPlayCountColor(game.playCount) === 'success' ? 'success.main' : 
                                   getPlayCountColor(game.playCount) === 'warning' ? 'warning.main' : 'text.primary'
                          }}
                        >
                          {formatPlayCount(game.playCount || 0)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={game.isActive !== false}
                            onChange={() => handleToggleStatus(game)}
                            color="success"
                          />
                        }
                        label={game.isActive !== false ? 'Active' : 'Inactive'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {game.lastPlayed 
                          ? new Date(game.lastPlayed).toLocaleDateString()
                          : 'Never'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Rank">
                        <IconButton
                          onClick={() => handleEditRank(game)}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Edit Rank Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Game Rank</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {selectedGame?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Current Rank: #{selectedGame?.rank}
            </Typography>
            <TextField
              fullWidth
              label="New Rank"
              type="number"
              value={editRank}
              onChange={(e) => setEditRank(e.target.value)}
              inputProps={{ min: 1 }}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveRank} variant="contained">
            Save Rank
          </Button>
        </DialogActions>
      </Dialog>

      {filteredGames.length === 0 && !loading && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No games found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {games.length === 0 ? 'Upload some games to get started' : 'Try adjusting your search or filters'}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default GameRankingManager;
