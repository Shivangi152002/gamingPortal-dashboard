/**
 * Top Games Ranking Component
 * 
 * Displays the top 5 most played games with ranking information
 * Follows SOLID principles with single responsibility for ranking display
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
  Grid,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  List as ListIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { config } from '../../config';

const TopGamesRanking = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [allGames, setAllGames] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAllGames = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ALL games with rankings
      const gamesResponse = await axios.get(
        config.api.getFullUrl(config.api.endpoints.ranking.allGames + '?activeOnly=true&sortBy=rank&sortOrder=asc'),
        { timeout: config.api.timeout }
      );

      // Fetch statistics
      const statsResponse = await axios.get(
        config.api.getFullUrl(config.api.endpoints.ranking.statistics),
        { timeout: config.api.timeout }
      );

      if (gamesResponse.data.success) {
        setAllGames(gamesResponse.data.data.games);
        setTotalPages(Math.ceil(gamesResponse.data.data.games.length / gamesPerPage));
      }

      if (statsResponse.data.success) {
        setStatistics(statsResponse.data.data);
      }

    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Failed to load game rankings');
      enqueueSnackbar('Failed to load game rankings', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGames();
  }, []);

  // Update displayed games when page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    setDisplayedGames(allGames.slice(startIndex, endIndex));
  }, [allGames, currentPage, gamesPerPage]);

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

  const getPlayCountColor = (playCount) => {
    if (playCount >= 100) return 'success';
    if (playCount >= 50) return 'warning';
    if (playCount >= 10) return 'info';
    return 'default';
  };

  const formatPlayCount = (count) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Loading top games...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={fetchTopGames}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header with Statistics */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon color="primary" />
            Top Games by Play Count
          </Typography>
          {statistics && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {statistics.totalGames} total games • {statistics.totalPlays} total plays • {statistics.activeGames} active
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {displayedGames.length} of {allGames.length} games • Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ListIcon />}
            onClick={() => navigate('/ranking')}
            size="small"
          >
            View All Rankings
          </Button>
          <IconButton onClick={fetchAllGames} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Top Games Table */}
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
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedGames.map((game, index) => (
                  <TableRow 
                    key={game.id}
                    sx={{ 
                      '&:hover': { backgroundColor: 'action.hover' },
                      '&:nth-of-type(1)': { backgroundColor: 'rgba(255, 215, 0, 0.1)' },
                      '&:nth-of-type(2)': { backgroundColor: 'rgba(192, 192, 192, 0.1)' },
                      '&:nth-of-type(3)': { backgroundColor: 'rgba(205, 127, 50, 0.1)' }
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
                      <Chip
                        label={game.isActive !== false ? 'Active' : 'Inactive'}
                        size="small"
                        color={game.isActive !== false ? 'success' : 'default'}
                        variant={game.isActive !== false ? 'filled' : 'outlined'}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination - Bottom Right */}
          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center',
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              gap: 2
            }}>
              <Typography variant="body2" color="text.secondary">
                Page {currentPage} of {totalPages}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  size="small"
                >
                  Previous
                </Button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "contained" : "outlined"}
                      onClick={() => setCurrentPage(pageNum)}
                      size="small"
                      sx={{ minWidth: 40 }}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outlined"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  size="small"
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Additional Statistics Cards */}
      {statistics && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                  {statistics.totalGames}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Games
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {statistics.activeGames}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Games
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  {formatPlayCount(statistics.totalPlays)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Plays
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                  {statistics.averagePlaysPerGame}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Plays/Game
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}


      {allGames.length === 0 && !loading && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No games found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Upload some games to see rankings
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TopGamesRanking;
