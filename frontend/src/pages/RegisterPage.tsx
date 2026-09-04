import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Paper,
  Alert, CircularProgress, Avatar, MenuItem
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'candidate'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    // Validate email
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting registration:', formData);
      const result = await authService.register(formData);
      console.log('Registration result:', result);
      
      setSuccess('✅ Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle different error responses
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (detail.includes('already registered') || detail.includes('already exists')) {
          setError('This email is already registered. Please use a different email or login.');
        } else {
          setError(detail);
        }
      } else if (err.response?.status === 400) {
        setError('Invalid input. Please check your information.');
      } else if (err.response?.status === 409) {
        setError('Email already registered. Please use a different email or login.');
      } else {
        setError('Registration failed. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 5, borderRadius: 3, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: '#1a5276', width: 56, height: 56 }}>
            <PersonAdd />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 2, color: '#0e2f44' }}>
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ color: '#4a5a6a' }}>
            Join GeoJobs Italy today
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            helperText="Use a different email if you already have an account"
          />
          <TextField
            fullWidth
            label="Password (min 8 characters)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
            helperText="Password must be at least 8 characters"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            select
            label="I am a"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            disabled={loading}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            <MenuItem value="candidate">Job Seeker</MenuItem>
            <MenuItem value="company">Employer / Company</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
          </TextField>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0e2f44 0%, #1a5276 100%)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#4a5a6a' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1a5276', textDecoration: 'none', fontWeight: 600 }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
