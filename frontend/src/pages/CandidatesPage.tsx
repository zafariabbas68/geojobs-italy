import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, 
  Avatar, Box, Chip, TextField, Button, 
  CircularProgress, Paper, InputAdornment, 
  CardActions, Rating
} from '@mui/material';
import { Search, LocationOn, Work, Email } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { candidateService } from '../services/api';

export const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getCandidates();
      if (Array.isArray(data)) {
        setCandidates(data);
      } else {
        // Sample data if no candidates in DB
        setCandidates([
          {
            id: '1',
            user: { first_name: 'Maria', last_name: 'Rossi' },
            current_title: 'GIS Developer',
            city: 'Milan',
            skills: ['Python', 'PostGIS', 'React', 'Leaflet'],
            years_experience: 5,
            is_available: true,
          },
          {
            id: '2',
            user: { first_name: 'Giuseppe', last_name: 'Verdi' },
            current_title: 'Remote Sensing Specialist',
            city: 'Rome',
            skills: ['Python', 'Machine Learning', 'QGIS', 'SNAP'],
            years_experience: 7,
            is_available: true,
          },
          {
            id: '3',
            user: { first_name: 'Anna', last_name: 'Bianchi' },
            current_title: 'GIS Analyst',
            city: 'Turin',
            skills: ['ArcGIS Pro', 'QGIS', 'Data Analysis'],
            years_experience: 3,
            is_available: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter((c: any) =>
    c.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.current_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Find Top Talent
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          {candidates.length} candidates available
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Search candidates by name, title, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#667eea' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredCandidates.map((candidate: any) => (
            <Grid item xs={12} md={6} lg={4} key={candidate.id}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: '#667eea', mr: 2 }}>
                      {candidate.user?.first_name?.[0] || 'C'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {candidate.user?.first_name} {candidate.user?.last_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {candidate.current_title || 'Professional'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#6b7280' }} />
                    <Typography variant="body2">{candidate.city || 'Italy'}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`${candidate.years_experience || 0} years exp`}
                      size="small" 
                      sx={{ bgcolor: '#f0fdf4', color: '#22c55e' }}
                    />
                    <Chip 
                      label={candidate.is_available ? 'Available' : 'Not Available'}
                      size="small" 
                      sx={{ bgcolor: candidate.is_available ? '#dcfce7' : '#fee2e2', 
                            color: candidate.is_available ? '#22c55e' : '#ef4444' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {(candidate.skills || []).map((skill: string) => (
                      <Chip 
                        key={skill} 
                        label={skill} 
                        size="small" 
                        sx={{ bgcolor: '#e8f0fe', color: '#667eea' }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    component={Link} 
                    to={`/candidates/${candidate.id}`}
                    sx={{ borderColor: '#667eea', color: '#667eea' }}
                  >
                    View Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
