import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useTheme,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  SportsEsports as GamesIcon,
  CloudQueue as CloudIcon,
  Analytics as AnalyticsIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  LibraryBooks as LibraryIcon,
  Storage as StorageIcon,
  Speed as PerformanceIcon,
  DataObject as DataIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  TrendingUp as RankingIcon,
  ViewCarousel as BannerIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'

const drawerWidth = 260

const Sidebar = ({ open, onClose, isMobile }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const { logout, isRoot } = useAuth()

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    // { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { divider: true },
    { text: 'Game Library', icon: <LibraryIcon />, path: '/games/library' },
    { text: 'Upload Game', icon: <UploadIcon />, path: '/games/upload' },
    { text: 'Game Rankings', icon: <RankingIcon />, path: '/ranking' },
    // { text: 'Game Editor', icon: <EditIcon />, path: '/games/editor' },
    // { text: 'Game Data (JSON)', icon: <DataIcon />, path: '/games/data-viewer' },
    { divider: true },
    { text: 'Banner Management', icon: <BannerIcon />, path: '/banners' },
    { text: 'Site Settings', icon: <SettingsIcon />, path: '/site-settings' },
    // { text: 'S3 Manager', icon: <StorageIcon />, path: '/aws/s3' },
    // { text: 'CloudFront', icon: <CloudIcon />, path: '/aws/cloudfront' },
    // { text: 'Performance', icon: <PerformanceIcon />, path: '/aws/performance' },
    ...(isRoot ? [
      { divider: true },
      { text: 'User Management', icon: <PeopleIcon />, path: '/users', rootOnly: true }
    ] : []),
  ]

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      onClose()
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    if (isMobile) {
      onClose()
    }
  }

  const drawer = (
    <Box sx={{ overflow: 'auto', pt: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List sx={{ flex: 1 }}>
        {menuItems.map((item, index) => {
          if (item.divider) {
            return <Divider key={`divider-${index}`} sx={{ my: 1 }} />
          }

          const isActive = location.pathname === item.path || 
                          location.pathname.startsWith(item.path + '/')

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'text.secondary', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      
      {/* Logout button at bottom */}
      <Box sx={{ p: 1 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: 2,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.dark',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ 
                fontSize: 14,
                fontWeight: 500 
              }} 
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
     
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 64,
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawer}
    </Drawer>
  )
}

export default Sidebar
