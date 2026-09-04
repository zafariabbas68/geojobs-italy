import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, Chip, Button,
  CircularProgress, Divider, Avatar, Card, CardContent, Snackbar, Alert
} from '@mui/material';
import {
  LocationOn, Business, Work, AttachMoney,
  ArrowBack, Bookmark, BookmarkBorder, CheckCircle
} from '@mui/icons-material';
import { jobService, authService } from '../services/api';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchJob();
    checkAuth();
  }, [id]);

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  };

  const fetchJob = async () => {
    try {
      setLoading(true);
      const jobs = await jobService.getJobs();
      const found = jobs.find((j: any) => j.id === id);
      if (found) {
        setJob(found);
      }
    } catch (err) {
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please login to apply for this job',
        severity: 'error'
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    setApplied(true);
    setSnackbar({
      open: true,
      message: '✅ Application submitted successfully!',
      severity: 'success'
    });
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please login to save this job',
        severity: 'error'
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    setSaved(!saved);
    setSnackbar({
      open: true,
      message: saved ? 'Job removed from saved' : '✅ Job saved successfully!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!job) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Job not found</Typography>
        <Button component={Link} to="/jobs" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
          Back to Jobs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button component={Link} to="/jobs" startIcon={<ArrowBack />} sx={{ mb: 3 }}>
        Back to Jobs
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: '#1a5276', mr: 2 }}>
                {job.company_name?.[0] || 'C'}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {job.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5a6a' }}>
                  {job.company_name || 'Company'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ color: '#1a5276' }} />
                  <Typography variant="body2">{job.city || 'Italy'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Work sx={{ color: '#1a5276' }} />
                  <Typography variant="body2">{job.job_type || 'Full-time'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney sx={{ color: '#1a5276' }} />
                  <Typography variant="body2">
                    €{job.salary_min || 'N/A'} - €{job.salary_max || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Job Description
            </Typography>
            <Typography variant="body1" sx={{ color: '#4a5a6a', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {job.description || 'No description available.'}
            </Typography>

            {job.skills && job.skills.length > 0 && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                  Required Skills
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {job.skills.map((skill: string) => (
                    <Chip key={skill} label={skill} sx={{ bgcolor: '#e8f0fe', color: '#1a5276' }} />
                  ))}
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Apply Now
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={handleApply}
                disabled={applied}
                sx={{
                  mb: 2,
                  py: 1.5,
                  background: applied ? '#22c55e' : 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)'
                }}
              >
                {applied ? <CheckCircle sx={{ mr: 1 }} /> : null}
                {applied ? 'Applied!' : 'Apply for this Job'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleSave}
                startIcon={saved ? <Bookmark /> : <BookmarkBorder />}
                sx={{ borderColor: '#1a5276', color: '#1a5276' }}
              >
                {saved ? 'Saved' : 'Save Job'}
              </Button>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Company Overview
              </Typography>
              <Typography variant="body2" sx={{ color: '#4a5a6a' }}>
                {job.company_name || 'Company'} is hiring for this position in {job.city || 'Italy'}.
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Share this Job
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setSnackbar({ open: true, message: 'Link copied!', severity: 'success' });
                }}>
                  🔗 Copy Link
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
