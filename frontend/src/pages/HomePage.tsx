import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip, Avatar } from '@mui/material';
import { Search, LocationOn, Work, TrendingUp, People, Business, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const stats = [
    { icon: <Work sx={{ fontSize: 40 }} />, label: 'Active Jobs', value: '1,247' },
    { icon: <People sx={{ fontSize: 40 }} />, label: 'Candidates', value: '3,892' },
    { icon: <Business sx={{ fontSize: 40 }} />, label: 'Companies', value: '486' },
    { icon: <TrendingUp sx={{ fontSize: 40 }} />, label: 'Placements', value: '2,156' },
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'GIS Developer',
      company: 'Politecnico di Milano',
      location: 'Milan, Italy',
      type: 'Full-time',
      salary: '€45k - €60k',
      tags: ['Python', 'PostGIS', 'React'],
      logo: '',
    },
    {
      id: 2,
      title: 'Remote Sensing Specialist',
      company: 'ESA - ESRIN',
      location: 'Frascati, Italy',
      type: 'Contract',
      salary: '€50k - €70k',
      tags: ['Sentinel-2', 'Python', 'Machine Learning'],
      logo: '',
    },
    {
      id: 3,
      title: 'Geospatial Data Engineer',
      company: 'CGR S.p.A.',
      location: 'Parma, Italy',
      type: 'Full-time',
      salary: '€40k - €55k',
      tags: ['AWS', 'GeoServer', 'Python'],
      logo: '',
    },
  ];

  const categories = [
    { name: 'GIS & Mapping', icon: '🗺️', count: 342 },
    { name: 'Remote Sensing', icon: '🛰️', count: 178 },
    { name: 'Surveying', icon: '📏', count: 215 },
    { name: 'Geoinformatics', icon: '💻', count: 156 },
    { name: 'Cartography', icon: '📐', count: 89 },
    { name: 'Drone Operations', icon: '✈️', count: 67 },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="overline"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  letterSpacing: 2,
                  fontWeight: 600,
                }}
              >
                Welcome to GeoJobs Italy
              </Typography>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                Find Your Dream Job in{' '}
                <Box component="span" sx={{ color: '#ffd700' }}>
                  Geospatial
                </Box>
                <br />
                Industry
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400 }}>
                Connect with top geospatial companies in Italy. From GIS to remote sensing,
                surveying to geoinformatics - your next opportunity is here.
              </Typography>

              {/* Search Bar */}
              <Box
                sx={{
                  display: 'flex',
                  backgroundColor: 'white',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                  }}
                >
                  <Search sx={{ color: '#667eea' }} />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or keywords..."
                    style={{
                      border: 'none',
                      padding: '16px',
                      width: '100%',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 0,
                    px: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd6 0%, #6a3d91 100%)',
                    },
                  }}
                >
                  Search
                </Button>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Popular searches:
                </Typography>
                {['GIS', 'Remote Sensing', 'Surveying', 'Python'].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 400,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'white' }}>
                    🗺️
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Italy's #1 Geospatial Job Platform
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={3} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 3,
                  px: 2,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ color: '#667eea' }}>{stat.icon}</Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="overline" sx={{ color: '#667eea', fontWeight: 600 }}>
            Categories
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Explore by Specialization
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 600, mx: 'auto' }}>
            Find jobs tailored to your expertise in the geospatial field
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={2} key={category.name}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 3,
                  px: 2,
                  cursor: 'pointer',
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(102,126,234,0.15)',
                    borderColor: '#667eea',
                  },
                }}
              >
                <Typography variant="h3" sx={{ fontSize: 40 }}>
                  {category.icon}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
                  {category.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                  {category.count} jobs
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Jobs Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 6 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#667eea', fontWeight: 600 }}>
                Featured Jobs
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                Top Opportunities
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/jobs"
              endIcon={<ArrowForward />}
              sx={{ color: '#667eea' }}
            >
              View All Jobs
            </Button>
          </Box>

          <Grid container spacing={3}>
            {featuredJobs.map((job) => (
              <Grid item xs={12} md={4} key={job.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#667eea' }}>
                        {job.company[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {job.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {job.company}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ fontSize: 16, color: '#6b7280', mr: 0.5 }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {job.location}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        • {job.type}
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#22c55e', mb: 2 }}>
                      {job.salary}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {job.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: '#e8f0fe',
                            color: '#667eea',
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      component={Link}
                      to={`/jobs/${job.id}`}
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#5a6fd6',
                          backgroundColor: 'rgba(102,126,234,0.05)',
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400 }}>
            Whether you're looking for your next role or the perfect candidate,
            GeoJobs Italy is here to connect you.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/jobs"
              sx={{
                backgroundColor: 'white',
                color: '#667eea',
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
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
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.8)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
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
