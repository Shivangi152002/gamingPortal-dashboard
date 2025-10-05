import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import GameLibrary from '../components/GameManagement/GameLibrary'
import GameUpload from '../components/GameManagement/GameUpload'
import GameEditor from '../components/GameManagement/GameEditor'
import GameDataViewer from '../components/GameManagement/GameDataViewer'

const GameManagement = () => {
  return (
    <Routes>
      <Route path="library" element={<GameLibrary />} />
      <Route path="upload" element={<GameUpload />} />
      <Route path="editor" element={<GameEditor />} />
      <Route path="editor/:gameId" element={<GameEditor />} />
      <Route path="data-viewer" element={<GameDataViewer />} />
      <Route path="*" element={<Navigate to="library" replace />} />
    </Routes>
  )
}

export default GameManagement
