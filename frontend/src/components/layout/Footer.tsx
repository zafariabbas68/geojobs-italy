import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { LinkedIn, Twitter, YouTube, GitHub } from '@mui/icons-material';

export const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#1a1a2e', color: 'white', py: 6, mt: 'auto' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <Typography sx={{ color: 'white', fontSize: 16 }}>G</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                GeoJobs Italy
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2 }}>
              The premier platform for geospatial professionals in Italy. Connecting talent with opportunities in GIS, remote sensing, surveying, and geoinformatics.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: '#9ca3af', '&:hover': { color: 'white' } }}>
                <LinkedIn />
              </IconButton>
              <IconButton sx={{ color: '#9ca3af', '&:hover': { color: 'white' } }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: '#9ca3af', '&:hover': { color: 'white' } }}>
                <YouTube />
              </IconButton>
              <IconButton sx={{ color: '#9ca3af', '&:hover': { color: 'white' } }}>
                <GitHub />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              For Candidates
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Search Jobs
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Upload CV
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Career Resources
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Salary Guide
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              For Employers
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Post a Job
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Talent Search
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Pricing
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Employer Branding
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                About Us
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Contact
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Blog
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                FAQ
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Privacy Policy
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Terms of Service
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Cookie Policy
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: '#374151' }} />
        <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
          © 2024 GeoJobs Italy. All rights reserved. Made with ❤️ for the geospatial community.
        </Typography>
      </Container>
    </Box>
  );
};
