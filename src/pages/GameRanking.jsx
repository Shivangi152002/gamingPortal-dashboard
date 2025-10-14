import React from 'react';
import { Box, Typography } from '@mui/material';
import GameRankingManager from '../components/GameManagement/GameRankingManager';

const GameRanking = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        🏆 Game Ranking Management
      </Typography>
      <GameRankingManager />
    </Box>
  );
};

export default GameRanking;
