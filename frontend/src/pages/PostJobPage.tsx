import React, { useState } from 'react';
import {
  Container, Typography, Paper, Box, TextField,
  Button, MenuItem, Alert, CircularProgress,
  Stepper, Step, StepLabel, Chip, Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jobService, authService } from '../services/api';

export const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    city: '',
    province: '',
    country: 'Italy',
    job_type: 'FULL_TIME',
    experience_level: 'MID',
    salary_min: '',
    salary_max: '',
    skills: '',
    is_remote: false,
  });

  const steps = ['Job Details', 'Requirements', 'Review'];

  const jobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'];
  const experienceLevels = ['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Please login to post a job',
          severity: 'error'
        });
        setTimeout(() => navigate('/login'), 1500);
        setLoading(false);
        return;
      }

      const jobData = {
        ...formData,
        salary_min: parseInt(formData.salary_min) || 0,
        salary_max: parseInt(formData.salary_max) || 0,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      };

      const result = await jobService.createJob(jobData);
      console.log('Job posted:', result);
      setSuccess(true);
      setActiveStep(2);
      setSnackbar({
        open: true,
        message: '✅ Job posted successfully!',
        severity: 'success'
      });
      setTimeout(() => navigate('/jobs'), 3000);
    } catch (err: any) {
      console.error('Error posting job:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setSnackbar({
          open: true,
          message: 'Please login as a company to post jobs',
          severity: 'error'
        });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(err.response?.data?.detail || 'Failed to post job. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isStepValid = () => {
    if (activeStep === 0) {
      return formData.title && formData.description && formData.city && formData.job_type;
    }
    if (activeStep === 1) {
      return formData.requirements && formData.salary_min && formData.salary_max;
    }
    return true;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Post a Job
      </Typography>
      <Typography variant="body1" sx={{ color: '#4a5a6a', mb: 4 }}>
        Reach top geospatial talent in Italy
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {success ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h5" sx={{ color: '#22c55e', mb: 2 }}>
            ✅ Job Posted Successfully!
          </Typography>
          <Typography variant="body1" sx={{ color: '#4a5a6a' }}>
            Your job listing is now live and visible to candidates.
            Redirecting to jobs page...
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder="e.g. GIS Developer"
                />
                <TextField
                  fullWidth
                  label="Job Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                  required
                  placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                />
                <TextField
                  select
                  fullWidth
                  label="Job Type"
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  margin="normal"
                  required
                >
                  {jobTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder="e.g. Milan"
                />
                <TextField
                  fullWidth
                  label="Province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="e.g. Lombardy"
                />
              </>
            )}

            {activeStep === 1 && (
              <>
                <TextField
                  select
                  fullWidth
                  label="Experience Level"
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  margin="normal"
                  required
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                  required
                  placeholder="List the skills, qualifications, and experience required..."
                />
                <TextField
                  fullWidth
                  label="Minimum Salary (€)"
                  name="salary_min"
                  type="number"
                  value={formData.salary_min}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Maximum Salary (€)"
                  name="salary_max"
                  type="number"
                  value={formData.salary_max}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Skills (comma separated)"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="Python, GIS, PostGIS, React"
                />
              </>
            )}

            {activeStep === 2 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Review Your Job Posting
                </Typography>
                <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography><strong>Title:</strong> {formData.title}</Typography>
                  <Typography><strong>Type:</strong> {formData.job_type.replace('_', ' ')}</Typography>
                  <Typography><strong>Location:</strong> {formData.city}, {formData.country}</Typography>
                  <Typography><strong>Salary:</strong> €{formData.salary_min} - €{formData.salary_max}</Typography>
                  <Typography><strong>Skills:</strong> {formData.skills}</Typography>
                </Paper>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Back
              </Button>
              <Box>
                {activeStep === 2 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)' }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Post Job'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(activeStep + 1)}
                    disabled={!isStepValid()}
                    sx={{ background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)' }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Paper>
      )}

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
