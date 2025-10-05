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
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'

const Header = ({ onMenuClick }) => {
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

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#1976d2',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
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
          <IconButton color="inherit" onClick={handleNotifMenuOpen}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>

          <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              A
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <AccountCircleIcon sx={{ mr: 2 }} /> Profile
          </MenuItem>
          <MenuItem>
            <SettingsIcon sx={{ mr: 2 }} /> Settings
          </MenuItem>
          <Divider />
          <MenuItem>
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
