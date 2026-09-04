import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Paper,
  Alert, CircularProgress, Avatar
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(email, password);
      if (result.access_token) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 5, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: '#1a5276', width: 56, height: 56 }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 2, color: '#0e2f44' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: '#4a5a6a' }}>
            Sign in to your GeoJobs Italy account
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0e2f44 0%, #1a5276 100%)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#4a5a6a' }}>
            New to GeoJobs?{' '}
            <Link to="/register" style={{ color: '#1a5276', textDecoration: 'none', fontWeight: 600 }}>
              Create an account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
