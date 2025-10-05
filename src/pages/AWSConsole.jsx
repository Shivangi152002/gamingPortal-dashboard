import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import S3Manager from '../components/AWS/S3Manager'
import CloudFrontManager from '../components/AWS/CloudFrontManager'
import StorageAnalytics from '../components/AWS/StorageAnalytics'

const AWSConsole = () => {
  return (
    <Routes>
      <Route path="s3" element={<S3Manager />} />
      <Route path="cloudfront" element={<CloudFrontManager />} />
      <Route path="performance" element={<StorageAnalytics />} />
      <Route path="*" element={<Navigate to="s3" replace />} />
    </Routes>
  )
}

export default AWSConsole
