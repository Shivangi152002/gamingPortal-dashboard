import React, { useState, useEffect } from 'react'
import { Paper, Box, Typography, ButtonGroup, Button, CircularProgress } from '@mui/material'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import axios from '../../utils/axios'
import { config } from '../../config'

const PerformanceChart = () => {
  const [chartType, setChartType] = useState('area')
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        
        // Fetch games data to generate chart data
        const response = await axios.get(config.api.getFullUrl(config.api.endpoints.games.list), {
          timeout: config.api.timeout
        })
        if (response.data.success) {
          const games = response.data.data.games || []
          
          // Generate chart data based on game categories
          const categoryStats = games.reduce((acc, game) => {
            acc[game.category] = (acc[game.category] || 0) + 1
            return acc
          }, {})
          
          // Create chart data with top categories
          const topCategories = Object.entries(categoryStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6)
            .map(([category, count]) => ({
              name: category,
              games: count,
              size: games.filter(g => g.category === category).reduce((total, g) => {
                const sizeMap = { small: 1, medium: 2, large: 3 }
                return total + (sizeMap[g.size] || 1)
              }, 0),
              featured: games.filter(g => g.category === category && g.featured).length
            }))
          
          setChartData(topCategories)
        }
        
      } catch (error) {
        console.error('Error fetching chart data:', error)
        // Fallback to sample data if API fails
        setChartData([
          { name: 'Arcade', games: 5, size: 8, featured: 2 },
          { name: 'Puzzle', games: 4, size: 6, featured: 1 },
          { name: 'Action', games: 3, size: 9, featured: 1 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          📊 Game Categories Analytics
        </Typography>
        <ButtonGroup size="small" variant="outlined">
          <Button 
            variant={chartType === 'area' ? 'contained' : 'outlined'}
            onClick={() => setChartType('area')}
          >
            Area
          </Button>
          <Button 
            variant={chartType === 'line' ? 'contained' : 'outlined'}
            onClick={() => setChartType('line')}
          >
            Line
          </Button>
        </ButtonGroup>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="games" 
                stackId="1" 
                stroke="#1976d2" 
                fill="#1976d2" 
                fillOpacity={0.6}
                name="Games Count"
              />
              <Area 
                type="monotone" 
                dataKey="size" 
                stackId="2" 
                stroke="#388e3c" 
                fill="#388e3c" 
                fillOpacity={0.6}
                name="Size Score"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="games" stroke="#1976d2" strokeWidth={2} name="Games Count" />
              <Line type="monotone" dataKey="featured" stroke="#f57c00" strokeWidth={2} name="Featured Games" />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </Paper>
  )
}

export default PerformanceChart
