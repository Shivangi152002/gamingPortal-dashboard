import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Breadcrumbs,
  Link,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  CreateNewFolder as NewFolderIcon,
  Refresh as RefreshIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'

const mockFiles = [
  { name: 'public/', type: 'folder', size: '-', modified: '2024-01-15' },
  { name: 'games/', type: 'folder', size: '-', modified: '2024-01-14' },
  { name: 'thumbnails/', type: 'folder', size: '-', modified: '2024-01-13' },
  { name: 'icons/', type: 'folder', size: '-', modified: '2024-01-12' },
  { name: 'index.html', type: 'file', size: '2.1 MB', modified: '2024-01-10' },
  { name: 'config.json', type: 'file', size: '4 KB', modified: '2024-01-09' },
]

const buckets = [
  { name: 'gameportal-games', region: 'us-east-1', size: '1.8 GB', files: 234 },
  { name: 'gameportal-assets', region: 'us-east-1', size: '600 MB', files: 156 },
  { name: 'gameportal-backups', region: 'us-east-1', size: '2.2 GB', files: 48 },
]

const S3Manager = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [selectedBucket, setSelectedBucket] = useState(buckets[0])
  const [currentPath, setCurrentPath] = useState(['gameportal-assets'])
  const [files, setFiles] = useState(mockFiles)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const handleRefresh = () => {
    enqueueSnackbar('Refreshing bucket...', { variant: 'info' })
    setTimeout(() => {
      enqueueSnackbar('Bucket refreshed', { variant: 'success' })
    }, 1000)
  }

  const handleUpload = () => {
    setUploadDialogOpen(true)
  }

  const handleDelete = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName))
    enqueueSnackbar(`${fileName} deleted`, { variant: 'success' })
  }

  const handleDownload = (fileName) => {
    enqueueSnackbar(`Downloading ${fileName}...`, { variant: 'info' })
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      setFiles([
        { name: newFolderName + '/', type: 'folder', size: '-', modified: new Date().toISOString().split('T')[0] },
        ...files
      ])
      enqueueSnackbar('Folder created', { variant: 'success' })
      setNewFolderName('')
      setNewFolderDialogOpen(false)
    }
  }

  const handleNavigate = (item) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name])
    }
  }

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        📁 S3 Bucket Manager
      </Typography>

      {/* Bucket Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {buckets.map((bucket) => (
          <Grid item xs={12} md={4} key={bucket.name}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                cursor: 'pointer',
                border: 2,
                borderColor: selectedBucket.name === bucket.name ? 'primary.main' : 'transparent',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.light',
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => setSelectedBucket(bucket)}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: 14 }}>
                {bucket.name}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Size
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {bucket.size}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Files
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {bucket.files}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Region
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {bucket.region}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Storage Usage */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📊 Storage Usage
          </Typography>
          <Chip
            label="2.4 GB / 5 GB (48%)"
            color="success"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={48}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Cost: $12.50/month
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Projected: $15.80/month
          </Typography>
        </Box>
      </Paper>

      {/* File Manager */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            File Manager
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<NewFolderIcon />}
              onClick={() => setNewFolderDialogOpen(true)}
            >
              New Folder
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleUpload}
            >
              Upload
            </Button>
          </Box>
        </Box>

        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}
        >
          {currentPath.map((path, index) => (
            <Link
              key={index}
              component="button"
              variant="body2"
              onClick={() => handleBreadcrumbClick(index)}
              sx={{
                textDecoration: 'none',
                color: index === currentPath.length - 1 ? 'primary.main' : 'text.primary',
                fontWeight: index === currentPath.length - 1 ? 600 : 400,
              }}
            >
              {path}
            </Link>
          ))}
        </Breadcrumbs>

        {/* File Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Size</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Modified</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': { backgroundColor: 'action.hover' },
                    cursor: file.type === 'folder' ? 'pointer' : 'default',
                  }}
                  onClick={() => handleNavigate(file)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {file.type === 'folder' ? (
                        <FolderIcon sx={{ color: 'primary.main' }} />
                      ) : (
                        <FileIcon sx={{ color: 'text.secondary' }} />
                      )}
                      <Typography variant="body2">{file.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.modified}</TableCell>
                  <TableCell align="right">
                    {file.type === 'file' && (
                      <>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(file.name)
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file.name)
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Files to S3</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              mt: 2,
            }}
          >
            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              Drag & drop files here
            </Typography>
            <Typography variant="caption" color="text.secondary">
              or click to browse
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            enqueueSnackbar('Files uploaded successfully', { variant: 'success' })
            setUploadDialogOpen(false)
          }}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onClose={() => setNewFolderDialogOpen(false)}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFolderDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateFolder}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default S3Manager
