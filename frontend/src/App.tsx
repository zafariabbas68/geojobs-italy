import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { PostJobPage } from './pages/PostJobPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { CompanyPage } from './pages/CompanyPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApplyPage } from './pages/ApplyPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import './index.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="jobs/:jobId/apply" element={<ApplyPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="candidates/:id" element={<CandidateProfilePage />} />
            <Route path="post-job" element={<PostJobPage />} />
            <Route path="company/:id" element={<CompanyPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
