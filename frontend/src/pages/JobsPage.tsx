import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, 
  Chip, TextField, MenuItem, Box, Button, 
  CircularProgress, Pagination, Paper, InputAdornment,
  Avatar, CardActions
} from '@mui/material';
import { 
  Search, LocationOn, Work, FilterList, 
  Clear, ArrowForward 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { jobService } from '../services/api';

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    experienceLevel: '',
    city: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const jobsPerPage = 9;

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs();
      if (Array.isArray(data)) {
        setJobs(data);
        setTotalJobs(data.length);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs();
      if (Array.isArray(data)) {
        let filtered = data;
        if (searchTerm) {
          filtered = filtered.filter((job: any) =>
            job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.city?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (filters.jobType) {
          filtered = filtered.filter((job: any) => 
            job.job_type?.toLowerCase() === filters.jobType.toLowerCase()
          );
        }
        if (filters.experienceLevel) {
          filtered = filtered.filter((job: any) => 
            job.experience_level?.toLowerCase() === filters.experienceLevel.toLowerCase()
          );
        }
        if (filters.city) {
          filtered = filtered.filter((job: any) => 
            job.city?.toLowerCase().includes(filters.city.toLowerCase())
          );
        }
        setJobs(filtered);
        setTotalJobs(filtered.length);
        setPage(1);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ jobType: '', experienceLevel: '', city: '' });
    fetchJobs();
  };

  const jobTypes = ['', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'];
  const experienceLevels = ['', 'ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE'];

  // Calculate pagination
  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const displayedJobs = jobs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Find Your Next Opportunity
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          {totalJobs} jobs available in Italy
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Search jobs, companies, or keywords..."
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
            onClick={handleSearch}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Search
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<FilterList />}
          >
            Filters
          </Button>
          <Button 
            variant="text" 
            onClick={clearFilters}
            startIcon={<Clear />}
            sx={{ color: '#6b7280' }}
          >
            Clear
          </Button>
        </Box>

        {/* Filters */}
        {showFilters && (
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Job Type"
              value={filters.jobType}
              onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
              size="small"
              sx={{ minWidth: 150 }}
            >
              {jobTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type || 'All Types'}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Experience Level"
              value={filters.experienceLevel}
              onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
              size="small"
              sx={{ minWidth: 150 }}
            >
              {experienceLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level || 'All Levels'}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="City"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              size="small"
              sx={{ minWidth: 150 }}
              placeholder="Filter by city"
            />
            <Button variant="contained" onClick={handleSearch} size="small">
              Apply Filters
            </Button>
          </Box>
        )}
      </Paper>

      {/* Results */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6">No jobs found</Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {displayedJobs.map((job: any) => (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#667eea', mr: 2 }}>
                        {job.company?.name?.[0] || 'C'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {job.title || 'Position'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {job.company?.name || 'Company'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Typography variant="body2">{job.city || 'Italy'}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        label={job.job_type?.replace('_', ' ') || 'Full-time'} 
                        size="small" 
                        sx={{ bgcolor: '#e8f0fe', color: '#667eea' }}
                      />
                      <Chip 
                        label={job.experience_level || 'Mid Level'} 
                        size="small" 
                        sx={{ bgcolor: '#f0fdf4', color: '#22c55e' }}
                      />
                    </Box>

                    <Typography sx={{ fontWeight: 600, color: '#22c55e' }}>
                      €{job.salary_min || 30000} - €{job.salary_max || 50000}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                      {(job.skills || []).slice(0, 3).map((skill: string) => (
                        <Chip 
                          key={skill} 
                          label={skill} 
                          size="small" 
                          sx={{ bgcolor: '#f3f4f6', fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      component={Link} 
                      to={`/jobs/${job.id}`}
                      sx={{ borderColor: '#667eea', color: '#667eea' }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};
