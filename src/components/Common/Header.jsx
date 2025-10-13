import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import { useAuth } from '../../context/AuthContext'
import { useThemeMode } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const Header = ({ onMenuClick }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const { mode, toggleTheme, isDarkMode } = useThemeMode()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [notifAnchor, setNotifAnchor] = React.useState(null)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNotifMenuOpen = (event) => {
    setNotifAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setNotifAnchor(null)
  }

  const handleLogout = async () => {
    try {
      await logout()
      enqueueSnackbar('Logged out successfully', { variant: 'success' })
      navigate('/login')
    } catch (error) {
      enqueueSnackbar('Logout failed', { variant: 'error' })
    }
    handleMenuClose()
  }

  // Get user display name (username or email)
  const getUserDisplayName = () => {
    if (!user) return 'A'
    // Try different possible username fields
    return user.username || user.name || user.email?.split('@')[0] || user.email || 'U'
  }

  // Get user full info for display
  const getUserInfo = () => {
    if (!user) return { name: 'Anonymous', email: 'Not logged in' }
    return {
      name: user.username || user.name || user.email?.split('@')[0] || 'User',
      email: user.email || 'No email'
    }
  }

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: isDarkMode ? '#1e1e1e' : '#1976d2',
        boxShadow: isDarkMode ? '0px 2px 8px rgba(0,0,0,0.5)' : '0px 2px 8px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <SportsEsportsIcon sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Gaming Portal Admin
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* User Info Display */}
          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <Typography variant="body2" sx={{ color: 'white', mr: 1 }}>
                Welcome, {getUserInfo().name}
              </Typography>
            </Box>
          )}

          {/* Profile Icon */}
          <IconButton onClick={handleProfileMenuOpen}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {getUserDisplayName().charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          {/* Dark/Light Mode Toggle - Right corner */}
          <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton 
              onClick={toggleTheme} 
              sx={{ 
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(180deg)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: { width: 280 }
          }}
        >
          {/* User Info Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', mr: 2 }}>
                {getUserDisplayName().charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {getUserInfo().name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getUserInfo().email}
                </Typography>
              </Box>
            </Box>
            {user?.role && (
              <Chip 
                label={user.role.toUpperCase()} 
                size="small" 
                color={user.role === 'root' ? 'error' : 'primary'}
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>

          {/* Menu Items */}
          {/* <MenuItem onClick={handleMenuClose}>
            <AccountCircleIcon sx={{ mr: 2 }} /> Profile
          </MenuItem> */}
          {/* <MenuItem onClick={handleMenuClose}>
            <SettingsIcon sx={{ mr: 2 }} /> Settings
          </MenuItem>
           */}
          <Divider />
          
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon sx={{ mr: 2 }} /> Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 }
          }}
        >
          <MenuItem>
            <Typography variant="body2">New game uploaded: Super Mario</Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="body2">Storage limit reached 80%</Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="body2">CloudFront cache invalidated</Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="body2">Weekly analytics report ready</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
