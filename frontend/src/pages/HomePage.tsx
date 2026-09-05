import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Chip, CircularProgress, TextField, Avatar, MenuItem, Select,
  FormControl, InputLabel, Paper, IconButton, Drawer, Badge
} from '@mui/material';
import {
  LocationOn, Work, TrendingUp, People, Business,
  ArrowForward, Search, SatelliteAlt, Terrain, Map,
  Height, CompassCalibration, Layers, FilterList,
  Close, CalendarToday, Category as CategoryIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { jobService } from '../services/api';

export const HomePage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    region: '',
    city: '',
    date_range: '14d'
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [availableFilters, setAvailableFilters] = useState<any>({
    categories: [],
    regions: [],
    cities: [],
    date_ranges: ['24h', '3d', '7d', '14d', '30d']
  });

  useEffect(() => {
    fetchJobs();
    fetchFilters();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.category) params.append('category', filters.category);
      if (filters.region) params.append('region', filters.region);
      if (filters.city) params.append('city', filters.city);
      if (filters.date_range) params.append('date_range', filters.date_range);
      
      const data = await jobService.getJobs(params.toString());
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

  const fetchFilters = async () => {
    try {
      // Try to get filters from API, fallback to defaults
      const response = await fetch('/api/v1/jobs/filters');
      if (response.ok) {
        const data = await response.json();
        setAvailableFilters(data);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    setFilterOpen(false);
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({ category: '', region: '', city: '', date_range: '14d' });
    setSearchTerm('');
    setTimeout(fetchJobs, 100);
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

  const stats = [
    { icon: <Work />, label: 'Active Jobs', value: jobs.length || 0 },
    { icon: <People />, label: 'Candidates', value: '3,892' },
    { icon: <Business />, label: 'Companies', value: '486' },
    { icon: <TrendingUp />, label: 'Placements', value: '2,156' }
  ];

  const categories = [
    { name: 'GIS & Geospatial', icon: <Map />, color: '#2e86c1' },
    { name: 'Remote Sensing', icon: <SatelliteAlt />, color: '#27ae60' },
    { name: 'Surveying', icon: <CompassCalibration />, color: '#f39c12' },
    { name: 'Civil Engineering', icon: <Terrain />, color: '#e74c3c' },
    { name: 'Software Engineering', icon: <Layers />, color: '#9b59b6' },
    { name: 'Environmental', icon: <Height />, color: '#2ecc71' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0e2f44 0%, #1a5276 30%, #2e86c1 70%, #52be80 100%)',
          color: 'white',
          py: 8,
          minHeight: '55vh',
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
                🛰️ Italy's Geospatial Career Platform
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
                & Engineering
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400, maxWidth: 600 }}
              >
                Connect with top companies across Italy. From GIS and remote sensing
                to civil engineering and software development.
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
                    px: 4,
                    background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)',
                  }}
                >
                  <Search sx={{ mr: 1 }} /> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setFilterOpen(true)}
                  sx={{
                    borderRadius: 0,
                    px: 3,
                    background: '#764ba2',
                    minWidth: 'auto',
                  }}
                >
                  <Badge badgeContent={activeFilterCount} color="error">
                    <FilterList />
                  </Badge>
                </Button>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {['GIS', 'Remote Sensing', 'Surveying', 'Civil Engineer', 'Python'].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => setSearchTerm(tag)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
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
                  height: 300,
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
                <SatelliteAlt sx={{ fontSize: 70, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                  Italy's #1 Geospatial
                  <br />Job Platform
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
                  {jobs.length} jobs across {availableFilters.regions?.length || 20} regions
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
                  onClick={() => {
                    setFilters({ ...filters, category: category.name });
                    setTimeout(fetchJobs, 100);
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
              {filteredJobs.length} jobs available across Italy
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
              No jobs found matching your criteria
            </Typography>
            <Button onClick={clearFilters} sx={{ mt: 2 }}>
              Clear Filters
            </Button>
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
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
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
                      {job.region && job.region !== 'Unknown' && (
                        <Chip
                          label={job.region}
                          size="small"
                          sx={{ bgcolor: '#e8f0fe', color: '#1a5276', fontSize: '0.6rem' }}
                        />
                      )}
                    </Box>

                    {job.category && (
                      <Chip
                        label={job.category}
                        size="small"
                        sx={{ bgcolor: 'rgba(46, 134, 193, 0.1)', color: '#1a5276', mb: 1 }}
                      />
                    )}

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

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{
          sx: { width: 380, p: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Filters
            <Typography component="span" sx={{ fontSize: '0.8rem', color: '#4a5a6a', ml: 1 }}>
              ({activeFilterCount} active)
            </Typography>
          </Typography>
          <IconButton onClick={() => setFilterOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {(availableFilters.categories || ['GIS & Geospatial', 'Remote Sensing', 'Surveying', 'Civil Engineering', 'Software Engineering']).map((cat: string) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Region</InputLabel>
          <Select
            value={filters.region}
            label="Region"
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            <MenuItem value="">All Regions</MenuItem>
            {(availableFilters.regions || ['Lombardy', 'Lazio', 'Campania', 'Veneto', 'Emilia-Romagna', 'Piedmont', 'Tuscany', 'Puglia', 'Sicily', 'Sardinia']).map((region: string) => (
              <MenuItem key={region} value={region}>{region}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>City</InputLabel>
          <Select
            value={filters.city}
            label="City"
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            <MenuItem value="">All Cities</MenuItem>
            {(availableFilters.cities || ['Milan', 'Rome', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania']).map((city: string) => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Date Posted</InputLabel>
          <Select
            value={filters.date_range}
            label="Date Posted"
            onChange={(e) => handleFilterChange('date_range', e.target.value)}
          >
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="3d">Last 3 Days</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="14d">Last 14 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          onClick={applyFilters}
          sx={{
            py: 1.5,
            background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)',
            mb: 1
          }}
        >
          Apply Filters
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={clearFilters}
          sx={{ borderColor: '#1a5276', color: '#1a5276' }}
        >
          Clear All Filters
        </Button>
      </Drawer>

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
            Find your next opportunity or the perfect candidate for your team.
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
              Browse All Jobs
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
