import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Chip, CircularProgress, TextField, Avatar
} from '@mui/material';
import {
  LocationOn, Work, TrendingUp, People, Business,
  ArrowForward, Search, SatelliteAlt, Terrain, Map,
  Height, CompassCalibration, Layers,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { jobService } from '../services/api';

export const HomePage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs();
      if (Array.isArray(data)) {
        setJobs(data);
        setFilteredJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    const filtered = jobs.filter((job: any) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredJobs(filtered);
  };

  const stats = [
    { icon: <Work />, label: 'Active Jobs', value: jobs.length || 0 },
    { icon: <People />, label: 'Candidates', value: '3,892' },
    { icon: <Business />, label: 'Companies', value: '486' },
    { icon: <TrendingUp />, label: 'Placements', value: '2,156' }
  ];

  const categories = [
    { name: 'GIS & Mapping', icon: <Map />, color: '#2e86c1' },
    { name: 'Remote Sensing', icon: <SatelliteAlt />, color: '#27ae60' },
    { name: 'Surveying', icon: <CompassCalibration />, color: '#f39c12' },
    { name: 'Elevation Models', icon: <Height />, color: '#8e44ad' },
    { name: 'Terrain Analysis', icon: <Terrain />, color: '#e67e22' },
    { name: 'Geospatial', icon: <Layers />, color: '#1a5276' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0e2f44 0%, #1a5276 30%, #2e86c1 70%, #52be80 100%)',
          color: 'white',
          py: 10,
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="overline"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  letterSpacing: 3,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                🛰️ Geospatial Career Platform
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.1,
                  background: 'linear-gradient(to right, #ffffff, #a8d8ea)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Find Your Place in
                <br />
                <Box component="span" sx={{ color: '#f7dc6f', WebkitTextFillColor: '#f7dc6f' }}>
                  Geospatial
                </Box>{' '}
                Innovation
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400, maxWidth: 600 }}
              >
                Connect with top geospatial companies in Italy. From GIS and remote sensing
                to surveying and Earth observation — your next opportunity is here.
              </Typography>

              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: 'flex',
                  bgcolor: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: 'none',
                      '& fieldset': { border: 'none' },
                      '& input': { py: 2, px: 3, fontSize: '1rem' },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: 0,
                    px: 5,
                    background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)',
                  }}
                >
                  <Search sx={{ mr: 1 }} /> Search
                </Button>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {['GIS', 'Remote Sensing', 'Surveying', 'Earth Observation', 'Python'].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => setSearchTerm(tag)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 350,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  p: 4,
                }}
              >
                <SatelliteAlt sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                  Italy's #1 Geospatial
                  <br />Job Platform
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, textAlign: 'center' }}>
                  Connecting talent with opportunities
                  <br />in GIS, Remote Sensing & Surveying
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {stats.map((stat, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 4,
                  px: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
                }}
              >
                <Box sx={{ color: '#1a5276', fontSize: 40 }}>{stat.icon}</Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0e2f44' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#4a5a6a' }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: '#f0f4f8', py: 6 }}>
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, textAlign: 'center', mb: 2, color: '#0e2f44' }}
          >
            Explore by Specialization
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#4a5a6a', textAlign: 'center', mb: 4 }}
          >
            Find opportunities in your area of expertise
          </Typography>

          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={2} key={category.name}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    px: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: `2px solid transparent`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: category.color,
                      boxShadow: `0 12px 40px ${category.color}20`,
                    },
                  }}
                >
                  <Box sx={{ color: category.color, fontSize: 48 }}>{category.icon}</Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mt: 1, color: '#0e2f44' }}>
                    {category.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Jobs Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0e2f44' }}>
              Featured Opportunities
            </Typography>
            <Typography variant="body2" sx={{ color: '#4a5a6a' }}>
              Top geospatial jobs in Italy
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/jobs"
            endIcon={<ArrowForward />}
            sx={{ color: '#1a5276' }}
          >
            View All
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#4a5a6a' }}>
              No jobs available
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.slice(0, 6).map((job: any) => (
              <Grid item xs={12} md={4} key={job.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: 'rgba(26, 82, 118, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#1a5276' }}>
                          {job.company_name?.[0] || 'C'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {job.title || 'Position'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#4a5a6a' }}>
                          {job.company_name || 'Company'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, color: '#4a5a6a' }} />
                      <Typography variant="body2">{job.city || 'Italy'}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={job.job_type?.replace('_', ' ') || 'Full-time'}
                        size="small"
                        sx={{ bgcolor: 'rgba(46, 134, 193, 0.1)', color: '#1a5276' }}
                      />
                      <Chip
                        label={job.experience_level || 'Mid Level'}
                        size="small"
                        sx={{ bgcolor: 'rgba(39, 174, 96, 0.1)', color: '#1a7a42' }}
                      />
                    </Box>

                    <Typography sx={{ fontWeight: 600, color: '#1a7a42' }}>
                      €{job.salary_min || 30000} - €{job.salary_max || 50000}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                      {(job.skills || []).slice(0, 3).map((skill: string) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          sx={{ bgcolor: '#f0f4f8', color: '#4a5a6a' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0e2f44 0%, #1a5276 50%, #2e86c1 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Explore?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400 }}>
            Whether you're launching your career or your next satellite,
            GeoJobs Italy is here to connect you.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/jobs"
              sx={{
                bgcolor: 'white',
                color: '#1a5276',
                px: 5,
                py: 1.5,
              }}
            >
              Browse Jobs
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/post-job"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 5,
                py: 1.5,
              }}
            >
              Post a Job
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
